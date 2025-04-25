import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Clock, Calendar, Briefcase } from 'lucide-react';
import TimeTracker from './components/TimeTracker';
import ReportEditor from './components/ReportEditor';
import ActionButtons from './components/ActionButtons';
import HistoryLog from './components/HistoryLog';
import { TimeEntry } from './types';
import { 
  getTodayDate, 
  getCurrentTime, 
  isValidTimeFormat, 
  formatDate 
} from './utils/timeUtils';
import { 
  saveTimeEntry, 
  getTimeEntries, 
  getTimeEntryByDate 
} from './utils/storageUtils';

function App() {
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry>({
    id: nanoid(),
    date: currentDate,
    officeIn: '',
    officeOut: '',
    lunchStart: '',
    lunchEnd: '',
    breaks: [],
    report: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Load entries from local storage on mount
  useEffect(() => {
    const loadedEntries = getTimeEntries();
    setEntries(loadedEntries);
    
    // Try to load today's entry
    const todayEntry = getTimeEntryByDate(currentDate);
    if (todayEntry) {
      setCurrentEntry(todayEntry);
    }
  }, [currentDate]);
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setCurrentDate(newDate);
    
    // Load entry for selected date or create a new one
    const existingEntry = getTimeEntryByDate(newDate);
    if (existingEntry) {
      setCurrentEntry(existingEntry);
    } else {
      setCurrentEntry({
        id: nanoid(),
        date: newDate,
        officeIn: '',
        officeOut: '',
        lunchStart: '',
        lunchEnd: '',
        breaks: [],
        report: '',
      });
    }
  };
  
  // Handle entry selection from history
  const handleSelectEntry = (entry: TimeEntry) => {
    setCurrentDate(entry.date);
    setCurrentEntry(entry);
  };
  
  // Handle entry updates
  const handleEntryChange = (updatedEntry: TimeEntry) => {
    setCurrentEntry(updatedEntry);
  };
  
  // Handle report changes
  const handleReportChange = (reportText: string) => {
    setCurrentEntry({
      ...currentEntry,
      report: reportText,
    });
  };
  
  // Save the current entry
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate a small delay to show saving state
    setTimeout(() => {
      saveTimeEntry(currentEntry);
      
      // Refresh entries list
      const updatedEntries = getTimeEntries();
      setEntries(updatedEntries);
      
      setIsSaving(false);
    }, 500);
  };
  
  // Reset the current entry to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      const existingEntry = getTimeEntryByDate(currentDate);
      if (existingEntry) {
        setCurrentEntry(existingEntry);
      } else {
        setCurrentEntry({
          id: nanoid(),
          date: currentDate,
          officeIn: '',
          officeOut: '',
          lunchStart: '',
          lunchEnd: '',
          breaks: [],
          report: '',
        });
      }
    }
  };
  
  // Validate the current entry
  const isValid = () => {
    // Check if required fields have valid time format
    const requiredTimeFields = ['officeIn', 'officeOut'] as const;
    
    return requiredTimeFields.every(field => 
      !currentEntry[field] || isValidTimeFormat(currentEntry[field])
    );
  };
  
  // Determine if the form is valid
  const formIsValid = isValid();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Briefcase className="text-white mr-3" size={28} />
              <h1 className="text-2xl font-bold text-white">Office Time Manager</h1>
            </div>
            
            <div className="flex items-center bg-blue-800 bg-opacity-30 px-4 py-2 rounded-md">
              <Calendar className="text-blue-200 mr-2" size={16} />
              <input
                type="date"
                value={currentDate}
                onChange={handleDateChange}
                className="bg-transparent border-none text-white focus:outline-none focus:ring-0 text-sm px-1"
              />
            </div>
          </div>
          
          <div className="mt-2 text-blue-100 flex items-center">
            <Clock className="mr-2" size={16} />
            <span>Managing time entries for {formatDate(currentDate)}</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TimeTracker 
              entry={currentEntry}
              onChange={handleEntryChange}
            />
            
            <ReportEditor 
              value={currentEntry.report}
              onChange={handleReportChange}
            />
            
            <ActionButtons 
              entry={currentEntry}
              onSave={handleSave}
              onReset={handleReset}
              isValid={formIsValid}
              isSaving={isSaving}
            />
          </div>
          
          <div className="lg:col-span-1">
            <HistoryLog 
              entries={entries}
              onSelect={handleSelectEntry}
              currentDate={currentDate}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            Office Time Management System &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;