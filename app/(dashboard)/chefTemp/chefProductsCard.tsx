import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Column } from 'drizzle-orm';

export function ChefProductCard({
  product,
  userType
}: {
  product: any;
  userType: string;
}) {
  const status = product.status;
  const [createdAt] = useState(
    product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'
  );

  const [buttonState, setButtonState] = useState<'accept' | 'ready' | 'done'>(
    'accept'
  );

  const handleButtonClick = () => {
    if (buttonState === 'accept') {
      setButtonState('ready');
    } else if (buttonState === 'ready') {
      setButtonState('done');
    }
  };
  return (
    <Card
      className="p-0 flex flex-col justify-between min-h-[300px] shadow-lg"
      style={
        product.status.toLowerCase() == 'pending'
          ? {
              backgroundColor: 'rgba(3,189,71,0.2)',
              border: '1px solid rgba(3,189,71,1)'
            }
          : product.status.toLowerCase() == 'accepted'
            ? {
                backgroundColor: 'rgba(255,124,2,0.2)',
                border: '1px solid rgba(255,124,2,1)'
              }
            : {}
      }
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div
          className="flex flex-col justify-between border-b-2 pb-2 p-4"
          style={
            product.status.toLowerCase() == 'pending'
              ? {
                  borderBottom: '1px solid rgba(3,189,71,1)'
                }
              : product.status.toLowerCase() == 'accepted'
                ? {
                    borderBottom: '1px solid rgba(255,124,2,1)'
                  }
                : {
                    borderBottom: '1px solid #eee'
                  }
          }
        >
          <div className="flex flex-row justify-between mb-2">
            <span className="mr-4 font-bold">Order #{product.orderNo}</span>
            <span
              style={
                product.status === 'Delivered'
                  ? { color: 'rgba(3,189,71,1)' }
                  : { color: 'rgba(255,124,2,1)' }
              }
              className="font-semibold text-sm"
            >
              {product.status}
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
            <div
              key={index}
              className="text-lg place-items-center font-semibold mb-2"
            >
              <span>
                <span className="mr-2">{index + 1} :</span>{' '}
                {cartItem.item.title} - {cartItem.quantity}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Button Section */}
      <div className="p-4 px-8 flex ">
        {status.toLowerCase() == 'pending' ||
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
