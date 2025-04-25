import React from 'react';

interface ReportEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ReportEditor: React.FC<ReportEditorProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4">
        <h2 className="text-xl font-bold text-white">Daily Work Report</h2>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-4">
            Document your daily activities, accomplishments, and pending tasks.
          </p>
          
          <div className="relative">
            <textarea
              value={value}
              onChange={handleChange}
              rows={10}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Good Evening Sir,

I've completed the following tasks today:
- Developed the CRUD API following MVC architecture
- Created database models and controllers
- Implemented data validation

Pending:
- Integrate file upload functionality
- Add sorting and pagination features"
            />
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500">
          <div>{value.length} characters</div>
          <div>{value.split(/\s+/).filter(Boolean).length} words</div>
        </div>
      </div>
    </div>
  );
};

export default ReportEditor;