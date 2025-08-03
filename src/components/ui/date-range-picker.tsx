import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './button';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  className = ""
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const formatDateRange = (start: string, end: string) => {
    const startFormatted = new Date(start).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const endFormatted = new Date(end).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return `${startFormatted} - ${endFormatted}`;
  };

  const handleTempDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setTempStartDate(value);
    } else {
      setTempEndDate(value);
    }
  };

  const applyDateRange = () => {
    onDateChange(tempStartDate, tempEndDate);
    setShowDatePicker(false);
  };

  const cancelDateRange = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowDatePicker(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300"
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{formatDateRange(startDate, endDate)}</span>
      </div>
      
      {/* Date Picker Dropdown */}
      {showDatePicker && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => handleTempDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => handleTempDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelDateRange}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={applyDateRange}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};