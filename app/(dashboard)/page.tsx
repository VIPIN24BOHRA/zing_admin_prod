'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
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
          console.log(data);
          const Orders =
            Object.keys(data ?? {})
              ?.map((key) => {
                if (data[key].createdAt)
                  return {
                    ...data[key],
                    key: key
                  };
                else null;
              })
              ?.filter((v) => v != null) ?? [];
          Orders.sort((a, b) => b.createdAt - a.createdAt);

          console.log(Orders);
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

          console.log('these are products', product);
          console.log([{ ...newOrder, key }, ...product]);

          setProduct((prevProducts) => [{ ...newOrder, key }, ...prevProducts]);
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
  }, []);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        {showPopUp ? (
          <div className="fixed w-full h-[100vh] bg-[#aaaa] top-0 z-[100] flex flex-row justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <p className="mb-8">
                <span className='font-bold'>You will get sound Notification for New Orders.</span>
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
          {/* <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger> */}
        </TabsList>
        {/* <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div> */}
      </div>
      <TabsContent value="all">
        <ProductsTable products={product} offset={0} totalProducts={0} />
      </TabsContent>
    </Tabs>
  );
}
