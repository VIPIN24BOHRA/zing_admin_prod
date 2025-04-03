import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { OrderDetailsModal } from '@/components/orderDetailsModal';

export function Product({ product }: { product: any }) {
  const [showModal, setShowModal] = useState(false);
  const discount = product?.discount ?? 0;
  const deliveryFee = product.deliveryFee
    ? product.deliveryFee
    : product.totalPrice < 99
      ? 20
      : 0;
  const tax = product?.tax ?? 0;
  const smallCartFee = product?.smallCartFee ?? 0;

  const totalPrice =
    product.totalPrice + deliveryFee + tax + smallCartFee - discount;

  return (
    <>
      <TableRow
        onClick={async () => {
          setShowModal(true);
        }}
      >
        <TableCell className="font-medium text-center text-[13px] p-1">
          #{product.orderNo}
        </TableCell>

        <TableCell className="font-medium text-center text-[13px] p-1">
          {product.name}
        </TableCell>

        <TableCell className="font-medium text-center text-[13px] p-1">
          {product.phoneNumber ? product.phoneNumber : product.uid}
        </TableCell>
        <TableCell className="hidden sm:table-cell text-[12px] p-1">
          <p className="w-[180px] text-ellipsis overflow-hidden ">
            {product.address?.title}
          </p>
        </TableCell>
        <TableCell className="font-medium text-center p-1">
          {product.cartItems.map((c: any, idx: number) => (
            <p
              key={c?.item?.title + idx}
              className="flex flex-row text-[13px] justify-between font-bold"
            >
              <span> {c?.item?.title} :- </span>
              <span>{c?.quantity}</span>
            </p>
          ))}
        </TableCell>

        <TableCell className="hidden md:table-cell text-center p-1">{`Rs ${totalPrice}`}</TableCell>
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1">{`${product?.coupon ?? '-'}`}</TableCell>
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1">{`${product?.deliveryBoy?.name ?? '-'}`}</TableCell>
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1 font-bold">{`${((product?.transactionDetails?.merchantTransactionId && product?.transactionDetails?.success) || product?.transactionDetail?.cfOrderId ? 'paid' : 'cash').toLocaleUpperCase()}`}</TableCell>
        <TableCell
          className="hidden md:table-cell text-center text-[rgba(3,189,71,1)] font-bold p-1 text-[12px]"
          style={
            product.status == 'Delivered'
              ? { color: 'rgba(3,189,71,1)' }
              : { color: 'rgba(255,124,2,1)' }
          }
        >{`${product.status ? product.status : '-'}`}</TableCell>
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1">
          {product?.kitchen?.readyAt
            ? (Math.floor(
                (product?.kitchen?.readyAt - product.createdAt) /
                  (1000 * 60 * 60)
              )
                ? Math.floor(
                    (product?.kitchen?.readyAt - product.createdAt) /
                      (1000 * 60 * 60)
                  ) + 'h '
                : '') +
              Math.floor(
                ((product?.kitchen?.readyAt - product.createdAt) %
                  (1000 * 60 * 60)) /
                  (1000 * 60)
              ) +
              'min ' +
              Math.floor(
                ((product?.kitchen?.readyAt - product.createdAt) %
                  (1000 * 60)) /
                  1000
              ) +
              'sec '
            : '-'}
        </TableCell>
        <TableCell className="hidden md:table-cell text-[12px] p-1">
          {product.createdAt
            ? new Date(product.createdAt).toDateString()?.substring(3)
            : 0}
          <br />

          {product.createdAt
            ? new Date(product.createdAt).toLocaleTimeString()
            : 0}
        </TableCell>
        <TableCell className="hidden md:table-cell text-[12px] p-1 text-center">
          <br />
          {product.deliveredAt
            ? (Math.floor(
                (product.deliveredAt - product.createdAt) / (1000 * 60 * 60)
              )
                ? Math.floor(
                    (product.deliveredAt - product.createdAt) / (1000 * 60 * 60)
                  ) + 'h '
                : '') +
              Math.floor(
                ((product.deliveredAt - product.createdAt) % (1000 * 60 * 60)) /
                  (1000 * 60)
              ) +
              'min ' +
              Math.floor(
                ((product.deliveredAt - product.createdAt) % (1000 * 60)) / 1000
              ) +
              'sec '
            : '-'}
        </TableCell>
      </TableRow>
      {showModal && (
        <OrderDetailsModal
          product={product}
          totalPrice={totalPrice}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
