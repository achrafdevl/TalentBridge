"use client";
import { useEffect, useState } from "react";

interface LoadingStepProps {
  cvId: string;
  jobId: string;
  onNext: (generatedId: string) => void;
  onBack: () => void;
}

export default function LoadingStep({ cvId, jobId, onNext, onBack }: LoadingStepProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const generateCV = async () => {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 1000);

        const formData = new FormData();
        formData.append("cv_id", cvId);
        formData.append("job_id", jobId);

        const res = await fetch("http://localhost:8000/generate/", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const data = await res.json();
        
        if (data.generated_id) {
          setProgress(100);
          setTimeout(() => {
            setLoading(false);
            onNext(data.generated_id);
          }, 500);
        } else {
          throw new Error("ID de génération manquant");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de génération");
        setLoading(false);
      }
    };

    generateCV();
  }, [cvId, jobId, onNext]);

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <h2 className="text-xl font-bold">Génération de votre CV personnalisé...</h2>
      
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-gray-600">
        {loading ? "L'IA analyse et personnalise votre CV..." : "Terminé!"}
      </p>
      
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}
