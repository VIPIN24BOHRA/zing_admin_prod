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
  // offset,
  index,
  prevPage,
  nextPage,
  productsPerPage
}: {
  products: any[];
  // offset: string;
  index:number ;
  prevPage: any;
  nextPage: any;
  productsPerPage: any;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders history</CardTitle>
        <CardDescription>Manage your Orders and view Sales.</CardDescription>

        <CardFooter className='pl-0'>
          <form className="flex items-center w-full justify-between">
            {/* <div className="text-xs text-muted-foreground">
              Showing{' '}
              <strong>
                {Math.min(offset * productsPerPage, totalProducts) + 1} {' - '}
                {Math.min((offset + 1) * productsPerPage, totalProducts)}
              </strong>{' '}
              of <strong>{totalProducts}</strong> products
            </div> */}
            <div className="flex">
              <Button
                formAction={prevPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={index == 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                formAction={nextPage}
                variant="ghost"
                size="sm"
                type="submit"
                // disabled={
                // }
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center"> order no </TableHead>

              <TableHead className="text-center"> Phone number</TableHead>
              <TableHead className="text-center">Address </TableHead>
              <TableHead>Total Items</TableHead>

              <TableHead className="hidden md:table-cell text-center">
                Total Price
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Coupon
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                payment method
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Status
              </TableHead>

              <TableHead className="hidden md:table-cell text-center">
                Created at
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Delivered at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, idx) => (
              <Product key={product.key} product={product} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
