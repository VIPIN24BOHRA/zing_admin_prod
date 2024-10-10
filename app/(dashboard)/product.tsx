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
import { copyToClipboard, updateProductStatus } from '@/lib/utils';
import { Alert } from '@mui/material';

export function Product({ product }: { product: any }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(product.status ?? '');

  const totalPrice =
    product.totalPrice -
    (product?.discount ?? 0) +
    (product.totalPrice + product.discount < 99 ? 20 : 0);
  console.log(
    `product id -> ${product.productId}  totalPrice ---> ${totalPrice}`
  );

  return (
    <>
      <TableRow>
        <TableCell className="font-medium text-center">
          #{product.orderNo}
        </TableCell>
        <TableCell className="font-medium text-center">{product.key}</TableCell>
        <TableCell className="font-medium text-center">
          {product.phoneNumber}
        </TableCell>
        <TableCell className="hidden sm:table-cell w-[200px] text-ellipsis overflow-hidden">
          {product.address?.title}
        </TableCell>
        <TableCell className="font-medium text-center">
          {product.cartItems.length}
        </TableCell>

        <TableCell className="hidden md:table-cell text-center">{`Rs ${totalPrice}`}</TableCell>
        <TableCell className="hidden md:table-cell text-center">{`${product?.coupon ?? '-'}`}</TableCell>
        <TableCell
          className="hidden md:table-cell text-center text-[rgba(3,189,71,1)] font-bold"
          style={
            status == 'Delivered'
              ? { color: 'rgba(3,189,71,1)' }
              : { color: 'rgba(255,124,2,1)' }
          }
        >{`${status ? status : '-'}`}</TableCell>
        <TableCell className="hidden md:table-cell ">
          {product.createdAt
            ? new Date(product.createdAt).toDateString()?.substring(3)
            : 0}
          <br />

          {product.createdAt
            ? new Date(product.createdAt).toLocaleTimeString()
            : 0}
        </TableCell>

        <TableCell>
          <div className="flex flex-col items-center ">
            <button
              className="relative w-[120px] border-[1px] border-[#000] hover:bg-black  text-black hover:text-white px-4 py-1 text-xs rounded-lg mb-2 "
              onClick={async () => {
                console.log(product);
                // setShowModal(true);
                const value = `Address:
${product.address.addressType},
${product.address.title}, 
${product.address?.houseDetails},
${product.address?.landmark ?? ''}

phone number: ${product.phoneNumber}

Items: 
${product?.cartItems
  ?.map((cItem: any) => {
    return `${cItem?.item?.title} - ${cItem?.quantity}`;
  })
  ?.join('\n')}

Total Price: 
${product.totalPrice}
`;
                const res = await copyToClipboard(value);
                if (res) {
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }

                console.log(res);
              }}
            >
              Copy
              {copied ? (
                <span className="absolute -top-0 right-32 font-bold">
                  <Alert>Copied</Alert>
                </span>
              ) : null}
            </button>
            <button
              className="w-[120px] border-none bg-[#ff0000bb] hover:bg-[#ff0000] text-white px-4 py-1 text-xs rounded-lg mb-2 "
              onClick={() => {
                console.log(product);
                setShowModal(true);
              }}
            >
              Show
            </button>
            <button
              className=" w-[120px] border-none bg-[rgba(3,189,71,0.85)] hover:bg-[rgba(3,189,71,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
              onClick={async () => {
                console.log('set status to delivered', product);

                const res = await updateProductStatus(
                  product,
                  'Delivered',
                  product.key
                );
                if (res) {
                  console.log('set state to delivered');
                  setStatus('Delivered');
                } else {
                  console.log('do not change status');
                }
              }}
            >
              Set Delivered
            </button>

            <button
              className="w-[120px] border-none bg-[rgba(255,124,2,0.85)] hover:bg-[rgba(255,124,2,1)] text-white px-4 py-1 text-xs rounded-lg"
              onClick={async () => {
                console.log('set status to delivered', product);

                const res = await updateProductStatus(
                  product,
                  'OUT FOR DELIVERY',
                  product.key
                );
                if (res) {
                  console.log('set state to delivered');
                  setStatus('OUT FOR DELIVERY');
                } else {
                  console.log('do not change status');
                }
              }}
            >
              Out for delivery
            </button>
          </div>
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
                            {totalPrice}
                          </p>
                          <p>
                            <span>Discount {'  -  '}</span>
                            {product?.discount ?? 0}
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
