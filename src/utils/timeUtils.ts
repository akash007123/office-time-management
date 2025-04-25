/**
 * Calculates the duration between two time strings in minutes
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  // Handle case where end time is on the next day
  return endMinutes < startMinutes 
    ? endMinutes + (24 * 60) - startMinutes 
    : endMinutes - startMinutes;
};

/**
 * Formats minutes into hours and minutes (HH:MM)
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Converts minutes to decimal hours (e.g., 90 minutes = 1.5 hours)
 */
export const minutesToDecimalHours = (minutes: number): number => {
  return parseFloat((minutes / 60).toFixed(2));
};

/**
 * Gets the current time in HH:MM format
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Gets today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formats a date string to a more readable format (e.g., "Monday, January 1, 2023")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Validates time string format (HH:MM)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(time);
};

/**
 * Formats time from 24-hour to 12-hour format with AM/PM
 */
export const formatTime = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Calculates total break time in minutes
 */
export const calculateTotalBreakTime = (breaks: { startTime: string; endTime: string }[]): number => {
  return breaks.reduce((total, breakItem) => {
    if (breakItem.startTime && breakItem.endTime) {
      return total + calculateDuration(breakItem.startTime, breakItem.endTime);
    }
    return total;
  }, 0);
};