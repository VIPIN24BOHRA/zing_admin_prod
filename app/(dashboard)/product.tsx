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
import { useState } from 'react';

export function Product({ product }: { product: any }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium text-center">{product.key}</TableCell>
        <TableCell className="font-medium text-center">
          {product.phoneNumber}
        </TableCell>
        <TableCell className="hidden sm:table-cell w-[500px] text-ellipsis overflow-hidden">
          {product.address?.title}
        </TableCell>
        <TableCell className="font-medium text-center">
          {product.cartItems.length}
        </TableCell>

        <TableCell className="hidden md:table-cell text-center">{`Rs ${product.totalPrice}`}</TableCell>
        <TableCell className="hidden md:table-cell ">
          {product.createdAt
            ? new Date(product.createdAt).toDateString() + "   "+
              new Date(product.createdAt).toLocaleTimeString()
            : 0}
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
              <DropdownMenuItem
                onClick={() => {
                  console.log(product);
                  setShowModal(true);
                }}
              >
                Show
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {showModal && (
        <div
          className="fixed z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Order Details
                      </h3>
                      <div className="mt-4">
                        <p className="font-bold">Items Orderd</p>
                        <p className="text-sm text-gray-500">
                          {product.cartItems.map((cItem: any) => {
                            return (
                              <p>
                                {cItem?.item?.title}
                                {' - '}
                                <span>{cItem?.quantity}</span>
                              </p>
                            );
                          })}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="font-bold">Address</p>
                        <p className="text-sm text-gray-500">
                          <p>{product.address?.addressType}</p>

                          <p>{product.address?.title}</p>
                          <p>{product.address?.houseDetails}</p>
                          <p>{product.address?.landmark}</p>
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="font-bold">Price details</p>
                        <p className="text-sm text-gray-500">
                          <p>
                            <span>Total Price {'  -  '}</span>
                            {product.totalPrice}
                          </p>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
