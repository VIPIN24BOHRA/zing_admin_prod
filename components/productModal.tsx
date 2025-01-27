'use-client';
import { ProductModel } from '@/lib/models';
import { uploadImage } from '@/lib/storage';
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingLargeImage, setIsUploadingLargeImage] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [largeImagePreview, setLargeImagePreview] = useState<string | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [largeImageFile, setLargeImageFile] = useState<File | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    originalPrice: product?.originalPrice || 0,
    price: product?.price || 0,
    hide: product?.hide || false,
    isVeg: product?.isVeg || false,
    categories: selectedCategories,
    servingType: product?.servingType || '-',
    quantity: product?.quantity || '',
    imageUrl: product?.imageUrl || '',
    largeImageUrl: product?.imageUrl || '',
    productId: product?.productId || ''
  });

  useEffect(() => {
    if (!formData.productId) {
      setFormData((prevData) => ({
        ...prevData,
        productId: Date.now().toString()
      }));
    }
  }, []);

  let debounceTimeout: NodeJS.Timeout;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prevData) => {
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

    if (
      (!imageFile && !formData.imageUrl) ||
      (!largeImageFile && !formData.largeImageUrl)
    ) {
      alert('Both image and large image files or URLs are required.');
      return;
    }

    try {
      let imageUrl: any = formData.imageUrl;
      let largeImageUrl: any = formData.largeImageUrl!;

      if (imageFile) {
        try {
          imageUrl = await uploadImage(`${formData.productId}`, imageFile);
          console.log('Image URL:', imageUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      }

      if (largeImageFile) {
        try {
          largeImageUrl = await uploadImage(
            `${formData.productId}_500`,
            largeImageFile
          );
          console.log('Large Image URL:', largeImageUrl);
        } catch (err) {
          console.error('Error uploading large image:', err);
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
          categories: selectedCategories,
          imageUrl,
          largeImageUrl,
          productId: Number(formData.productId)
        },
        id: totalProducts || id
      };

      console.log('Payload:', payload);

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

        // Clear form data
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
      console.error('Error:', error instanceof Error ? error.message : error);
      alert('Failed to upload images or add the product.');
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

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedCategories.includes(selectedValue)) {
      setSelectedCategories([...selectedCategories, selectedValue]);
    }
    e.target.value = '';
  };

  const removeCategory = (categoryToRemove: string): void => {
    setSelectedCategories(
      selectedCategories.filter((category) => category !== categoryToRemove)
    );
  };
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    isLarge: boolean
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        console.error('No file selected');
        return;
      }
      isLarge ? setIsUploadingLargeImage(true) : setIsUploadingImage(true);

      // Validate file type
      const validTypes = [
        'image/svg+xml',
        'image/png',
        'image/jpeg',
        'image/gif'
      ];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload SVG, PNG, JPG, or GIF files.');
        return;
      }

      // Validate file size (example: 1MB limit)
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds the limit of 1MB.');
        return;
      }

      // Generate a preview URL for the image
      const previewUrl = URL.createObjectURL(file);

      // Update the state with the preview URL
      if (isLarge) {
        setLargeImagePreview(previewUrl);
        setLargeImageFile(file);
      } else {
        setImagePreview(previewUrl);
        setImageFile(file);
      }
    } catch (error) {
      console.error('Error while uploading file:', error);
      alert('An error occurred during file upload. Please try again.');
    } finally {
      isLarge ? setIsUploadingLargeImage(false) : setIsUploadingImage(false);
    }
  };

  return (
    <div
      className="relative z-30 w-full h-[100vh]"
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
          <div className="relative flex transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:h-[100vh]">
            <form onSubmit={handleSubmit} className="bg-white p-6 w-3/4">
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

                <div className="flex-col items-center justify-between space-x-4 w-full">
                  <div className="flex space-x-4">
                    {/* First Dropzone */}
                    <div className="flex flex-col items-center justify-center w-1/3 h-52 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 transition ease-in-out">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-full"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {isUploadingImage ? (
                            'Uploading...'
                          ) : (
                            <>
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
                                <span className="font-semibold">Image</span>:
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, false)}
                        />
                      </label>
                    </div>
                    {/* Second Dropzone */}
                    <div className="flex flex-col items-center justify-center w-1/3 h-52 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 transition ease-in-out">
                      <label
                        htmlFor="dropzone-file-large"
                        className="flex flex-col items-center justify-center w-full h-full"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {isUploadingLargeImage ? (
                            'Uploading...'
                          ) : (
                            <>
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
                                <span className="font-semibold">
                                  Large Image
                                </span>
                                : Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          id="dropzone-file-large"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, true)}
                          disabled={isUploadingLargeImage}
                        />
                      </label>
                    </div>

                    <div className="w-1/3 self-start flex flex-col justify-between h-full">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mt-2">
                          Product Id
                        </label>
                        <div className="flex items-center space-x-4 mt-2">
                          <input
                            readOnly
                            type="text"
                            name="productId"
                            placeholder={formData.productId.toString()}
                            value={formData.productId.toString()}
                            className="rounded-md border px-3 py-2 flex-1"
                          />
                        </div>

                        <div className="mt-4 flex justify-stretch">
                          <div className="flex justify-evenly w-full">
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
                        </div>

                        <div className="flex justify-end space-x-2 mt-20">
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-gray-300 px-4 py-2 w-40"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 w-40 text-white"
                            onClick={handleSubmit}
                          >
                            {product ? 'Update Item' : 'Add Item'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*Categories */}
                  <div className="w-2/3 justify-start">
                    <label
                      htmlFor="food-category"
                      className="m-0 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Select Food Categories
                    </label>
                    <select
                      id="food-category"
                      name="categories"
                      onChange={handleCategoryChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                              className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300"
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
              </div>
            </form>
            <div className="w-1/4 flex flex-col h-full items-center justify-center space-y-4">
              <div className="w-[350px] h-[230px] border-2 border-dashed rounded-lg bg-red-50 flex flex-col items-center justify-center relative">
                {largeImagePreview ? (
                  <>
                    <img
                      src={largeImagePreview}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => {
                        setLargeImagePreview(null);
                        setLargeImageFile(null);
                      }}
                    >
                      &times;
                    </button>
                  </>
                ) : product ? (
                  <img
                    src={product.largeImageUrl}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  'No large image uploaded'
                )}
              </div>
              <div className="w-[180px] h-[180px] border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center relative">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Uploaded Large Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      &times;
                    </button>
                  </>
                ) : product ? (
                  <img
                    src={product.imageUrl}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  'No  image uploaded'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
