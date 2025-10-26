export type StepId = 'offre' | 'cv' | 'analyse' | 'synthese' | 'ai-generated';

export interface JobOfferData {
  text: string;
  file: File | null;
}

export interface JobApplicationState {
  currentStep: StepId;
  jobOffer: JobOfferData;
  cv: {
    file: File | null;
  };
}