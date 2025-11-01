"use client";
import { useEffect, useState } from "react";
import * as api from "@/services/api";

interface LoadingStepProps {
  cvId: string;
  jobId: string;
  onNext: (generatedId: string) => void;
  onBack: () => void;
}

export default function LoadingStep({
  cvId,
  jobId,
  onNext,
  onBack,
}: LoadingStepProps) {
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const runProcess = async () => {
      try {
        interval = setInterval(
          () => setProgress((p) => Math.min(p + 6, 90)),
          600
        );

        const sim = await api.getSimilarityScore(cvId, jobId);
        // similarity service returns float 0..1 or similarity_score
        const s = Math.round(
          (sim.similarity_score ?? sim.similarity ?? 0) * 100
        );
        setScore(s);

        if (s >= 60) {
          // request generation (backend requires 60% minimum)
          const gen = await api.generateCV(cvId, jobId);
          setProgress(100);
          clearInterval(interval);

          // Check if generation was successful and generated_id exists
          if (gen.status === "skipped") {
            const similarityPercent = Math.round((gen.similarity ?? 0) * 100);
            throw new Error(
              `Score trop faible (${similarityPercent}%). Minimum requis: 60% pour générer un CV`
            );
          }

          if (!gen.generated_id) {
            throw new Error("Erreur: ID de CV généré manquant");
          }

          setTimeout(() => onNext(gen.generated_id), 600);
        } else {
          throw new Error(
            `Score trop faible (${s}%). Minimum requis: 60% pour générer un CV`
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de génération");
        clearInterval(interval);
      }
    };

    runProcess();
    return () => clearInterval(interval);
  }, [cvId, jobId, onNext]);

  return (
    <div className="text-center space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Analyse et génération en cours...
        </h2>
        <p className="text-indigo-100">
          Veuillez patienter pendant le traitement
        </p>
      </div>

      {score !== null && (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-600 font-medium mb-2">
            Score de Correspondance
          </p>
          <p className="text-4xl font-bold">
            <span
              className={
                score >= 70
                  ? "text-green-600"
                  : score >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {score}%
            </span>
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-white text-xs font-semibold">
                  {progress}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <p className="font-semibold mb-1">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-all font-semibold"
          >
            Retour
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-indigo-600 text-2xl">⚙️</div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            {progress < 30
              ? "Extraction des mots-clés..."
              : progress < 60
              ? "Calcul de la similarité..."
              : "Génération du CV..."}
          </p>
        </div>
      )}
    </div>
  );
}
