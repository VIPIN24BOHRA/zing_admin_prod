import { ProductModel } from '@/lib/models';
import React, { useState } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductModel;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    originalPrice: product?.originalPrice || '',
    price: product?.price || '',
    hide: product?.hide || false,
    isVeg: product?.isVeg || false,
    servingType: product?.servingType || '',
    quantity: product?.quantity || '',
    categories: product?.categories || '',
    imageUrl: product?.imageUrl || ''
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      'title',
      'description',
      'originalPrice',
      'price',
      'servingType',
      'quantity',
      'categories'
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    console.log('Form Data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleSubmit} className="bg-white p-6">
              <h3
                className="text-lg font-semibold text-gray-900"
                id="modal-title"
              >
                {product ? 'Update Product' : 'Add Product'}
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder={product ? product.title : 'Title'}
                    value={formData.title}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder={product ? product.description : 'Description'}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Original Price
                  </label>
                  <input
                    type="text"
                    name="originalPrice"
                    placeholder={
                      product ? product.originalPrice : 'Original Price'
                    }
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    placeholder={product ? product.price : 'Price'}
                    value={formData.price}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder={product ? product.imageUrl : 'Image URL'}
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex w-1/2 items-center">
                    <label className="block w-1/3 text-sm font-medium text-gray-700">
                      Hide
                    </label>
                    <input
                      type="checkbox"
                      name="hide"
                      checked={formData.hide}
                      onChange={handleChange}
                      className="mr-2"
                    />
                  </div>
                  <div className="flex w-1/2 items-center">
                    <label className="block w-1/3 text-sm font-medium text-gray-700">
                      Veg
                    </label>
                    <input
                      type="checkbox"
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleChange}
                      className="mr-2"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Serving Type
                  </label>
                  <input
                    type="text"
                    name="servingType"
                    placeholder={product ? product.servingType : 'Serving Type'}
                    value={formData.servingType}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder={product ? product.quantity : 'Quantity'}
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <input
                    type="text"
                    name="categories"
                    placeholder={product ? product.categories : 'Categories'}
                    value={formData.categories}
                    onChange={handleChange}
                    className="w-2/3 rounded-md border px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-white"
                >
                  {product ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
