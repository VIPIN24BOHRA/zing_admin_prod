import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import { Edit, Save } from 'lucide-react';

export function Product({
  product,
  orders,
  totalOrders,
  setOrders,
  setTotalOrders
}: {
  product: any;
  orders: any[];
  totalOrders: any[];
  setOrders: (orders: any[]) => void;
  setTotalOrders: (totalOrders: any[]) => void;
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [feedback, setFeedback] = useState(product.rating.feedback || '');
  const [loading, setLoading] = useState(false);

  const updateFeedback = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: product.key,
          mobileNo: product.phoneNumber || product.uid,
          feedback
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const updateArray = (array: any[]) =>
          array.map((item) =>
            item.key === product.key
              ? { ...item, rating: { ...item.rating, feedback } }
              : item
          );

        setOrders(updateArray(orders));
        setTotalOrders(updateArray(totalOrders));
        console.log('Feedback updated successfully!');
      } else {
        console.log('Failed to update feedback.');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      console.log('An error occurred while updating feedback.');
    } finally {
      setLoading(false);
      setIsUpdate(false);
    }
  };

  const toggleUpdate = async () => {
    if (isUpdate) {
      await updateFeedback();
    } else {
      setIsUpdate(true);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium text-center text-[13px] p-1">
          #{product.orderNo}
        </TableCell>
        <TableCell className="font-medium text-center text-[13px] p-1">
          {product.name}
        </TableCell>

        <TableCell className="font-medium text-center text-[13px] p-1">
          {product.phoneNumber || product.uid}
        </TableCell>
        <TableCell className="hidden sm:table-cell text-[12px] p-1">
          <p className="w-[150px] text-ellipsis overflow-hidden ">
            {product.address?.title}
          </p>
        </TableCell>
        <TableCell className="font-medium text-center p-1">
          {product.cartItems.map((c: any, idx: number) => (
            <p
              key={c?.item?.title + idx}
              className="flex flex-row text-[12px] justify-between font-bold"
            >
              <span> {c?.item?.title} :- </span>
              <span>{c?.quantity}</span>
            </p>
          ))}
        </TableCell>
        <TableCell className="font-bold text-red-500 text-center text-[12px] p-1">
          {product?.status}
        </TableCell>
        <TableCell className="hidden md:table-cell text-[11px] p-1 text-center font-bold">
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
        <TableCell className="hidden md:table-cell  p-1">
          {product.rating?.deliveryRating ? (
            <p className="mb-2 flex flex-col items-center">
              <StarRatings
                starDimension="15px"
                starSpacing="2px"
                rating={product.rating?.deliveryRating}
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
          {product.rating?.tasteRating ? (
            <p className="flex flex-col items-center">
              <StarRatings
                starDimension="15px"
                starSpacing="2px"
                rating={product.rating?.tasteRating}
                starRatedColor="green"
                numberOfStars={5}
                name="Taste Rating"
              />
            </p>
          ) : (
            ''
          )}
        </TableCell>
        <TableCell className="hidden sm:table-cell text-[12px] p-1 ">
          {isUpdate ? (
            <textarea
              className="w-full p-2"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          ) : (
            <p className="w-[150px] text-ellipsis overflow-hidden text-center">
              {product.rating.feedback || 'No feedback'}
            </p>
          )}
        </TableCell>
        <TableCell className="font-medium text-[13px] p-1 h-max w-max text-center align-middle leading-[normal]">
          <span className="inline-block align-middle" onClick={toggleUpdate}>
            {isUpdate ? (
              loading ? (
                <span>Saving...</span>
              ) : (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={toggleUpdate}
                >
                  Save
                </button>
              )
            ) : (
              <Edit className="cursor-pointer text-red-500 hover:text-red-700" />
            )}
          </span>
        </TableCell>
      </TableRow>
    </>
  );
}
