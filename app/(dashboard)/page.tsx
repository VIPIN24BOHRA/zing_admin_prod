'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { app } from '@/lib/db';

export default function ProductsPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const [product, setProduct] = useState<any[]>([]);
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;

  useEffect(() => {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'orders/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const Orders = Object.values(data) ?? [];
      let Products: any[] = [];
      if (Orders.length) {
        Orders.forEach((orderObj: any) => {
          if (Object.values(orderObj ?? {})?.length) {
            Products = [...Products, ...Object.values(orderObj)];
          }
        });
      }
      console.log(Products);
      setProduct(Products);
    });
  }, []);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
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
