import React from 'react';
import { Trash2 } from 'lucide-react';
import { Break } from '../types';
import TimeInput from './TimeInput';
import { calculateDuration, formatDuration } from '../utils/timeUtils';

interface BreakItemProps {
  breakItem: Break;
  onUpdate: (id: string, field: 'startTime' | 'endTime', value: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const BreakItem: React.FC<BreakItemProps> = ({ breakItem, onUpdate, onDelete, index }) => {
  const { id, startTime, endTime } = breakItem;
  
  const duration = calculateDuration(startTime, endTime);
  const formattedDuration = formatDuration(duration);
  
  return (
    <div className="flex flex-col md:flex-row gap-4 p-3 border rounded-md bg-white mb-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex-none">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Break {index + 1}
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeInput
          label="Start Time"
          value={startTime}
          onChange={(value) => onUpdate(id, 'startTime', value)}
        />
        
        <TimeInput
          label="End Time"
          value={endTime}
          onChange={(value) => onUpdate(id, 'endTime', value)}
        />
      </div>
      
      <div className="flex items-end justify-between md:flex-col md:justify-center gap-2 mt-2 md:mt-0">
        <div className="text-sm font-medium text-gray-700">
          {startTime && endTime ? formattedDuration : '--'}
        </div>
        
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          title="Delete break"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default BreakItem;