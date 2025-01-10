import { TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { OrderDetailsModal } from '@/components/orderDetailsModal';

export function Product({ product }: { product: any }) {
  const [showModal, setShowModal] = useState(false);

  const totalPrice =
    product.totalPrice -
    (product?.discount ?? 0) +
    (product.deliveryFee
      ? product.deliveryFee
      : product.totalPrice < 99
        ? 20
        : 0);
  // console.log(`product id -> ${product.key}  totalPrice ---> ${totalPrice}`);

  return (
    <>
      <TableRow
        onClick={async () => {
          // setShowModal(true);
          console.log(
            `product id -> ${product.key}  totalPrice ---> ${totalPrice}`
          );
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
            product.status == 'Delivered'
              ? { color: 'rgba(3,189,71,1)' }
              : { color: 'rgba(255,124,2,1)' }
          }
        >{`${product.status ? product.status : '-'}`}</TableCell>
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
        {/* <TableCell className="hidden md:table-cell  p-1">
          {deliveryRating ? (
            <p className="mb-2 flex flex-col items-center">
              <span className="text-xs font-semibold">Delivery</span>
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
          {tasteRating ? (
            <p className="flex flex-col items-center">
              <span className="text-xs font-semibold ">Taste </span>
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

          {deliveryRating == 0 && tasteRating == 0 ? (
            <div
              className="group/refresh relative cursor-pointer"
              onClick={async (event) => {
                event.stopPropagation();

                console.log(product.key);
                let rating = await getRatings(product.key);

                rating = Object.values(rating)?.length
                  ? Object.values(rating)[0]
                  : {};
                setDeliveryRating(rating.deliveryRating ?? 0);
                setTasteRating(rating.tasteRating ?? 0);
              }}
            >
              <svg
                className=""
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 40 40"
              >
                <path
                  fill="#8bb7f0"
                  d="M4.207,35.5l2.573-2.574l-0.328-0.353C3.259,29.143,1.5,24.677,1.5,20C1.5,9.799,9.799,1.5,20,1.5 c0.776,0,1.598,0.062,2.5,0.19v4.032C21.661,5.575,20.823,5.5,20,5.5C12.005,5.5,5.5,12.005,5.5,20 c0,3.578,1.337,7.023,3.765,9.701l0.353,0.389l2.883-2.883V35.5H4.207z"
                ></path>
                <path
                  fill="#4e7ab5"
                  d="M20,2c0.627,0,1.287,0.042,2,0.129v3.009C21.33,5.046,20.661,5,20,5C11.729,5,5,11.729,5,20 c0,3.702,1.383,7.267,3.894,10.037l0.705,0.778l0.743-0.743L12,28.414V35H5.414l1.379-1.379l0.682-0.682l-0.657-0.706 C3.711,28.895,2,24.551,2,20C2,10.075,10.075,2,20,2 M20,1C9.507,1,1,9.507,1,20c0,4.994,1.934,9.527,5.086,12.914L3,36h10V26 l-3.365,3.365C7.387,26.885,6,23.612,6,20c0-7.732,6.268-14,14-14c1.031,0,2.033,0.119,3,0.33V1.259C22.02,1.104,21.023,1,20,1 L20,1z"
                ></path>
                <g>
                  <path
                    fill="#8bb7f0"
                    d="M20,38.5c-0.776,0-1.598-0.062-2.5-0.19v-4.032c0.839,0.147,1.677,0.222,2.5,0.222 c7.995,0,14.5-6.505,14.5-14.5c0-3.583-1.336-7.03-3.761-9.706l-0.353-0.389L27.5,12.793V4.5h8.293l-2.581,2.582l0.328,0.354 C36.738,10.872,38.5,15.334,38.5,20C38.5,30.201,30.201,38.5,20,38.5z"
                  ></path>
                  <path
                    fill="#4e7ab5"
                    d="M34.586,5l-1.387,1.387l-0.682,0.682l0.657,0.706C36.286,11.119,38,15.461,38,20 c0,9.925-8.075,18-18,18c-0.627,0-1.287-0.042-2-0.129v-3.009C18.67,34.954,19.339,35,20,35c8.271,0,15-6.729,15-15 c0-3.708-1.381-7.274-3.89-10.041l-0.705-0.778l-0.743,0.743L28,11.586V5H34.586 M37,4H27v10l3.369-3.369 C32.618,13.111,34,16.388,34,20c0,7.732-6.268,14-14,14c-1.031,0-2.033-0.119-3-0.33v5.071C17.98,38.896,18.977,39,20,39 c10.493,0,19-8.507,19-19c0-4.993-1.942-9.519-5.094-12.906L37,4L37,4z"
                  ></path>
                </g>
              </svg>
              <span className="-bottom-8 absolute invisible group-hover/refresh:visible inline-block bg-white px-2 py-1 text-xs rounded-lg border-[1px] border-black">
                Refresh
              </span>
            </div>
          ) : null}
        </TableCell> */}
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
