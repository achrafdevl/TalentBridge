// src/components/CVStep.tsx

import React from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setCVFile, goToNextStep } from '@/redux/slices/jobApplicationSlice';

const CVStep: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // 1. Save CV file to Redux
      dispatch(setCVFile(file)); 
      
      // 2. Move to the next step: 'Analyse'
      dispatch(goToNextStep());
    }
  };

  return (
    <div className="text-center p-12 border-2 border-dashed border-teal-300 bg-teal-50 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">
        Step 2: Upload Your CV 📄
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Please upload your Curriculum Vitae (PDF or DOCX).
      </p>
      
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleCVUpload}
        className="hidden"
        id="cv-upload-input"
      />
      
      <label 
        htmlFor="cv-upload-input" 
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full cursor-pointer shadow-lg transition duration-300"
      >
        Drag or Upload CV Document
      </label>
    </div>
  );
};

export default CVStep;