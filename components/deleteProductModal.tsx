import React, { useState } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void; 
}

const DeleteProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
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
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl sm:w-full sm:max-w-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <h3
                className="text-lg font-medium leading-6 text-gray-900"
                id="modal-title"
              >
                Delete Product
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 flex justify-center space-x-4">
              <button
                type="button"
                className="inline-flex w-auto justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex w-auto justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
