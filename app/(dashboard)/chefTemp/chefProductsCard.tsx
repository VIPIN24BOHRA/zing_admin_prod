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
  const [status] = useState(product.status ?? '');
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
    <Card className="flex flex-col justify-between">
    <CardContent className="p-2">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col items-start">
          <span className="mr-4 font-bold">Order #{product.orderNo}</span>
          <span className="text-sm text-gray-500">
            {new Date(product.createdAt).toLocaleString()}
          </span>
        </div>
  
        <div className="flex flex-col items-end">
          <span
            style={
              product.status === "Delivered"
                ? { color: "rgba(3,189,71,1)" }
                : { color: "rgba(255,124,2,1)" }
            }
            className="font-semibold"
          >
            {product.status}
          </span>
          <span>{product.phoneNumber}</span>
        </div>
      </div>
  
      {/* Items Section */}
      <div className="mt-4">
        {product.cartItems.map((cartItem: any, index: number) => (
          <div
            key={index}
            className="text-xl place-items-center font-semibold"
          >
            {cartItem.item.title} - {cartItem.quantity}
          </div>
        ))}
      </div>
    </CardContent>
  
    {/* Button Section */}
    <div className="p-2 flex justify-start">
      <button
        onClick={handleButtonClick}
        className={`px-4 py-2 rounded text-white ${
          buttonState === "accept"
            ? "bg-green-500 hover:bg-green-700"
            : buttonState === "ready"
            ? "bg-orange-500 hover:bg-orange-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={buttonState === "done"}
      >
        {buttonState === "accept"
          ? "Accept"
          : buttonState === "ready"
          ? "Ready"
          : "Done"}
      </button>
    </div>
  </Card>
  
  );
}
