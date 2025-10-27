// "use client";

// import React, { useState } from 'react';
// // Assuming you have defined and exported these custom typed hooks in your store.ts file
// import { useAppDispatch, useAppSelector } from '@/redux/hooks'; 
// import { setJobOfferData, goToNextStep } from '@/redux/slices/jobApplicationSlice';
// import CVTailor from './components/CVTailor';
// const JobOfferStep: React.FC = () => {
//   // 1. Use typed hook to dispatch actions
//   const dispatch = useAppDispatch();
  
//   // 2. Use typed hook to access state. Type checking is now done automatically.
//   const initialText = useAppSelector((state) => state.jobApplication.jobOffer.text);
//   const [jobDescription, setJobDescription] = useState<string>(initialText);
  
//   const MAX_CHARACTERS = 5000;

//   // Explicitly type the event object as a ChangeEvent for a TextArea element
//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const text = e.target.value;
//     if (text.length <= MAX_CHARACTERS) {
//       setJobDescription(text);
//     }
//   };

//   // Note: Since 'alert' is blocked in this environment, I've replaced it with a console error 
//   // and a user-facing message, which is a better practice in Next.js anyway.
//   const handlePaste = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       const newText = jobDescription + text;
//       // Truncate to the max length if necessary
//       setJobDescription(newText.substring(0, MAX_CHARACTERS)); 
//     } catch (err) {
//       console.error('Failed to read clipboard contents: ', err);
//       // In a real app, use a custom toast/modal here instead of alert
//       // setStatusMessage('Could not read from clipboard. Please paste manually.'); 
//     }
//   };

//   const handleSubmit = () => {
//     // 1. Save data to Redux
//     dispatch(setJobOfferData({ text: jobDescription }));
//     // 2. Move to the next step
//     dispatch(goToNextStep());
//   };
  
//   // Explicitly type the event object as a DragEvent for an HTMLDivElement
//   const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation(); // Prevents browser from opening the file
    
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       // Save file to Redux and move to next step
//       dispatch(setJobOfferData({ file: file }));
//       dispatch(goToNextStep()); 
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault(); // Important for drop to work
//   };

//   return (
//     <div>
//       <div>
//         <CVTailor />
//       </div>
//       {/* Input Area */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-8">
//         <textarea
//           value={jobDescription}
//           onChange={handleTextChange}
//           placeholder="Paste the complete job description here..."
//           className="w-full h-48 resize-none focus:outline-none text-lg"
//         ></textarea>
        
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={handlePaste}
//             className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
//           >
//             Coller depuis le presse-papier
//           </button>
//           <span className="text-sm text-gray-500">
//             {jobDescription.length}/{MAX_CHARACTERS} caractères
//           </span>
//         </div>
//       </div>
      
//       <div className="text-center my-6 text-xl font-light text-gray-400">
//         OR
//       </div>

//       {/* File Upload Area - Triggering switch upon successful upload */}
//       <div 
//         className="text-center p-8 border-2 border-transparent hover:border-teal-400 rounded-lg transition duration-200 cursor-pointer"
//         onDrop={handleFileDrop}
//         onDragOver={handleDragOver}
//       >
//         <p className="text-lg text-teal-600">
//           <strong>Drag or upload Job Offer Document</strong> PDF, DOCX, or TXT (max 5 MB) 
//         </p>
//         <button 
//           onClick={handleSubmit} 
//           disabled={jobDescription.length === 0}
//           className="mt-4 bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
//         >
//           Proceed to CV Upload (Simulated)
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobOfferStep;
"use client"
import React from 'react'
import CVTailor from './components/CVTailor';

const page = () => {
  return (
    <div>
      <CVTailor />
  

    </div>
  )
}

export default page