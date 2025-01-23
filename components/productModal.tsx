'use-client';
import { ProductModel } from '@/lib/models';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface ProductModalProps {
  onClose: () => void;
  product: ProductModel | null;
  totalProducts: number | null;
  id: number | null;
  setIsProductChanged: (isProductChanged: boolean) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  onClose,
  product,
  totalProducts,
  id,
  setIsProductChanged
}) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    originalPrice: product?.originalPrice || 0,
    price: product?.price || 0,
    hide: product?.hide || false,
    isVeg: product?.isVeg || false,
    servingType: product?.servingType || '-',
    quantity: product?.quantity || '',
    categories: product?.categories || [''],
    imageUrl: product?.imageUrl || '',
    largeImageUrl: product?.imageUrl || '',
    productId: product?.productId || ''
  });

  let debounceTimeout: NodeJS.Timeout;
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prevData) => {
      if (name === 'categories') {
        // Split values into an array or handle as needed (comma-separated example here)
        const updatedCategories = value
          .split(',')
          .map((category) => category.trim());
        return {
          ...prevData,
          categories: updatedCategories
        };
      }

      return {
        ...prevData,
        [name]:
          type === 'checkbox'
            ? checked
            : ['originalPrice', 'price', 'quantity', 'productId'].includes(name)
              ? Math.max(0, Number(value))
              : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const payload = {
      product: {
        title: formData.title,
        description: formData.description,
        originalPrice: Number(formData.originalPrice),
        price: Number(formData.price),
        hide: formData.hide,
        isVeg: formData.isVeg,
        servingType: formData.servingType,
        quantity: Number(formData.quantity),
        categories: formData.categories,
        imageUrl: formData.imageUrl,
        largeImageUrl: formData.largeImageUrl,
        productId: Number(formData.productId)
      },
      id: totalProducts ? totalProducts : id
    };

    console.log('Payload:', payload);

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Product added successfully:', data);

        // Clear the form data
        setFormData({
          title: '',
          description: '',
          originalPrice: 0,
          price: 0,
          servingType: '',
          quantity: '',
          categories: [''],
          imageUrl: '',
          largeImageUrl: '',
          productId: '',
          hide: false,
          isVeg: false
        });

        // Close the modal
        setIsProductChanged(true);

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          setIsProductChanged(false);
        }, 1000);
      } else {
        console.error('Error adding product:', data.message || data.error);
      }
      onClose();
      setIsProductChanged(true);
    } catch (error) {
      console.error(
        'Fetch error:',
        error instanceof Error ? error.message : error
      );
    }
  };

  const foodCategories: string[] = [
    'Vegetarian',
    'Non-Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Desserts',
    'Beverages',
    'Seafood',
    'Snacks',
    'Fast Food',
    'Healthy',
    'Indian',
    'Chinese',
    'Italian',
    'Mexican',
    'Mediterranean',
    'Breakfast',
    'Lunch',
    'Dinner'
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Handle category selection
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedCategories.includes(selectedValue)) {
      setSelectedCategories([...selectedCategories, selectedValue]);
    }
    e.target.value = ''; // Reset the dropdown to placeholder
  };

  // Remove category
  const removeCategory = (categoryToRemove: string): void => {
    setSelectedCategories(
      selectedCategories.filter((category) => category !== categoryToRemove)
    );
  };

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
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-4/5 sm:h-9/10">
            <form onSubmit={handleSubmit} className="bg-white p-6">
              <h3
                className="text-lg font-semibold text-gray-900"
                id="modal-title"
              >
                {product ? 'Update Product' : 'Add Product'}
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col items-center w-full">
                  <label className="block w-full text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder={product ? product.title : 'Title'}
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="flex flex-col items-center w-full">
                  <label className="block w-full text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder={product ? product.description : 'Description'}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      placeholder={
                        product
                          ? product.originalPrice.toString()
                          : 'Original Price'
                      }
                      value={formData.originalPrice}
                      onChange={handleChange}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder={product ? product.price.toString() : 'Price'}
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700">
                      Serving Type
                    </label>
                    <input
                      type="text"
                      name="servingType"
                      placeholder={
                        product ? product.servingType : 'Serving Type'
                      }
                      value={formData.servingType}
                      onChange={handleChange}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder={product ? product.quantity : 'Quantity'}
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-4 w-full">
                  <div className="flex flex-col items-center justify-center w-1/2 h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Image</span>: Click to
                          upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col items-center justify-center w-1/2 h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <label
                      htmlFor="dropzone-file-large"
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Large Image</span>:
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file-large"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="food-category"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Select Food Categories
                  </label>
                  <select
                    id="food-category"
                    name="categories"
                    onChange={handleCategoryChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="" disabled>
                      Choose a category
                    </option>
                    {foodCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {/* Selected Categories */}
                  <div className="mt-4">
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category, index) => (
                          <div
                            key={index}
                            className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-sm font-medium"
                          >
                            <span>{category}</span>
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                {/* Left side: Generate, Input field, Retry */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="rounded-md bg-blue-500 px-4 py-2 text-white"
                    // onClick={handleGenerate}
                  >
                    Generate
                  </button>
                  <input
                    type="text"
                    placeholder="Product Id"
                    className="rounded-md border border-gray-300 px-3 py-2"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-gray-300 p-2"
                    // onClick={handleRetry}
                  >
                    🔄
                  </button>
                </div>

                {/* Middle section: Hide and Veg checkboxes */}
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mr-2">
                      Hide
                    </label>
                    <input
                      type="checkbox"
                      name="hide"
                      checked={formData.hide}
                      onChange={handleChange}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mr-2">
                      Veg
                    </label>
                    <input
                      type="checkbox"
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleChange}
                      className="rounded"
                    />
                  </div>
                </div>

                {/* Right side: Cancel and Submit buttons */}
                <div className="space-x-2">
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
                    onClick={handleSubmit}
                  >
                    {product ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
