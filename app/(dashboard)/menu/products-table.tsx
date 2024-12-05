'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Product } from './product';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductsTable({
  products,

  totalProducts
}: {
  products: any[];
  totalProducts: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
        <CardDescription>Manage your Menu items .</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center"> Product no</TableHead>

              <TableHead className="text-center"> Title</TableHead>
              <TableHead className="text-center"> Description </TableHead>
              <TableHead>original Price</TableHead>

              <TableHead className="hidden md:table-cell text-center">
                price
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                hide
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Veg / Nog-veg
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Serving type
              </TableHead>

              <TableHead className="hidden md:table-cell text-center">
                quanity
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Categories
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, idx) => {
              return (
                <Product key={product.productId} product={product} idx={idx} />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
