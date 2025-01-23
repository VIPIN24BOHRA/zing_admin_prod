import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const ExportCsvModal = ({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (startDate: Date, endDate: Date) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateDates = () => {
    if (!startDate || !endDate) {
      setError('Both start and end dates are required.');
      return false;
    }
    if (endDate < startDate) {
      setError('End date cannot be before start date.');
      return false;
    }
    if (
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) >
      365
    ) {
      setError('The date range cannot exceed 1 year.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (date && !isNaN(date.getTime())) {
      setError(null);
      if (type === 'start') setStartDate(new Date(date.setHours(0, 0, 0, 0)));
      if (type === 'end') setEndDate(new Date(date.setHours(23, 59, 59, 999)));
    }
  };

  const handleSubmit = async () => {
    if (validateDates()) {
      setIsSubmitting(true);
      try {
        await onSubmit(startDate as Date, endDate as Date);
      } catch (error) {
        console.error('Error during submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2
          id="modal-title"
          className="text-lg font-semibold text-gray-800 mb-4"
        >
          Export CSV
        </h2>
        <div className="mb-4">
          <label
            htmlFor="start-date-picker"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <DatePicker
            id="start-date-picker"
            selected={startDate}
            onChange={(date) => handleDateChange(date, 'start')}
            dateFormat="yyyy/MM/dd"
            maxDate={new Date()}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select start date"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="end-date-picker"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <DatePicker
            id="end-date-picker"
            selected={endDate}
            onChange={(date) => handleDateChange(date, 'end')}
            dateFormat="yyyy/MM/dd"
            maxDate={new Date()}
            minDate={startDate || undefined}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select end date"
          />
        </div>
        {error && (
          <div
            className="text-sm text-red-600 mb-4"
            role="alert"
            aria-describedby="error-message"
          >
            {error}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!startDate || !endDate || Boolean(error) || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
