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
  prevPage,
  nextPage,
  productsPerPage,
  index
}: {
  products: any[];
  prevPage: () => void;
  nextPage: () => void;
  productsPerPage: number;
  index: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Rating</CardTitle>
        <CardDescription>
          Manage your orders and view sales details.
        </CardDescription>
        <CardFooter className="pl-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button
                onClick={prevPage}
                variant="ghost"
                size="sm"
                disabled={index == 0}
                aria-label="Previous page"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                onClick={nextPage}
                variant="ghost"
                size="sm"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Order No</TableHead>
              <TableHead className="text-center">Phone Number</TableHead>
              <TableHead className="text-center">Address</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Delivery Rating
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Taste Rating
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, idx) => (
              <Product key={product.key || idx} product={product} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
