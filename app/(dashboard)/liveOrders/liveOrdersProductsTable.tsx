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
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { LiverOrderProduct } from './liveOrdersProducts';

export function LiveOrdersProductsTable({
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
          Live orders{' '}
          <span className="ml-4 relative flex items-center justify-center h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
          </span>
        </CardTitle>
        <CardDescription>Manage your Orders and view Sales.</CardDescription>
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
                deliveryBoy
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
              <LiverOrderProduct
                key={product.key}
                product={product}
                userType={userType}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
