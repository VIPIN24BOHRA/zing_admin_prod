'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProductsTable } from './products-table';
import { useEffect, useState } from 'react';
import { useAuth } from 'providers/authProvider/authContext';
import { useRouter } from 'next/navigation';
import { fetchAndSortOrders } from './ratingHandler';

const productsPerPage = 50;

export default function OrderHistoryPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  interface Order {
    key: string;
    [key: string]: any;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [offset, setOffset] = useState<string>('z');
  const [totalOrders, setTotalOrders] = useState<Order[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [dataLoading, setdataLoading] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (!loading && user && user.email == 'kitchen@getzing.app') {
      console.log(user.email);
      router.push('/');
      return;
    }
    fetchAndSortOrders(offset)
      .then((data) => {
        setTotalOrders((prevData) => [...prevData, ...data]);
        setOrders(data);
        setdataLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setdataLoading(false);
      });
  }, [user, loading, router, offset]);

  const nextPage = () => {
    if (orders.length === 0) return;
    if (totalOrders.length > (index + 1) * productsPerPage) {
      setOrders(
        totalOrders.slice(
          (index + 1) * productsPerPage,
          (index + 1) * productsPerPage + productsPerPage
        )
      );
    } else {
      setdataLoading(true);
      const currentOffset = orders[orders.length - 1]?.key;
      if (currentOffset) setOffset(currentOffset);
    }
    setIndex(index + 1);
  };

  const prevPage = () => {
    if (index === 0) return;
    const startIndex = (index - 1) * productsPerPage;
    setOrders(totalOrders.slice(startIndex, startIndex + productsPerPage));
    setIndex(index - 1);
  };

  if (loading || !user) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="order rating">
      <TabsContent value="order rating">
        {!dataLoading ? (
          <ProductsTable
            products={orders}
            index={index}
            nextPage={nextPage}
            prevPage={prevPage}
            productsPerPage={productsPerPage}
          />
        ) : (
          <p>Loading...</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
