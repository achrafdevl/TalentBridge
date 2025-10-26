// src/components/JobOfferStep.tsx

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setJobOfferData, goToNextStep } from '@/redux/slices/jobApplicationSlice';

const JobOfferStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const initialText = useAppSelector((state) => state.jobApplication.jobOffer.text);
  const [jobDescription, setJobDescription] = useState<string>(initialText);
  
  const MAX_CHARACTERS = 5000;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setJobDescription(text);
    }
  };

  const handlePaste = async () => {
    // Simulating "Coller depuis le presse-papier" (Paste from clipboard)
    try {
      const text = await navigator.clipboard.readText();
      const newText = jobDescription + text;
      setJobDescription(newText.substring(0, MAX_CHARACTERS)); // Truncate if over limit
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert("Could not read from clipboard. Please paste manually.");
    }
  };

  // 💥 Function to transition to the CV step 💥
  const handleSubmit = (source: 'text' | 'file') => {
    // 1. Save the job description text if it was used
    if (source === 'text') {
        dispatch(setJobOfferData({ text: jobDescription }));
    }
    // 2. Move to the next step ('cv')
    dispatch(goToNextStep());
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent default browser handling
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // 1. Save file to Redux
      dispatch(setJobOfferData({ file: file, text: '' })); // Clear text if file is used
      // 2. Move to the next step
      handleSubmit('file');
    }
  };

  return (
    <div>
      {/* Input Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-8">
        <textarea
          value={jobDescription}
          onChange={handleTextChange}
          placeholder="Paste the complete job description here..."
          className="w-full h-48 resize-none focus:outline-none text-lg"
        ></textarea>
        
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePaste}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Coller depuis le presse-papier
          </button>
          <span className="text-sm text-gray-500">
            {jobDescription.length}/{MAX_CHARACTERS} caractères
          </span>
        </div>
      </div>
      
      <div className="text-center my-6 text-xl font-light text-gray-400">
        OR
      </div>

      {/* File Upload Area */}
      <div 
        className="text-center p-8 border-2 border-transparent hover:border-teal-400 rounded-lg transition duration-200 cursor-pointer"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()} // Allow drop
        onClick={() => { /* Simulate file input click */ }}
      >
        <p className="text-lg text-teal-600">
          <strong>Drag or upload Job Offer Document</strong> PDF, DOCX, or TXT (max 5 MB) 
        </p>
        <button 
          onClick={() => handleSubmit('text')} 
          disabled={jobDescription.length === 0}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Proceed to CV Upload
        </button>
      </div>
    </div>
  );
};

export default JobOfferStep;