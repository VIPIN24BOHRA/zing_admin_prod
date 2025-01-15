'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChefProductCard } from './chefProductsCard';

export function ChefProductsTable({
  products,
  userType
}: {
  products: any[];
  userType: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          Live Orders{' '}
          <span className="ml-4 relative flex items-center justify-center h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
          </span>
        </CardTitle>
        <CardDescription>Manage your Orders and View Sales.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          console.log(product);
          return (
            <ChefProductCard
              key={product.key}
              product={product}
              userType={userType}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
