import { TimeEntry } from '../types';

const STORAGE_KEY = 'office-time-entries';

/**
 * Saves a time entry to local storage
 */
export const saveTimeEntry = (entry: TimeEntry): void => {
  const entries = getTimeEntries();
  
  // Check if entry for this date already exists
  const existingEntryIndex = entries.findIndex(e => e.date === entry.date);
  
  if (existingEntryIndex >= 0) {
    // Update existing entry
    entries[existingEntryIndex] = entry;
  } else {
    // Add new entry
    entries.push(entry);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

/**
 * Gets all time entries from local storage
 */
export const getTimeEntries = (): TimeEntry[] => {
  const storedEntries = localStorage.getItem(STORAGE_KEY);
  return storedEntries ? JSON.parse(storedEntries) : [];
};

/**
 * Gets a specific time entry by date
 */
export const getTimeEntryByDate = (date: string): TimeEntry | null => {
  const entries = getTimeEntries();
  return entries.find(entry => entry.date === date) || null;
};

/**
 * Deletes a time entry by date
 */
export const deleteTimeEntry = (date: string): void => {
  const entries = getTimeEntries();
  const filteredEntries = entries.filter(entry => entry.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
};

/**
 * Clears all time entries from local storage
 */
export const clearAllTimeEntries = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};