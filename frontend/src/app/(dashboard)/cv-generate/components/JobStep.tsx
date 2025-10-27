"use client";
import { useState } from "react";

interface JobStepProps {
  onNext: (jobId: string) => void;
}

export default function JobStep({ onNext }: JobStepProps) {
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleNext = async () => {
    if (!jobFile && !jobText) {
      setError("Veuillez fournir un fichier ou du texte");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      
      if (jobTitle) formData.append("title", jobTitle);
      if (jobFile) formData.append("file", jobFile);
      if (jobText) formData.append("text", jobText);

      const res = await fetch("http://localhost:8000/job/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.job_id) {
        onNext(data.job_id);
      } else {
        throw new Error("ID d'offre manquant dans la réponse");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du téléchargement");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Étape 1: Offre d&apos;emploi</h2>
      
      <input
        type="text"
        placeholder="Titre du poste (optionnel)"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full border p-2 rounded"
        disabled={uploading}
      />

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => {
            setJobFile(e.target.files?.[0] || null);
            setError("");
          }}
          className="w-full mb-2"
          disabled={uploading}
        />
        
        {jobFile && (
          <p className="text-sm text-gray-600">
            Fichier: {jobFile.name}
          </p>
        )}
      </div>

      <div className="text-center my-4 text-gray-500">OU</div>

      <textarea
        placeholder="Collez le texte de l'offre d'emploi ici..."
        rows={8}
        value={jobText}
        onChange={(e) => {
          setJobText(e.target.value);
          setError("");
        }}
        className="w-full border p-2 rounded"
        disabled={uploading}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={uploading || (!jobFile && !jobText)}
      >
        {uploading ? "Téléchargement..." : "Suivant"}
      </button>
    </div>
  );
}
