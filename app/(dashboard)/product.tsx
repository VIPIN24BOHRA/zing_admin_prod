import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteProduct } from './actions';

export function Product({ product }: { product: any }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-center">{product.uid}</TableCell>
      <TableCell className="hidden sm:table-cell">
        {product.address?.title}
      </TableCell>
      <TableCell className="font-medium text-center">
        {product.cartItems.length}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="capitalize text-[rgb(255,0,0)] bg-[rgba(255,0,0,0.1)]"
        >
          {product?.status ?? 'Created'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">{`Rs ${product.totalPrice}`}</TableCell>
      <TableCell className="hidden md:table-cell ">
        {product?.Created ??
          new Date().toLocaleDateString() +
            ',' +
            new Date().toLocaleTimeString()}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
