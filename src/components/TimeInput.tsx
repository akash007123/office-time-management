import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { isValidTimeFormat } from '../utils/timeUtils';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  setCurrentTime?: boolean;
  className?: string;
  displayFormat?: (time: string) => string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  error,
  setCurrentTime = true,
  className = '',
}) => {
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTime = e.target.value;
    if (!inputTime) {
      onChange('');
      return;
    }

    // Convert 12-hour format to 24-hour format
    const [hours, minutes] = inputTime.split(':').map(Number);
    let adjustedHours = hours;

    if (ampm === 'PM' && hours !== 12) {
      adjustedHours = hours + 12;
    } else if (ampm === 'AM' && hours === 12) {
      adjustedHours = 0;
    }

    const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(formattedTime);
  };

  const handleAmPmChange = (newAmPm: 'AM' | 'PM') => {
    setAmpm(newAmPm);
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      let adjustedHours = hours;

      if (newAmPm === 'PM' && hours < 12) {
        adjustedHours = hours + 12;
      } else if (newAmPm === 'AM' && hours >= 12) {
        adjustedHours = hours - 12;
      }

      const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      onChange(formattedTime);
    }
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentAmPm = hours >= 12 ? 'PM' : 'AM';
    setAmpm(currentAmPm);
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(formattedTime);
  };

  const isValid = !value || isValidTimeFormat(value);
  
  // Convert 24-hour value to 12-hour for display
  const get12HourValue = () => {
    if (!value) return '';
    const [hours, minutes] = value.split(':').map(Number);
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="time"
            value={value}
            onChange={handleTimeChange}
            disabled={disabled}
            className={`block w-full px-3 py-2 border ${
              !isValid ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-700">{get12HourValue()}</span>
          </div>
        </div>

        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => handleAmPmChange('AM')}
            className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
              ampm === 'AM'
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handleAmPmChange('PM')}
            className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
              ampm === 'PM'
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            PM
          </button>
        </div>

        {setCurrentTime && !disabled && (
          <button
            type="button"
            onClick={handleSetCurrentTime}
            className="px-3 py-2 text-gray-500 hover:text-blue-500 focus:outline-none"
            title="Set current time"
          >
            <Clock size={16} />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!isValid && <p className="mt-1 text-sm text-red-600">Please enter a valid time</p>}
    </div>
  );
};

export default TimeInput;