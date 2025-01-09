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
import { useState } from 'react';
import ProductModal from '../../../components/productModal';

export function ProductsTable({
  products,
  totalProducts,
  setIsModalOpen
}: {
  products: any[];
  totalProducts: number;
  setIsModalOpen: (id: null | number, isOpen: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ display: 'flex' }}>
          Menu
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 bg-green-500 text-white ml-auto"
            onClick={() => setIsModalOpen(null, true)}
          >
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Food Item
            </span>
          </Button>
        </CardTitle>
        <CardDescription>Manage your Menu items .</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center"> Delete</TableHead>
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
                <Product
                  key={product.productId}
                  product={product}
                  idx={idx}
                  setIsModalOpen={setIsModalOpen}
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
