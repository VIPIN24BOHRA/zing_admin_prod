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

  const validateDates = () => {
    // Ensure both dates are selected
    if (!startDate || !endDate) {
      setError('Both start and end dates are required.');
      return false;
    }
    // Ensure endDate is not before startDate
    if (endDate < startDate) {
      setError('End date cannot be before start date.');
      return false;
    }
    // Restrict date ranges exceeding one year
    if (
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) >
      365
    ) {
      setError('The date range cannot exceed 1 year.');
      return false;
    }
    // Clear errors if everything is valid
    setError(null);
    return true;
  };

  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (date && !isNaN(date.getTime())) {
      // Check for unwanted text pattern (if applicable in your setup)
      const formattedDate = date.toISOString().split('T')[0]; // e.g., "2025-01-08"
      const invalidPattern = /\d{4}\/\d{2}\/\d{2}(sm|sc|kn)/i; // Example pattern
      if (invalidPattern.test(formattedDate)) {
        setError('Invalid date format or pattern detected.');
        return;
      }
      setError(null); // Clear any existing errors

      // Update the corresponding date
      if (type === 'start') setStartDate(date);
      if (type === 'end') setEndDate(date);
    }
  };

  const handleSubmit = () => {
    if (validateDates()) {
      onSubmit(startDate as Date, endDate as Date);
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
            maxDate={new Date()} // Prevent future dates
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
            maxDate={new Date()} // Prevent future dates
            minDate={startDate || undefined} // Prevent selecting dates before startDate
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
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!startDate || !endDate || Boolean(error)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
