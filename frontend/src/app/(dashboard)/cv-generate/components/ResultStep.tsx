"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as api from "@/services/api";
import {
  createBarChartData,
  createPieChartData,
  barChartOptions,
  pieChartOptions,
} from "@/utils/chartConfig";

// Dynamically import charts
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});

interface Analysis {
  match_level?: string;
  matchLevel?: string;
  similarity?: number;
  similarity_score?: number;
  cv_keywords?: string[];
  job_keywords?: string[];
  common_keywords?: string[];
  keyword_coverage?: number;
}

interface ResultStepProps {
  generatedId: string;
  cvId?: string;
  jobId?: string;
  onBack: () => void;
}

export default function ResultStep({
  generatedId,
  cvId,
  jobId,
  onBack,
}: ResultStepProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [similarityPercent, setSimilarityPercent] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Load analysis from backend
  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        if (cvId && jobId) {
          const res = await api.getAnalysis(cvId, jobId);
          setAnalysis(res);

          const sim = res.similarity ?? res.similarity_score ?? 0;
          setSimilarityPercent(Math.round(sim * 100));
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [cvId, jobId]);

  const handleDownload = async () => {
    if (!generatedId || generatedId === "undefined") {
      setError("Erreur: ID de CV généré invalide");
      return;
    }

    setDownloading(true);
    setError("");
    try {
      const blob = await api.downloadGenerated(generatedId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_Personnalise_${generatedId}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du téléchargement"
      );
    } finally {
      setDownloading(false);
    }
  };

  const similarity = analysis?.similarity ?? analysis?.similarity_score ?? 0;
  const keywordCoverage = analysis?.keyword_coverage ?? 0;
  const commonKeywords = analysis?.common_keywords ?? [];
  const cvKeywords = analysis?.cv_keywords ?? [];
  const jobKeywords = analysis?.job_keywords ?? [];

  const cvSet = new Set(cvKeywords.map((k) => k.toLowerCase()));
  const jobSet = new Set(jobKeywords.map((k) => k.toLowerCase()));
  const cvOnly = cvKeywords.filter((k) => !jobSet.has(k.toLowerCase()));
  const jobOnly = jobKeywords.filter((k) => !cvSet.has(k.toLowerCase()));

  const barData = createBarChartData(similarity, keywordCoverage);
  const pieData = createPieChartData(
    commonKeywords.length,
    cvOnly.length,
    jobOnly.length
  );

  const getMatchLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-center space-x-3">
          <div className="text-5xl">✓</div>
          <div>
            <h2 className="text-2xl font-bold mb-1">CV généré avec succès !</h2>
            <p className="text-green-50">
              Votre CV a été adapté à l&apos;offre sélectionnée.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l&apos;analyse...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
              <p className="text-sm text-gray-600 font-medium">
                Score de Similarité
              </p>
              <p className="text-4xl font-bold mt-2 text-indigo-600">
                {similarityPercent ?? 0}%
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 font-medium">
                Mots-clés Communs
              </p>
              <p className="text-4xl font-bold mt-2 text-green-600">
                {commonKeywords.length}
              </p>
            </div>
            <div
              className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                getMatchLevelColor(analysis.match_level).split(" ")[2]
              }`}
            >
              <p className="text-sm text-gray-600 font-medium">Niveau</p>
              <p
                className={`text-2xl font-bold mt-2 ${
                  getMatchLevelColor(analysis.match_level).split(" ")[1]
                }`}
              >
                {analysis.match_level ?? analysis.matchLevel ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Métriques de Correspondance
              </h3>
              <div className="h-64">
                <Bar data={barData} options={barChartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Distribution des Mots-clés
              </h3>
              <div className="h-64">
                <Pie data={pieData} options={pieChartOptions} />
              </div>
            </div>
          </div>

          {/* Keywords Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Résumé des Mots-clés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-600 text-sm">
                  CV ({cvKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {cvKeywords.slice(0, 10).map((k, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs ${
                        commonKeywords.includes(k)
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600 text-sm">
                  Offre ({jobKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {jobKeywords.slice(0, 10).map((k, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs ${
                        commonKeywords.includes(k)
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600 text-sm">
                  Communs ({commonKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {commonKeywords.slice(0, 10).map((k, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs bg-green-100 text-green-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p className="font-semibold">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading || !generatedId || generatedId === "undefined"}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
        >
          {downloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Téléchargement...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Télécharger le CV</span>
            </>
          )}
        </button>
        <button
          onClick={onBack}
          className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}
