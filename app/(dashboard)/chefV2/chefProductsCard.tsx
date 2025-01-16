import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Column } from 'drizzle-orm';
import { acceptOrder, printCard, setOrderReady } from '@/lib/utils';
import { createPidgeRiderOrder } from '@/lib/riderHelper';
import Spinner from '@/components/ui/spinner';

export function ChefProductCard({ product }: { product: any }) {
  const [status, setStatus] = useState(
    product.status?.toLowerCase() == 'accepted' &&
      product?.kitchen?.status?.toLowerCase() == 'ready'
      ? 'READY'
      : product.status
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(product);
    if (
      product.status?.toLowerCase() == 'accepted' &&
      product?.kitchen?.status?.toLowerCase() == 'ready'
    )
      setStatus('READY');
    else if (status != product.status) setStatus(product.status);
  }, [product.status, product?.kitchen?.status]);

  const handleButtonClick = async () => {
    if (!status) return;

    setLoading(true);
    if (status.toLowerCase() === 'pending') {
      const res = await acceptOrder(product.key, product.orderNo);

      if (res) setStatus('ACCEPTED');

      await createPidgeRiderOrder(product);
      printCard(product);
    } else if (status.toLowerCase() === 'accepted') {
      const res = await setOrderReady(product.key);
      if (res) setStatus('READY');
    }

    setLoading(false);
  };
  return (
    <Card
      className="p-0 flex flex-col justify-between min-h-[300px] shadow-lg"
      style={
        status.toLowerCase() == 'pending'
          ? {
              backgroundColor: 'rgba(3,189,71,0.2)',
              border: '1px solid rgba(3,189,71,1)'
            }
          : status.toLowerCase() == 'accepted'
            ? {
                backgroundColor: 'rgba(255,124,2,0.2)',
                border: '1px solid rgba(255,124,2,1)'
              }
            : status.toLowerCase() == 'ready'
              ? {
                  backgroundColor: 'rgba(151, 71, 255, 0.2)',
                  border: '1px solid rgba(151, 71, 255, 1)'
                }
              : status.toLowerCase() == 'out for delivery'
                ? {
                    backgroundColor: 'rgba(255, 244, 0,0.2)',
                    border: '1px solid rgba(251, 177, 23,1)'
                  }
                : status.toLowerCase() == 'cancelled'
                  ? {
                      backgroundColor: 'rgba(255,0,0,0.2)',
                      border: '1px solid rgba(255, 0, 0,1)'
                    }
                  : {
                      backgroundColor: 'rgba(0,181,226,0.2)',
                      border: '1px solid rgba(100, 149, 237,1)'
                    }
      }
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div
          className="flex flex-col justify-between border-b-2 pb-2 p-4"
          style={
            status.toLowerCase() == 'pending'
              ? {
                  borderBottom: '1px solid rgba(3,189,71,1)'
                }
              : status.toLowerCase() == 'accepted'
                ? {
                    borderBottom: '1px solid rgba(255,124,2,1)'
                  }
                : status.toLowerCase() == 'ready'
                  ? { borderBottom: '1px solid rgba(151, 71, 255, 1)' }
                  : status.toLowerCase() == 'out for delivery'
                    ? {
                        borderBottom: '1px solid rgba(251, 177, 23,1)'
                      }
                    : status.toLowerCase() == 'cancelled'
                      ? { borderBottom: '1px solid rgba(255, 0, 0,1)' }
                      : {
                          borderBottom: '1px solid rgba(100, 149, 237,1)'
                        }
          }
        >
          <div className="flex flex-row justify-between mb-2">
            <span className="mr-4 font-bold">Order #{product.orderNo}</span>
            <span
              style={
                status.toLowerCase() === 'pending'
                  ? { color: 'rgba(3,189,71,1)' }
                  : status.toLowerCase() === 'accepted'
                    ? { color: 'rgba(255,124,2,1)' }
                    : status.toLowerCase() == 'ready'
                      ? { color: 'rgba(151, 71, 255, 1)' }
                      : status.toLowerCase() === 'out for delivery'
                        ? { color: 'rgba(251, 177, 23,1)' }
                        : status.toLowerCase() == 'cancelled'
                          ? { color: '#ff0000' }
                          : { color: '#6495ED' }
              }
              className="font-semibold text-sm"
            >
              {status?.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-row justify-between mb-2">
            <span className="text-sm font-semibold">created at :- </span>
            <span className="text-sm text-gray-500">
              {new Date(product.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex flex-row justify-between">
            <span className="text-sm font-semibold">mobile no :-</span>
            <span>{product.phoneNumber}</span>
          </div>
        </div>

        {/* Items Section */}
        <div className="mt-4 p-4">
          {product.cartItems.map((cartItem: any, index: number) => (
            <div key={index} className="text-xl  font-semibold mb-2">
              <p className="flex flex-row justify-start">
                <span className="mr-2 inline-block w-[30px]">
                  {index + 1} :
                </span>{' '}
                <span>
                  {cartItem.item.title} - {cartItem.quantity}
                </span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Button Section */}
      <div className="p-4 px-8 flex ">
        {loading ? (
          <Spinner />
        ) : status.toLowerCase() == 'pending' ||
          status.toLowerCase() == 'accepted' ? (
          <button
            onClick={handleButtonClick}
            className={`w-full py-1 rounded-[30px] text-white ${
              status.toLowerCase() === 'pending'
                ? 'bg-green-500 hover:bg-green-700'
                : status.toLowerCase() === 'accepted'
                  ? 'bg-orange-500 hover:bg-orange-700'
                  : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {status.toLowerCase() === 'pending'
              ? 'Accept'
              : status.toLowerCase() === 'accepted'
                ? 'Ready'
                : 'Done'}
          </button>
        ) : null}
      </div>
    </Card>
  );
}
