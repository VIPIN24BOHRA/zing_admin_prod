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
import { useAuth } from 'providers/authProvider/authContext';
import { useRouter } from 'next/navigation';

const productsPerPage = 50;

export default function MenuPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login page
    }
    if (!loading && user && user.email == 'kitchen@getzing.app') {
      console.log(user.email);
      router.push('/');
    }
  }, [user, loading, router]);

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

  if (loading || !user) {
    return <p>Loading...</p>; // Or a spinner/loading component
  }

  return (
    <Tabs defaultValue="Menu">
      <TabsContent value="Menu">
        <ProductsTable products={product} totalProducts={product.length} />
      </TabsContent>
    </Tabs>
  );
}
