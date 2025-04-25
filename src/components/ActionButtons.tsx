import React from 'react';
import { Save, FileDown, UploadCloud, RotateCcw } from 'lucide-react';
import { TimeEntry } from '../types';
import { generatePDF } from '../utils/pdfUtils';

interface ActionButtonsProps {
  entry: TimeEntry;
  onSave: () => void;
  onReset: () => void;
  isValid: boolean;
  isSaving: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  entry,
  onSave,
  onReset,
  isValid,
  isSaving
}) => {
  const handleExportPDF = () => {
    generatePDF(entry);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid || isSaving}
          className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isValid && !isSaving
              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              : 'bg-blue-300 cursor-not-allowed'
          } transition-colors`}
        >
          <Save size={16} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          disabled={!isValid}
          className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isValid
              ? 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
              : 'bg-amber-300 cursor-not-allowed'
          } transition-colors`}
        >
          <FileDown size={16} className="mr-2" />
          Export PDF
        </button>

        <button
          type="button"
          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <UploadCloud size={16} className="mr-2" />
          Import
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <RotateCcw size={16} className="mr-2" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;