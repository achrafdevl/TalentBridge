"use client";
import { useState } from "react";

interface ResultStepProps {
  generatedId: string;
  onBack: () => void;
}

export default function ResultStep({ generatedId, onBack }: ResultStepProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    
    try {
      const response = await fetch(`http://localhost:8000/generate/download/${generatedId}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_Personnalise_${generatedId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du téléchargement";
      setError(errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <h2 className="text-xl font-bold mb-2">✓ CV personnalisé généré avec succès!</h2>
        <p>Votre CV a été adapté à l&apos;offre d&apos;emploi</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-lg font-semibold transition-colors"
        >
          {downloading ? "Téléchargement..." : "📥 Télécharger le CV"}
        </button>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    </div>
  );
}
