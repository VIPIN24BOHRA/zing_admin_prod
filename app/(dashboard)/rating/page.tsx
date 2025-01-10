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
  const [currentProducts, setCurrentProducts] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);

  const { user, loading } = useAuth();
  const router = useRouter();
  

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && user?.email === 'kitchen@getzing.app') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAndSortOrders = async () => {
      try {
        const db = getDatabase(app);
        const starCountRef = ref(db, 'orders/');

        const snapshot = await get(query(starCountRef));
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

          setProduct(Orders); 
          setCurrentProducts(Orders.slice(0, productsPerPage));
        }
      } catch (err) {
        console.error('Failed to fetch and sort orders:', err);
      }
    };

    fetchAndSortOrders();
  }, []);

  const prevPage = () => {
    if (offset > 0) {
      const newOffset = offset - 1;
      setOffset(newOffset);
      setCurrentProducts(
        product.slice(
          newOffset * productsPerPage,
          (newOffset + 1) * productsPerPage
        )
      );
    }
  };

  const nextPage = () => {
    const newOffset = offset + 1;
    if (newOffset * productsPerPage < product.length) {
      setOffset(newOffset);
      setCurrentProducts(
        product.slice(
          newOffset * productsPerPage,
          (newOffset + 1) * productsPerPage
        )
      );
    }
  };

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <Tabs defaultValue="order history">
      <TabsContent value="order history">
        <ProductsTable
          products={currentProducts}
          offset={offset}
          totalProducts={product.length}
          prevPage={prevPage}
          nextPage={nextPage}
          productsPerPage={productsPerPage}
        />
      </TabsContent>
    </Tabs>
  );
}
