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
  orders,
  prevPage,
  nextPage,
  totalOrders,
  index,
  setOrders,
  setTotalOrders
}: {
  orders: any[];
  totalOrders: any[];
  prevPage: () => void;
  nextPage: () => void;
  index: number;
  setOrders: (orders: any[]) => void;
  setTotalOrders: (totalOrders: any[]) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders history</CardTitle>
        <CardDescription>Manage your Orders and view Sales.</CardDescription>
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
              <TableHead className="text-center"> Order no </TableHead>
              <TableHead className="text-center"> Name </TableHead>

              <TableHead className="text-center"> Mobile</TableHead>
              <TableHead className="text-center">Address </TableHead>
              <TableHead>Total Items</TableHead>

              <TableHead className="hidden md:table-cell text-center">
                Price
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Coupon
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Delivery Boy
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Payment
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Status
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                KPT
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
            {orders.map((order, idx) => {
              return <Product key={order.key || idx} product={order} />;
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
