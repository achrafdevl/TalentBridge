"use client";
import { useState } from "react";
import JobStep from "./JobStep";
import CVStep from "./CVStep";
import LoadingStep from "./LoadingStep";
import ResultStep from "./ResultStep";

export default function CVTailor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobId, setJobId] = useState<string>("");
  const [cvId, setCvId] = useState<string>("");
  const [generatedId, setGeneratedId] = useState<string>("");

  const steps = [
    { id: 1, title: "Offre d'emploi" },
    { id: 2, title: "Télécharger CV" },
    { id: 3, title: "Génération" },
    { id: 4, title: "Résultat" },
  ];

  const handleJobNext = (id: string) => {
    setJobId(id);
    setCurrentStep(2);
  };

  const handleCVNext = (id: string) => {
    setCvId(id);
    setCurrentStep(3);
  };

  const handleGenerationNext = (id: string) => {
    setGeneratedId(id);
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setJobId("");
    setCvId("");
    setGeneratedId("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Générateur de CV Personnalisé
      </h1>

      {/* Progress Bar */}
      <div className="flex justify-between mb-10 relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            {index !== 0 && (
              <div
                className="absolute h-1 top-4 left-0 right-0 z-0"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  background: "#4f46e5",
                  transition: "width 0.3s ease",
                }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center text-center w-full">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep >= step.id
                    ? "bg-indigo-600 text-white scale-110"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <span className={`text-sm mt-2 ${currentStep >= step.id ? "text-indigo-600 font-semibold" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Step Components */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {currentStep === 1 && <JobStep onNext={handleJobNext} />}
        {currentStep === 2 && <CVStep onNext={handleCVNext} onBack={handleBack} />}
        {currentStep === 3 && (
          <LoadingStep
            cvId={cvId}
            jobId={jobId}
            onNext={handleGenerationNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && <ResultStep generatedId={generatedId} onBack={handleRestart} />}
      </div>
    </div>
  );
}
