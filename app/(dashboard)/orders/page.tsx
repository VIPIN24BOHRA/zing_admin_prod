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
import { fetchAndSortOrders } from './orderHandler';
import { ExportCsvModal } from '@/components/exportCsvModal';

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
  const [isExportCsvModalOpen, setIsExportCsvModalOpen] = useState(false);

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
  const handleExportCsvSubmit = (startDate: Date, endDate: Date) => {
    console.log('Export CSV with dates:', startDate, endDate);

    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    const apiUrl = `api/order/date?endDate=${endTimestamp}&startDate=${startTimestamp}`;
    fetch(apiUrl, {
      method: 'GET'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((result) => {
        const csvData = convertToCSV(result.data);

        downloadCSV(csvData);
      })
      .catch((error) => {
        console.error('Error during API call or CSV export:', error);
      });
  };

  const handleExportCsvClose = () => {
    setIsExportCsvModalOpen(false);
  };

  if (loading || !user) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (loading || !user) {
    return <p>Loading...</p>;
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
              setIsExportCsvModalOpen(true);
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
        {!dataLoading ? (
          <ProductsTable
            index={index}
            orders={orders}
            setOrders={setOrders}
            setTotalOrders={setTotalOrders}
            nextPage={nextPage}
            prevPage={prevPage}
            totalOrders={totalOrders}
          />
        ) : (
          <p>Loading...</p>
        )}
      </TabsContent>
      {isExportCsvModalOpen ? (
        <ExportCsvModal
          onClose={handleExportCsvClose}
          onSubmit={handleExportCsvSubmit}
        ></ExportCsvModal>
      ) : null}
    </Tabs>
  );
}
