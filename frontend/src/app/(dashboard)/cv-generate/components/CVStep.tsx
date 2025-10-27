"use client";
import { useState } from "react";

interface CVStepProps {
  onNext: (cvId: string) => void;
  onBack: () => void;
}

export default function CVStep({ onNext, onBack }: CVStepProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleNext = async () => {
    if (!cvFile) {
      setError("Veuillez sélectionner un fichier CV");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", cvFile);

      const res = await fetch("http://localhost:8000/cv/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.cv_id) {
        onNext(data.cv_id);
      } else {
        throw new Error("ID de CV manquant dans la réponse");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du téléchargement");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Étape 2: Téléchargez votre CV</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => {
            setCvFile(e.target.files?.[0] || null);
            setError("");
          }}
          className="w-full"
          disabled={uploading}
        />
        
        {cvFile && (
          <p className="mt-2 text-sm text-gray-600">
            Fichier sélectionné: {cvFile.name}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          disabled={uploading}
        >
          Retour
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={uploading || !cvFile}
        >
          {uploading ? "Téléchargement..." : "Suivant"}
        </button>
      </div>
    </div>
  );
}
