import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const AnalyticsDatePicker = ({
  handleSearch
}: {
  handleSearch: (startDate: Date, endDate: Date) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (date && !isNaN(date.getTime())) {
      if (type === 'start') setStartDate(new Date(date.setHours(0, 0, 0, 0)));
      if (type === 'end') setEndDate(new Date(date.setHours(23, 59, 59, 999)));
    }
  };

  const handleSearchBtnClick = () => {
    if (startDate == null || endDate == null) return;
    handleSearch(startDate, endDate);
    setEndDate(null);
    setStartDate(null);
  };
  return (
    <div className="flex z-10">
      <DatePicker
        id="start-date-picker"
        selected={startDate}
        onChange={(date) => handleDateChange(date, 'start')}
        dateFormat="dd/MM/yyyy"
        maxDate={new Date()}
        minDate={startDate || undefined}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        placeholderText="Select start date"
      />
      <DatePicker
        id="end-date-picker"
        selected={endDate}
        onChange={(date) => handleDateChange(date, 'end')}
        dateFormat="dd/MM/yyyy"
        maxDate={new Date()}
        minDate={startDate || undefined}
        className="ml-4 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        placeholderText="Select end date"
      />

      <button
        className="bg-[#000] text-white px-6 py-1 rounded-lg ml-8"
        onClick={handleSearchBtnClick}
      >
        Search
      </button>
    </div>
  );
};
