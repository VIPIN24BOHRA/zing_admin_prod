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
import ProductModal from '@/components/productModal';

const productsPerPage = 50;

export default function MenuPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectId, setSelectedId] = useState<null | number>(null);
  const [isProductChanged, setIsProductChanged] = useState<boolean>(false);

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
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProduct(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [isProductChanged]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <Tabs defaultValue="Menu">
      <TabsContent value="Menu">
        <ProductsTable
          products={product}
          totalProducts={product.length}
          setIsModalOpen={(id: number | null, isOpen: boolean) => {
            setIsModalOpen(isOpen);
            setSelectedId(id);
          }}
        />
        {isModalOpen ? (
          <ProductModal
            onClose={() => setIsModalOpen(false)}
            totalProducts={selectId ? null : product.length}
            id={selectId}
            product={selectId ? product[selectId] : null}
            setIsProductChanged={setIsProductChanged}
          ></ProductModal>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
