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

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

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

      const res = await fetch(`${API_BASE}/job/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      const data = await res.json();
      if (data.job_id) onNext(data.job_id);
      else throw new Error("ID d'offre manquant");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du téléchargement"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Étape 1: Offre d&apos;emploi
        </h2>
        <p className="text-indigo-100">
          Téléchargez ou collez l&apos;offre d&apos;emploi
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du poste (optionnel)
          </label>
          <input
            type="text"
            placeholder="Ex: Développeur Full Stack"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={uploading}
          />
        </div>

        <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 bg-indigo-50 hover:bg-indigo-100 transition-colors">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📄 Télécharger un fichier
          </label>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={(e) => setJobFile(e.target.files?.[0] || null)}
            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            disabled={uploading}
          />
          {jobFile && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Fichier sélectionné:</span>{" "}
                {jobFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(jobFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Coller le texte de l&apos;offre
          </label>
          <textarea
            placeholder="Collez le texte de l'offre d'emploi ici..."
            rows={8}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            disabled={uploading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2"
          disabled={uploading || (!jobFile && !jobText)}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Téléchargement...</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Suivant</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
