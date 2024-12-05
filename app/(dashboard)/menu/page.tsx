'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { useEffect, useState } from 'react';
import {
  get,
  getDatabase,
  limitToLast,
  query,
  ref,
  set
} from 'firebase/database';
import { app } from '@/lib/db';
import { PlusCircle, File, Timer } from 'lucide-react';
import { convertToCSV, downloadCSV } from '@/lib/utils';

const productsPerPage = 50;

export default function MenuPage() {
  const [product, setProduct] = useState<any[]>([]);

  useEffect(() => {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'products/');

    get(query(starCountRef))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProduct(Object.values(data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChangeMenu = async (menyType: String) => {
    switch (menyType.toLocaleLowerCase()) {
      case 'breakfast':
        await handleShowOnlyMenyType('Breakfast ( 9 AM - 12 PM)');
        break;
      case 'lunch':
        await handleShowOnlyMenyType('Lunch ( 12 PM - 4 PM)');
        break;

      case 'evening':
        await handleShowOnlyMenyType('Evening ( 4 PM - 7 PM)');
        break;
      case 'dinner':
        await handleShowOnlyMenyType('Dinner ( 7 PM - 12 AM)');
        break;
    }
  };

  const handleShowOnlyMenyType = async (type: String) => {
    console.log(product);
    const allProduct = product.map((p) => {
      console.log(p.categories.find((val: String) => val == type));

      return p.categories.find((val: String) => val == type)
        ? { ...p, quantity: 10 }
        : { ...p, quantity: 0 };
    });
    allProduct[0].categories.forEach((t: any, idx: number) => {
      if (t == type) {
        allProduct[0].categories[idx] = allProduct[0].categories[0];
        allProduct[0].categories[0] = type;
      }
    });
    console.log(allProduct);

    const db = getDatabase(app);
    set(ref(db, 'products/'), allProduct)
      .then((snapshot) => {
        console.log(snapshot);
        setProduct(allProduct);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Tabs defaultValue="Menu">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 bg-black text-white"
            onClick={async () => {
              await handleChangeMenu('Breakfast');
            }}
          >
            <Timer className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Show breakfast menu
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 bg-black text-white"
            onClick={async () => {
              await handleChangeMenu('Lunch');
            }}
          >
            <Timer className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Show lunch menu
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 bg-black text-white"
            onClick={async () => {
              await handleChangeMenu('Evening');
            }}
          >
            <Timer className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Show Evening menu
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 bg-black text-white"
            onClick={async () => {
              await handleChangeMenu('Dinner');
            }}
          >
            <Timer className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Show dinner menu
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="Menu">
        <ProductsTable products={product} totalProducts={product.length} />
      </TabsContent>
    </Tabs>
  );
}
