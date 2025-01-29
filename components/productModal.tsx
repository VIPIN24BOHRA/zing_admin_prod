'use-client';
import { ProductModel } from '@/lib/models';
import { uploadImage } from '@/lib/storage';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Spinner from './ui/spinner';
import { generateId } from '@/lib/utils';

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
  const [isSaveLoading, setIsSaveLoading] = useState(false);

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
    originalPrice: product?.originalPrice || '',
    price: product?.price || '',
    hide: product?.hide || false,
    isVeg: product?.isVeg || false,
    categories: selectedCategories,
    servingType: product?.servingType || '',
    quantity: product?.quantity || '',
    imageUrl: product?.imageUrl || '',
    largeImageUrl: product?.imageUrl || '',
    productId: product?.productId || ''
  });

  useEffect(() => {
    if (!formData.productId) {
      setFormData((prevData) => ({
        ...prevData,
        productId: `#PI_${generateId(6)}`
      }));
    }
  }, []);

  useEffect(() => {
    if (product?.categories && Array.isArray(product.categories)) {
      setSelectedCategories(product.categories);
    }
  }, [product]);

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
              ? value === '' || isNaN(Number(value))
                ? value
                : Math.max(0, Number(value))
              : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaveLoading) return;

    setIsSaveLoading(true);

    const requiredFields = [
      'title',
      'description',
      'originalPrice',
      'price',
      'quantity',
      'categories'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill out the ${field} field.`);
        setIsSaveLoading(false);
        return;
      }
    }

    if (selectedCategories.length === 0) {
      alert('Please select at least one category.');
      setIsSaveLoading(false);
      return;
    }

    if (
      (!imageFile && !formData.imageUrl) ||
      (!largeImageFile && !formData.largeImageUrl)
    ) {
      alert('Both image and large image files or URLs are required.');
      setIsSaveLoading(false);
      return;
    }

    try {
      let imageUrl: any = formData.imageUrl;
      let largeImageUrl: any = formData.largeImageUrl!;

      if (imageFile) {
        try {
          const imageName =
            imageFile.name.split('.')[0] +
            `_${formData.productId}_${Date.now().toString()}`;
          console.log('imageFile', imageFile);
          imageUrl = await uploadImage(imageName, imageFile);
          console.log('Image URL:', imageUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
          setIsSaveLoading(false);
          return;
        }
      }

      if (largeImageFile) {
        try {
          const imageName =
            largeImageFile.name.split('.')[0] +
            `_${formData.productId}_${Date.now().toString()}_500`;
          largeImageUrl = await uploadImage(imageName, largeImageFile);
          console.log('Large Image URL:', largeImageUrl);
        } catch (err) {
          console.error('Error uploading large image:', err);
          setIsSaveLoading(false);
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
          categories: selectedCategories,
          imageUrl,
          largeImageUrl,
          productId:formData.productId
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
    } finally {
      setIsSaveLoading(false);
    }
  };

  const [foodCategories, setFoodCategories] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/product/categories');
        const result = await response.json();
        console.log(result);
        setFoodCategories(result.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
      const fileInput = event.target;
      const file = event.target.files?.[0];
      if (!file) {
        console.error('No file selected');
        return;
      }
      isLarge ? setIsUploadingLargeImage(true) : setIsUploadingImage(true);

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload PNG, JPG, or JPEG files.');
        return;
      }

      // Validate file size (example: 1MB limit)
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds the limit of 1MB.');
        return;
      }

      // Validate dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width } = img;
        const maxWidth = isLarge ? 500 : 300;

        if (width > maxWidth) {
          alert(
            `Invalid image dimensions. The width should not exceed ${maxWidth}px.`
          );
          URL.revokeObjectURL(img.src); // Clean up the object URL
          return;
        }

        // Generate a preview URL for the image
        const previewUrl = img.src;

        // Update the state with the preview URL
        if (isLarge) {
          setLargeImagePreview(previewUrl);
          setLargeImageFile(file);
        } else {
          setImagePreview(previewUrl);
          setImageFile(file);
        }
      };

      img.onerror = () => {
        alert('Failed to load the image. Please try again.');
        URL.revokeObjectURL(img.src); // Clean up the object URL
      };

      fileInput.value = '';
    } catch (error) {
      console.error('Error while uploading file:', error);
      alert('An error occurred during file upload. Please try again.');
    } finally {
      isLarge ? setIsUploadingLargeImage(false) : setIsUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
      <div className="relative flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
        <div className="relative flex transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:h-[100vh]">
          <form
            onSubmit={handleSubmit}
            className="bg-white px-12 py-2 w-3/4 flex flex-col border-r-2 border-dashed border-[#aaa]"
          >
            <h3
              className="text-[28px] font-semibold text-gray-900 flex-none"
              id="modal-title"
            >
              {product ? 'Update Product' : 'Add Product'}
            </h3>
            <div className="mt-1 grow space-y-2 flex flex-col">
              <div className="mb-2 flex flex-col items-center w-full">
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

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                    placeholder={
                      product ? product.price.toString() : 'Discount Price'
                    }
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
                    placeholder={product ? product.servingType : 'Serving Type'}
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

              <div className="pt-2 flex-col w-full">
                <div className="flex space-x-4">
                  {/* First Dropzone */}
                  <div className="flex flex-col items-center w-1/2 justify-center h-20 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 transition ease-in-out">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center p-2">
                        {isUploadingImage ? (
                          'Uploading...'
                        ) : (
                          <>
                            <svg
                              className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
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
                              Click to upload
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
                  <div className="flex flex-col items-center w-1/2 justify-center h-20 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 transition ease-in-out">
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
                              className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
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
                              <span className="font-semibold">Large Image</span>
                              : Click to upload
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
                </div>

                <div className="pt-2 w-full self-start flex items-center">
                  <div className="w-1/2">
                    <label className="text-sm font-medium text-gray-700 mt-2">
                      Product Id
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                      <input
                        readOnly
                        disabled
                        type="text"
                        name="productId"
                        placeholder={formData.productId.toString()}
                        value={formData.productId.toString()}
                        className="rounded-md border px-3 py-2 flex-1"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-evenly w-1/2">
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="hide"
                          className="sr-only peer"
                          onChange={handleChange}
                          checked={formData.hide}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Hide item
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          onChange={handleChange}
                          checked={formData.isVeg}
                          name="isVeg"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Veg
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/*Categories */}
                <div className="mt-4 w-2/3 justify-start">
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
                    <option value="">Choose a category</option>
                    {foodCategories
                      ? foodCategories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))
                      : ''}
                  </select>

                  {/* Selected Categories */}
                  <div className="mt-4">
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category, index) => (
                          <div
                            key={index}
                            className="flex items-center px-3 py-1 bg-green-100 border-[1px] border-green-500 shadow-xl rounded-full text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300"
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
          <div className="grow flex flex-col h-full items-center space-y-4 p-2 bg-gray-200">
            <p className="text-lg font-bold">Preview</p>
            <p className="text-sm font-semibold">Card preview</p>
            <div className="shadow-xl rounded-lg w-[160px]">
              <div className="w-[160px] h-[140px] rounded-t-lg bg-gray-100 flex flex-col items-center justify-center relative">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Uploaded Large Preview"
                      className="w-full rounded-t-lg h-full object-cover"
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
                    className="w-full rounded-t-lg h-full object-cover"
                  />
                ) : (
                  'upload img'
                )}
              </div>
              <div className="p-2 bg-white">
                <p className="text-sm">
                  {formData.title ? formData.title : '----'}
                </p>
                <div className="my-4 flex justify-between items-center">
                  <p className="text-sm font-semibold text-green-500">
                    ₹{formData.price ? formData.price : '--'}
                  </p>
                  <button className="flex items-center border-[1px] border-green-500 rounded-lg px-2 py-1">
                    <span className="text-xs pr-2 text-green-500">Add</span>
                    <span className="text-xs text-green-500">+</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold pt-12">Description preview</p>
            <div className="w-[320px] h-[200px] shadow-xl rounded-lg bg-white flex flex-col items-center justify-center relative">
              {largeImagePreview ? (
                <>
                  <img
                    src={largeImagePreview}
                    alt="Uploaded Preview"
                    className="w-[320px] h-[200px] object-cover rounded-lg "
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
                  className="w-full h-full rounded-lg  object-cover"
                />
              ) : (
                'upload description img'
              )}
            </div>
          </div>
        </div>
        <div className="absolute flex justify-end items-center bottom-0 shadow-[0_-5px_35px_rgba(0,0,0,0.25)] h-16 bg-white w-full">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-red-600 text-white px-4 py-2 w-40 "
          >
            Cancel
          </button>
          {isSaveLoading ? (
            <div className="mx-6 rounded-md px-4 py-2 w-40 text-white flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <button
              type="submit"
              className="mx-6 rounded-md bg-green-500 px-4 py-2 w-40 text-white"
              onClick={handleSubmit}
              disabled={isSaveLoading}
            >
              {product ? 'Update' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
