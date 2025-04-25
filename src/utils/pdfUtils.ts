import { TimeEntry } from '../types';
import { calculateDuration, formatDuration, calculateTotalBreakTime } from './timeUtils';

/**
 * Generates and downloads a PDF report for a time entry
 */
export const generatePDF = (entry: TimeEntry): void => {
  const { date, officeIn, officeOut, lunchStart, lunchEnd, breaks, report } = entry;
  
  // Calculate durations
  const totalOfficeTime = calculateDuration(officeIn, officeOut);
  const lunchDuration = calculateDuration(lunchStart, lunchEnd);
  const totalBreakTime = calculateTotalBreakTime(breaks);
  const totalDeskTime = totalOfficeTime - lunchDuration - totalBreakTime;
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Create HTML content for PDF
  const htmlContent = `
    <html>
      <head>
        <title>Daily Work Report - ${date}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; }
          h1 { color: #3B82F6; margin-bottom: 20px; }
          h2 { color: #1F2937; margin-top: 20px; }
          .report-container { margin-bottom: 20px; }
          .time-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .time-item { margin-bottom: 10px; }
          .time-label { font-weight: bold; color: #4B5563; }
          .time-value { color: #1F2937; }
          .break-item { margin-left: 20px; margin-bottom: 5px; }
          .summary { background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin-top: 20px; }
          .report-content { white-space: pre-wrap; line-height: 1.5; }
        </style>
      </head>
      <body>
        <h1>Daily Work Report</h1>
        <div class="report-container">
          <div class="time-item">
            <span class="time-label">Date:</span>
            <span class="time-value">${formattedDate}</span>
          </div>
          
          <h2>Time Entries</h2>
          <div class="time-grid">
            <div class="time-item">
              <span class="time-label">Office In:</span>
              <span class="time-value">${officeIn}</span>
            </div>
            <div class="time-item">
              <span class="time-label">Office Out:</span>
              <span class="time-value">${officeOut}</span>
            </div>
            <div class="time-item">
              <span class="time-label">Lunch Start:</span>
              <span class="time-value">${lunchStart}</span>
            </div>
            <div class="time-item">
              <span class="time-label">Lunch End:</span>
              <span class="time-value">${lunchEnd}</span>
            </div>
            <div class="time-item">
              <span class="time-label">Lunch Duration:</span>
              <span class="time-value">${formatDuration(lunchDuration)}</span>
            </div>
          </div>
          
          <h2>Breaks</h2>
          ${breaks.map((breakItem, index) => `
            <div class="break-item">
              <span class="time-label">Break ${index + 1}:</span>
              <span class="time-value">${breakItem.startTime} - ${breakItem.endTime} (${formatDuration(calculateDuration(breakItem.startTime, breakItem.endTime))})</span>
            </div>
          `).join('')}
          
          <div class="summary">
            <div class="time-item">
              <span class="time-label">Total Office Hours:</span>
              <span class="time-value">${formatDuration(totalOfficeTime)}</span>
            </div>
            <div class="time-item">
              <span class="time-label">Total Break Time:</span>
              <span class="time-value">${formatDuration(lunchDuration + totalBreakTime)}</span>
            </div>
            <div class="time-item">
              <span class="time-label">Total Desk Time:</span>
              <span class="time-value">${formatDuration(totalDeskTime)}</span>
            </div>
          </div>
        </div>
        
        <h2>Daily Report</h2>
        <div class="report-content">${report.replace(/\n/g, '<br>')}</div>
      </body>
    </html>
  `;
  
  // Create a blob from the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open the blob in a new window for printing
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(url);
    };
  } else {
    alert('Please allow popups to generate the PDF report');
  }
};