import {
  acceptOrder,
  cancelPidgeRiderOrder,
  copyToClipboard,
  unallocatePidgeRiderOrder,
  updateProductStatus,
  updateStatusCancelled,
  updateStatusDelivered
} from '@/lib/utils';
import { Alert } from '@mui/material';
import { useState } from 'react';
import { get, getDatabase, limitToLast, query, ref } from 'firebase/database';
import { app } from '@/lib/db';
import { createPidgeRiderOrder } from '@/lib/utils';
import Spinner from './ui/spinner';

const copyDetails = async (product: any, totalPrice: any) => {
  const value = `Order No :- ${product.orderNo}
    Address:
   ${`https://www.google.com/maps?q=${product.address?.lat},${product.address?.lng}`}
   ${product.address.addressType},
   ${product.address.title}, 
   ${product.address?.houseDetails},
   ${product.address?.landmark ?? ''}
   phone number: ${product.phoneNumber ? product.phoneNumber : product.uid}
   Items: 
   ${product?.cartItems
     ?.map((cItem: any) => {
       return `${cItem?.item?.title} - ${cItem?.quantity}`;
     })
     ?.join('\n')}
   Total Price: 
   ${totalPrice}
   ${(product?.transactionDetails?.merchantTransactionId && product?.transactionDetails?.success ? 'paid' : 'cash').toLocaleUpperCase()}
   `;
  return copyToClipboard(value);
};

const showPaymentStatus = async (transactionId: String) => {
  console.log(transactionId);

  const db = getDatabase(app);
  const transactionRef = ref(db, `paymentHistory/${transactionId}`);

  try {
    const snapshot = await get(transactionRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);
      return data.code;
    } else {
      console.log('no value exists');
      return 'PAYMENT_ERROR';
    }
  } catch (err) {
    console.log(err);
    return 'error';
  }
};

export const LiveOrderModel = ({
  userType,
  product,
  totalPrice,
  setShowModal,
  setStatus,
  setDeliveredAt,
  showAccept,
  showCancel,
  showCopy,
  showOutForDelivery,
  showDelivered
}: {
  userType: String;
  product: any;
  totalPrice: number;
  setShowModal: any;
  setStatus: any;
  setDeliveredAt: any;
  showCopy: boolean;
  showAccept: boolean;
  showOutForDelivery: boolean;
  showCancel: boolean;
  showDelivered: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [unallocating, setUnallocating] = useState(false);

  return (
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
                    <p className="font-bold">Order no</p>
                    <p className="text-sm text-gray-500">{product.orderNo}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500 font-bold">
                      {(product?.transactionDetails?.merchantTransactionId &&
                      product?.transactionDetails?.success
                        ? 'paid'
                        : 'cash'
                      ).toLocaleUpperCase()}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="font-bold">Items Orderd</p>
                    <div className="text-sm text-gray-500">
                      {product.cartItems.map((cItem: any, idx: any) => {
                        return (
                          <p key={`product-${idx}`}>
                            {cItem?.item?.title}
                            {' - '}
                            <span>{cItem?.quantity}</span>
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-bold">Address</p>
                    <p className="text-sm text-gray-500">
                      <a
                        href={`https://www.google.com/maps?q=${product.address?.lat},${product.address?.lng}`}
                        target="_blank"
                        className="text-[rgb(0,0,255)]"
                      >
                        https://www.google.com/maps?q={product.address?.lat},
                        {product.address?.lng}
                      </a>

                      <p>{product.address?.addressType}</p>

                      <p>{product.address?.title}</p>
                      <p>{product.address?.houseDetails}</p>
                      <p>{product.address?.landmark}</p>
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="font-bold">Price details</p>
                    <div className="text-sm text-gray-500">
                      <p>
                        <span>Total Price {'  -  '}</span>
                        {totalPrice}
                      </p>
                      <p>
                        <span>Discount {'  -  '}</span>
                        {product?.discount ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-8  flex p-1 flex-wrap ">
              {showDelivered && (
                <button
                  className=" w-[120px] mx-2 border-none bg-[rgba(3,189,71,0.75)] hover:bg-[rgba(3,189,71,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                  onClick={async (event) => {
                    event.stopPropagation();
                    console.log('set status to delivered', product);
                    const deliveredTime = Date.now();
                    product['deliveredAt'] = deliveredTime;

                    const res = await updateStatusDelivered(
                      { ...product },
                      product.key
                    );
                    if (res) {
                      setStatus('Delivered');
                      setDeliveredAt(deliveredTime);
                    }
                  }}
                >
                  Set Delivered
                </button>
              )}
              {showOutForDelivery && (
                <button
                  className="w-[120px] mx-2 border-none bg-[rgba(255,124,2,0.65)] hover:bg-[rgba(255,124,2,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                  onClick={async (event) => {
                    event.stopPropagation();
                    console.log('set status to out for delivery', product);

                    const res = await updateProductStatus(
                      'OUT FOR DELIVERY',
                      product.key
                    );

                    if (res) setStatus('OUT FOR DELIVERY');
                  }}
                >
                  Out for delivery
                </button>
              )}
              {showCancel && (
                <button
                  className="w-[120px] mx-2 border-none bg-[rgba(255,0,0,0.55)] hover:bg-[rgba(255,0,0,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                  onClick={async (event) => {
                    event.stopPropagation();
                    console.log('set status to out of stock', product);

                    const res = await updateStatusCancelled(
                      { ...product },
                      product.key,
                      'Out of Stock'
                    );

                    if (res) setStatus('CANCELLED');
                  }}
                >
                  out of stock
                </button>
              )}
              {showCancel && (
                <button
                  className="w-[120px] mx-2 border-none bg-[rgba(255,0,0,0.55)] hover:bg-[rgba(255,0,0,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                  onClick={async (event) => {
                    event.stopPropagation();
                    console.log('set status to out of service', product);

                    const res = await updateStatusCancelled(
                      { ...product },
                      product.key,
                      'Location out of service area'
                    );

                    if (res) setStatus('CANCELLED');
                  }}
                >
                  out of service
                </button>
              )}
              {showCancel &&
                (cancelling ? (
                  <Spinner />
                ) : (
                  <button
                    className="w-[120px] mx-2 border-none bg-[rgba(255,0,0,0.55)] hover:bg-[rgba(255,0,0,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                    onClick={async (event) => {
                      event.stopPropagation();
                      console.log('set status to out of service', product);
                      setCancelling(true);
                      const res = await updateStatusCancelled(
                        { ...product },
                        product.key,
                        'Order has been cancelled'
                      );

                      if (res) setStatus('CANCELLED');
                      if (product?.deliveryBoy?.id)
                        await cancelPidgeRiderOrder(product?.deliveryBoy?.id);

                      setCancelling(false);
                    }}
                  >
                    Cancel
                  </button>
                ))}
              {showAccept &&
                (loading ? (
                  <Spinner />
                ) : (
                  <button
                    className="w-[120px] mx-2 border-none bg-[rgba(0,0,255,0.55)] hover:bg-[rgba(0,0,255,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                    onClick={async (event) => {
                      event.stopPropagation();
                      console.log('set status to accepted', product);
                      setLoading(true);

                      const res = await acceptOrder(
                        product.key,
                        product.orderNo
                      );

                      if (res) setStatus('ACCEPTED');

                      if (userType == 'chef')
                        await createPidgeRiderOrder(product);

                      setLoading(false);
                    }}
                  >
                    Accept
                  </button>
                ))}
              {showCopy && (
                <button
                  className="relative w-[120px] mx-2 border-[1px] border-[#000] hover:bg-black  text-black hover:text-white px-4 py-1 text-xs rounded-lg mb-2 "
                  onClick={async (event) => {
                    event.stopPropagation();
                    const res = await copyDetails(product, totalPrice);

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
              )}
              {product?.transactionDetails?.merchantTransactionId ? (
                <div>
                  <button
                    className="relative w-[120px] mx-2 border-[1px] border-[#000] hover:bg-black  text-black hover:text-white px-4 py-1 text-xs rounded-lg mb-2 "
                    onClick={async (event) => {
                      event.stopPropagation();
                      const status: any = await showPaymentStatus(
                        product?.transactionDetails?.merchantTransactionId
                      );
                      console.log(status);
                      setPaymentStatus(status);
                    }}
                  >
                    payment status
                  </button>
                  <span>{paymentStatus}</span>
                </div>
              ) : null}
              {showCancel &&
                (unallocating ? (
                  <Spinner />
                ) : (
                  <button
                    className="w-[120px] mx-2 border-none bg-[rgba(128,128,128,0.65)] hover:bg-[rgba(128,128,128,1)] text-white px-4 py-1 text-xs rounded-lg mb-2"
                    onClick={async (event) => {
                      event.stopPropagation();
                      console.log('Unallocating order with id:', product.key);

                      if (product?.deliveryBoy?.id)
                        await unallocatePidgeRiderOrder(
                          product?.deliveryBoy?.id
                        );
                    }}
                  >
                    Unallocate
                  </button>
                ))}
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={(event) => {
                  event.stopPropagation();
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
  );
};
