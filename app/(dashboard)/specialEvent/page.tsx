'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import {
  get,
  getDatabase,
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
import { ProductsTable } from '../products-table';

export default function ProductsPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const [product, setProduct] = useState<any[]>([]);
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [showPopUp, setShowPopUp] = useState(true);
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;

  useEffect(() => {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'orders/');

    let lastKnownTimestamp = Date.now();

    get(starCountRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          let idx = 0;

          const Orders =
            Object.keys(data ?? {})
              ?.map((key) => {
                if (
                  data[key]?.cartItems?.length == 1 &&
                  data[key].cartItems[0]?.item?.title == 'Rasmalai' &&
                  data[key].createdAt
                ) {
                  idx++;
                  return {
                    ...data[key],
                    key: key,
                    orderNo: idx
                  };
                } else return null;
              })
              ?.filter((v) => v != null) ?? [];
          Orders.sort((a, b) => b.createdAt - a.createdAt);

          setProduct(Orders);
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

    onChildAdded(
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
            setProduct((prevProducts) => [
              {
                ...newOrder,
                key,
                orderNo: prevProducts.length + 1
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
  }, []);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
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

        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <ProductsTable products={product} offset={0} totalProducts={0} />
      </TabsContent>
    </Tabs>
  );
}
