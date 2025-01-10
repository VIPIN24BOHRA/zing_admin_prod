import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { OrderDetailsModal } from '@/components/orderDetailsModal';
import StarRatings from 'react-star-ratings';

export function Product({ product }: { product: any }) {
  const totalPrice =
    product.totalPrice -
    (product?.discount ?? 0) +
    (product.deliveryFee
      ? product.deliveryFee
      : product.totalPrice < 99
        ? 20
        : 0);
  console.log(`product id -> ${product.key}  totalPrice ---> ${totalPrice}`);

  const [deliveryRating, setDeliveryRating] = useState(3);
  const [tasteRating, setTasteRating] = useState(3);

  return (
    <>
      <TableRow>
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
        <TableCell className="hidden md:table-cell  p-1">
          {deliveryRating ? (
            <p className="mb-2 flex flex-col items-center">
              <StarRatings
                starDimension="15px"
                starSpacing="2px"
                rating={deliveryRating}
                starRatedColor="green"
                numberOfStars={5}
                name="Delivery Rating"
              />
            </p>
          ) : (
            ''
          )}
        </TableCell>
        <TableCell className="hidden md:table-cell  p-1">
          {tasteRating ? (
            <p className="flex flex-col items-center">
              <StarRatings
                starDimension="15px"
                starSpacing="2px"
                rating={tasteRating}
                starRatedColor="green"
                numberOfStars={5}
                name="Taste Rating"
              />
            </p>
          ) : (
            ''
          )}

        </TableCell>
      </TableRow>
    </>
  );
}
