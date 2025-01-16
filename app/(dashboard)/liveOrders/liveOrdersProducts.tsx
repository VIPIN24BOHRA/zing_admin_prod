import { TableCell, TableRow } from '@/components/ui/table';
import { useCallback, useEffect, useState } from 'react';

import { OrderDetailsModal } from '@/components/orderDetailsModal';
import { LiveOrderModel } from '@/components/liveOrderModel';

export function LiverOrderProduct({
  product,
  userType
}: {
  product: any;
  userType: string;
}) {
  const [showModal, setShowModal] = useState(false);

  const [status, setStatus] = useState(product.status ?? '');
  const [deliveredAt, setDeliveredAt] = useState(product.deliveredAt ?? 0);

  const totalPrice =
    product.totalPrice -
    (product?.discount ?? 0) +
    (product.deliveryFee
      ? product.deliveryFee
      : product.totalPrice < 99
        ? 20
        : 0);
  const deliveryBoyName = product?.deliveryBoy?.name
    ? product?.deliveryBoy?.name
    : '';
  const deliveryBoyStatus = product?.deliveryBoy?.status
    ? product?.deliveryBoy?.status
    : '';
  const deliveryStatusLastUpdatedOn = product?.deliveryBoy?.last_updated_on
    ? new Date(product?.deliveryBoy?.last_updated_on).toLocaleDateString() +
      ' ' +
      new Date(product?.deliveryBoy?.last_updated_on).toLocaleTimeString()
    : '';

  useEffect(() => {
    if (status != product.status) {
      setStatus(product.status);
      if (product.deliveredAt) {
        setDeliveredAt(product.deliveredAt);
      }
    }
  }, [product.status]);

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
        <TableCell className="hidden md:table-cell text-center text-[12px] p-1 font-bold">{`${(product?.transactionDetails?.merchantTransactionId && product?.transactionDetails?.success ? 'paid' : 'cash').toLocaleUpperCase()}`}</TableCell>
        <TableCell
          className="hidden md:table-cell text-center text-[rgba(3,189,71,1)] font-bold p-1 text-[12px]"
          style={
            status == 'Delivered'
              ? { color: 'rgba(3,189,71,1)' }
              : { color: 'rgba(255,124,2,1)' }
          }
        >{`${status ? status : '-'}`}</TableCell>
        <TableCell className="hidden md:table-cell text-center p-1 text-[11px] font-bold">
          <span className="text-[rgba(255,0,0)]">{deliveryBoyName}</span>
          <br />
          <span>{deliveryBoyStatus}</span>
          <br />
          <span>{deliveryStatusLastUpdatedOn}</span>
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
          {deliveredAt
            ? (Math.floor((deliveredAt - product.createdAt) / (1000 * 60 * 60))
                ? Math.floor(
                    (deliveredAt - product.createdAt) / (1000 * 60 * 60)
                  ) + 'h '
                : '') +
              Math.floor(
                ((deliveredAt - product.createdAt) % (1000 * 60 * 60)) /
                  (1000 * 60)
              ) +
              'min ' +
              Math.floor(
                ((deliveredAt - product.createdAt) % (1000 * 60)) / 1000
              ) +
              'sec '
            : '-'}
        </TableCell>
      </TableRow>
      {showModal &&
        (userType == 'chef' ? (
          <LiveOrderModel
            userType={userType}
            product={product}
            totalPrice={totalPrice}
            setShowModal={setShowModal}
            setDeliveredAt={null}
            setStatus={setStatus}
            showAccept={true}
            showCancel={false}
            showCopy={false}
            showDelivered={false}
            showOutForDelivery={false}
          />
        ) : (
          <LiveOrderModel
            userType={userType}
            product={product}
            totalPrice={totalPrice}
            setShowModal={setShowModal}
            setDeliveredAt={setDeliveredAt}
            setStatus={setStatus}
            showAccept={true}
            showCancel={true}
            showCopy={true}
            showDelivered={true}
            showOutForDelivery={true}
          />
        ))}
    </>
  );
}
