'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import {
  get,
  getDatabase,
  limitToLast,
  onChildAdded,
  onValue,
  orderByChild,
  query,
  ref,
  set,
  startAt
} from 'firebase/database';
import { app } from '@/lib/db';
import SnackbarNotification from '@/components/snackbar/snackbar';
import { useAuth } from 'providers/authProvider/authContext';
import { useRouter } from 'next/navigation';
import { LiveOrdersProductsTable } from '../liveOrders/liveOrdersProductsTable';
// import { PlusCircle, File } from 'lucide-react';

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

  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;

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
        const [key, status, deliveredAt] = event.data.split('###');
        console.log(key, status, deliveredAt);
        if (key && status) {
          setProduct((prevProducts) =>
            prevProducts.map((order) =>
              order.key === key ? { ...order, status, deliveredAt } : order
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

          setProduct((prevProducts) => [
            {
              ...newOrder,
              key
            },
            ...prevProducts
          ]);
          setShowSnackBar(true);

          setTimeout(() => {
            setShowSnackBar(false);
          }, 4000);

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
        <LiveOrdersProductsTable products={product} userType="chef" />
      </TabsContent>
    </Tabs>
  );
}
