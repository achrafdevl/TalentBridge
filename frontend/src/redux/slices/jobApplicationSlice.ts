// src/store/slices/jobApplicationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobApplicationState, JobOfferData, StepId } from '@/app/types/job';

const initialState: JobApplicationState = {
  currentStep: 'offre', // Starts at the Job Offer step
  jobOffer: {
    text: '',
    file: null,
  },
  cv: {
    file: null,
  },
};

const jobApplicationSlice = createSlice({
  name: 'jobApplication',
  initialState,
  reducers: {
    // Action to update the job offer data (text or file)
    setJobOfferData: (state, action: PayloadAction<Partial<JobOfferData>>) => {
      state.jobOffer = { ...state.jobOffer, ...action.payload };
    },
    // Action to update the CV file
    setCVFile: (state, action: PayloadAction<File | null>) => {
        state.cv.file = action.payload;
    },
    // Action to advance to the next step
    goToNextStep: (state) => {
      switch (state.currentStep) {
        case 'offre':
          state.currentStep = 'cv';
          break;
        case 'cv':
          state.currentStep = 'analyse';
          break;
        // ... add more transitions
        default:
          break;
      }
    },
    // Action to set a specific step
    setCurrentStep: (state, action: PayloadAction<StepId>) => {
        state.currentStep = action.payload;
    }
  },
});

export const { 
    setJobOfferData, 
    setCVFile,
    goToNextStep, 
    setCurrentStep 
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;