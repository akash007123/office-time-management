import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import TimeInput from './TimeInput';
import BreakItem from './BreakItem';
import { TimeEntry, Break, TimeFieldType } from '../types';
import { calculateDuration, formatDuration, calculateTotalBreakTime, formatTime } from '../utils/timeUtils';

interface TimeTrackerProps {
  entry: TimeEntry;
  onChange: (updatedEntry: TimeEntry) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ entry, onChange }) => {
  const { officeIn, officeOut, lunchStart, lunchEnd, breaks } = entry;

  // Handler for basic time fields
  const handleTimeChange = (field: TimeFieldType, value: string) => {
    onChange({
      ...entry,
      [field]: value,
    });
  };

  // Add a new break
  const handleAddBreak = () => {
    const newBreak: Break = {
      id: nanoid(),
      startTime: '',
      endTime: '',
    };
    
    onChange({
      ...entry,
      breaks: [...breaks, newBreak],
    });
  };

  // Update a break
  const handleUpdateBreak = (id: string, field: 'startTime' | 'endTime', value: string) => {
    const updatedBreaks = breaks.map(breakItem => 
      breakItem.id === id ? { ...breakItem, [field]: value } : breakItem
    );
    
    onChange({
      ...entry,
      breaks: updatedBreaks,
    });
  };

  // Delete a break
  const handleDeleteBreak = (id: string) => {
    const updatedBreaks = breaks.filter(breakItem => breakItem.id !== id);
    
    onChange({
      ...entry,
      breaks: updatedBreaks,
    });
  };

  // Calculate durations
  const totalOfficeTime = calculateDuration(officeIn, officeOut);
  const lunchDuration = calculateDuration(lunchStart, lunchEnd);
  const totalCustomBreakTime = calculateTotalBreakTime(breaks);
  const totalBreakTime = lunchDuration + totalCustomBreakTime;
  const totalDeskTime = totalOfficeTime - totalBreakTime;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <h2 className="text-xl font-bold text-white">Time Tracking</h2>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                label="Office In"
                value={officeIn}
                onChange={(value) => handleTimeChange('officeIn', value)}
                displayFormat={formatTime}
              />
              <TimeInput
                label="Office Out"
                value={officeOut}
                onChange={(value) => handleTimeChange('officeOut', value)}
                displayFormat={formatTime}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Lunch Break</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                label="Lunch Start"
                value={lunchStart}
                onChange={(value) => handleTimeChange('lunchStart', value)}
                displayFormat={formatTime}
              />
              <TimeInput
                label="Lunch End"
                value={lunchEnd}
                onChange={(value) => handleTimeChange('lunchEnd', value)}
                displayFormat={formatTime}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Breaks</h3>
            <button
              type="button"
              onClick={handleAddBreak}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Break
            </button>
          </div>
          
          <div className="space-y-3">
            {breaks.map((breakItem, index) => (
              <BreakItem
                key={breakItem.id}
                breakItem={breakItem}
                onUpdate={handleUpdateBreak}
                onDelete={handleDeleteBreak}
                index={index}
              />
            ))}
            {breaks.length === 0 && (
              <p className="text-sm text-gray-500 italic">No additional breaks recorded</p>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-500">Total Office Hours</div>
              <div className="mt-1 text-2xl font-semibold text-blue-600">
                {officeIn && officeOut ? formatDuration(totalOfficeTime) : '--'}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-500">Total Break Time</div>
              <div className="mt-1 text-2xl font-semibold text-amber-500">
                {formatDuration(totalBreakTime)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Lunch: {lunchStart && lunchEnd ? formatDuration(lunchDuration) : '--'}
                {totalCustomBreakTime > 0 && ` • Other: ${formatDuration(totalCustomBreakTime)}`}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-500">Total Desk Time</div>
              <div className="mt-1 text-2xl font-semibold text-teal-600">
                {officeIn && officeOut ? formatDuration(totalDeskTime) : '--'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;