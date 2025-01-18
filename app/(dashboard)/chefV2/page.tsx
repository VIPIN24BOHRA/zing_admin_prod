'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import {
  get,
  getDatabase,
  limitToLast,
  onChildAdded,
  orderByChild,
  query,
  ref,
  startAt
} from 'firebase/database';
import { app } from '@/lib/db';
import SnackbarNotification from '@/components/snackbar/snackbar';
import { useAuth } from 'providers/authProvider/authContext';
import { useRouter } from 'next/navigation';
import { LiveOrdersProductsTable } from '../liveOrders/liveOrdersProductsTable';
import { ChefProductsTable } from './chefProductsTable';

export default function ProductsPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<any[]>([]);
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [showPopUp, setShowPopUp] = useState(true);
  const [isOnline, setOnline] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page
    }
  }, [user, loading, router]);

  useEffect(() => {
    // onoffline version

    window.onoffline = (event) => {
      console.log('The network connection has been lost.');
      console.log(event);
      setOnline(false);
    };

    let eventSource: any;
    const initSSE = () => {
      eventSource = new EventSource('https://api.getzing.app/sse');
      eventSource.onmessage = (event: any) => {
        console.log('Received data:', event.data);
        const [
          key,
          status,
          deliveredAt,
          deliveryBoyStatus,
          deliveryBoyName,
          lastUpdatedOn,
          kitchenStatus
        ] = event.data.split('###');

        if (key && status) {
          setProduct((prevProducts) =>
            prevProducts.map((order) =>
              order.key === key
                ? {
                    ...order,
                    status,
                    deliveredAt,
                    kitchen: {
                      status: kitchenStatus
                    },
                    deliveryBoy: order.deliveryBoy
                      ? {
                          ...order.deliveryBoy,
                          status: deliveryBoyStatus,
                          name: deliveryBoyName,
                          last_updated_on: lastUpdatedOn
                        }
                      : {
                          status: deliveryBoyStatus,
                          name: deliveryBoyName,
                          last_updated_on: lastUpdatedOn
                        }
                  }
                : order
            )
          );
        }
      };

      eventSource.onerror = (error: any) => {
        console.error('SSE error:', error);
        eventSource.close();
        setTimeout(() => initSSE(), 3000);
      };
    };

    initSSE();
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'orders/');

    let lastKnownTimestamp = Date.now();
    let todayStartingDayTs = new Date().setHours(0, 0, 0, 0);
    console.log(todayStartingDayTs);

    get(query(starCountRef, limitToLast(25)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const Orders =
            Object.keys(data ?? {})
              ?.map((key) => {
                if (data[key].createdAt) {
                  return {
                    ...data[key],
                    key: key
                  };
                } else null;
              })
              ?.filter((v) => v != null) ?? [];
          Orders.sort((a, b) => b.createdAt - a.createdAt);
          // now find the first order having order no.

          let orderNo = 0;
          for (let i = Orders.length - 1; i >= 0; i--) {
            if (Orders[i].orderNo && Orders[i].orderNo < 10000)
              orderNo = Orders[i].orderNo;
            else {
              orderNo++;
              Orders[i].orderNo = orderNo;
            }
          }
          console.log(orderNo);
          setProduct(Orders);
        } else {
          console.log('no value exists');
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const newChildAddedQuery = query(
      starCountRef,
      orderByChild('createdAt'),
      startAt(lastKnownTimestamp)
    );

    const unsubscribe = onChildAdded(
      newChildAddedQuery,

      (snapshot) => {
        if (snapshot.exists()) {
          const newOrder = snapshot.val();
          const key = snapshot.key;
          console.log('New Order Added:', newOrder, key);

          if (
            newOrder?.cartItems?.length == 1 &&
            newOrder.cartItems[0]?.item?.title == 'Rasmalai'
          ) {
            // do not read the data;
          } else {
            setProduct((prevProducts) => [
              {
                ...newOrder,
                key,
                orderNo: prevProducts[0].orderNo + 1
              },
              ...prevProducts
            ]);
            setShowSnackBar(true);

            setTimeout(() => {
              setShowSnackBar(false);
            }, 4000);
          }

          // You can handle the new order here, e.g., update state, display notification, etc.
        } else {
          console.log('No new data');
        }
      },
      (error) => {
        console.error('Error listening for new orders:', error);
      }
    );

    return () => {
      console.log('unsubscribing onchild added');
      unsubscribe();
    };
  }, []);

  if (loading || !user) {
    return <p>Loading...</p>; // Or a spinner/loading component
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        {!isOnline ? (
          <div className="fixed w-full h-[100vh] bg-[#aaaa] top-0 z-[100] flex flex-row justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-8">
                <span className="font-bold">
                  You are offline please connect to network and refersh the page
                </span>
                <br />
                <br />
                <span>Connect and referesh</span>
              </p>
              <Button
                onClick={() => {
                  window.location.reload();
                }}
              >
                Refresh
              </Button>
            </div>
          </div>
        ) : null}

        {showPopUp ? (
          <div className="fixed w-full h-[100vh] bg-[#aaaa] top-0 z-[100] flex flex-row justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-8">
                <span className="font-bold">
                  You will get sound Notification for New Orders.
                </span>
                <br />
                <br />
                <span>Don't close the tab to get the notification</span>
              </p>
              <Button
                onClick={() => {
                  setShowPopUp(false);
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        ) : null}

        <SnackbarNotification show={showSnackbar} />
      </div>
      <TabsContent value="all">
        <ChefProductsTable products={product} userType="chef" />
      </TabsContent>
    </Tabs>
  );
}
