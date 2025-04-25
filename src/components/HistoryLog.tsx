import React, { useState } from 'react';
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { TimeEntry } from '../types';
import { formatDate, formatDuration, calculateDuration, calculateTotalBreakTime, formatTime } from '../utils/timeUtils';

interface HistoryLogProps {
  entries: TimeEntry[];
  onSelect: (entry: TimeEntry) => void;
  currentDate: string;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ entries, onSelect, currentDate }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchDate, setSearchDate] = useState('');
  
  // Filter entries by date if search date is provided
  const filteredEntries = searchDate
    ? entries.filter(entry => entry.date.includes(searchDate))
    : entries;
  
  // Sort entries by date in descending order (most recent first)
  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Paginate entries
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const paginatedEntries = sortedEntries.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handleDateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
    setPage(1); // Reset to first page when search changes
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
        <h2 className="text-xl font-bold text-white">History Log</h2>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <label htmlFor="date-search" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            id="date-search"
            value={searchDate}
            onChange={handleDateSearch}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        {paginatedEntries.length > 0 ? (
          <div className="space-y-3">
            {paginatedEntries.map((entry) => {
              const totalOfficeTime = calculateDuration(entry.officeIn, entry.officeOut);
              const lunchDuration = calculateDuration(entry.lunchStart, entry.lunchEnd);
              const totalBreakTime = calculateTotalBreakTime(entry.breaks);
              const totalDeskTime = totalOfficeTime - lunchDuration - totalBreakTime;
              
              const isCurrentDay = entry.date === currentDate;
              
              return (
                <div 
                  key={entry.date} 
                  className={`border rounded-md p-4 transition-all hover:shadow-md cursor-pointer ${
                    isCurrentDay ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => onSelect(entry)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">{formatDate(entry.date)}</span>
                        {isCurrentDay && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 ml-6 mb-2">
                        <span className="inline-flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatTime(entry.officeIn)} - {formatTime(entry.officeOut)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 ml-6">
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Office:</span> {formatDuration(totalOfficeTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Desk:</span> {formatDuration(totalDeskTime)}
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No entries found</p>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 text-sm rounded-md ${
                page === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 text-sm rounded-md ${
                page === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryLog;