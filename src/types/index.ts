export interface TimeEntry {
  id: string;
  date: string;
  officeIn: string;
  officeOut: string;
  lunchStart: string;
  lunchEnd: string;
  breaks: Break[];
  report: string;
}

export interface Break {
  id: string;
  startTime: string;
  endTime: string;
}

export type TimeFieldType = 'officeIn' | 'officeOut' | 'lunchStart' | 'lunchEnd';