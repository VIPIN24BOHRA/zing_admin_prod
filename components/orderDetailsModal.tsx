export const OrderDetailsModal = ({
  product,
  totalPrice,
  setShowModal
}: {
  product: any;
  totalPrice: number;
  setShowModal: any;
}) => {
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
                        : 'cash').toLocaleUpperCase()}
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
