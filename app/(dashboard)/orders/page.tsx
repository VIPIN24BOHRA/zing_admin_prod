'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { useEffect, useState } from 'react';
import { get, getDatabase, limitToLast, query, ref } from 'firebase/database';
import { app } from '@/lib/db';
import { PlusCircle, File } from 'lucide-react';
import { convertToCSV, downloadCSV } from '@/lib/utils';
import { useAuth } from 'providers/authProvider/authContext';
import { useRouter } from 'next/navigation';

const productsPerPage = 50;

export default function OrderHistoryPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const [product, setProduct] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [currentProducts, setCurrentProducts] = useState<any[]>([]);

  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page
    }
  }, [user, loading, router]);

  const nextPage = () => {
    const currentOffset = offset;
    setOffset(currentOffset + 1);
    setCurrentProducts(
      product.slice(
        (offset + 1) * productsPerPage,
        (offset + 2) * productsPerPage
      )
    );
  };

  const prevPage = () => {
    const currentOffset = offset;
    if (currentOffset != 0) {
      setOffset(currentOffset - 1);
      setCurrentProducts(
        product.slice((offset - 1) * productsPerPage, offset * productsPerPage)
      );
    }
  };

  useEffect(() => {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'orders/');

    get(query(starCountRef))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const Orders =
            Object.keys(data ?? {})
              ?.map((key) =>
                data[key].createdAt
                  ? {
                      ...data[key],
                      key: key
                    }
                  : null
              )
              ?.filter((v) => v != null) ?? [];
          Orders.sort((a, b) => b.createdAt - a.createdAt);

          console.log(Orders.length);

          setCurrentProducts(Orders.slice(0, productsPerPage));

          setProduct(Orders);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (loading || !user) {
    return <p>Loading...</p>; // Or a spinner/loading component
  }

  return (
    <Tabs defaultValue="order history">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 bg-black text-white"
            onClick={() => {
              const data = convertToCSV(product);

              downloadCSV(data);
            }}
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          {/* <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button> */}
        </div>
      </div>
      <TabsContent value="order history">
        <ProductsTable
          products={currentProducts}
          offset={offset}
          totalProducts={product.length}
          nextPage={nextPage}
          prevPage={prevPage}
          productsPerPage={productsPerPage}
        />
      </TabsContent>
    </Tabs>
  );
}
