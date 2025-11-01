"use client";

import React, { useEffect, useState } from "react";
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

interface AnalysisProps {
  cvId: string;
  jobId: string;
}

interface Analysis {
  match_level?: string;
  similarity?: number;
  similarity_score?: number;
  cv_keywords?: string[];
  job_keywords?: string[];
  common_keywords?: string[];
  keyword_coverage?: number;
  keyword_match_count?: number;
  total_job_keywords?: number;
}

const AnalysisSection: React.FC<AnalysisProps> = ({ cvId, jobId }) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        const res = await api.getAnalysis(cvId, jobId);
        setAnalysis(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [cvId, jobId]);

  if (loading) {
    return (
      <div className="mt-6 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Chargement de l&apos;analyse...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-center">
          Erreur lors du chargement de l&apos;analyse
        </p>
      </div>
    );
  }

  const similarity = analysis.similarity ?? analysis.similarity_score ?? 0;
  const similarityPercent = Math.round(similarity * 100);
  const keywordCoverage = analysis.keyword_coverage ?? 0;
  const commonKeywords = analysis.common_keywords ?? [];
  const cvKeywords = analysis.cv_keywords ?? [];
  const jobKeywords = analysis.job_keywords ?? [];

  // Calculate CV-only and job-only keywords
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
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getSimilarityColor = (percent: number) => {
    if (percent >= 70) return "text-green-600";
    if (percent >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">
          Analyse détaillée CV ↔ Offre
        </h3>
        <p className="text-indigo-100">
          Correspondance entre votre CV et l&apos;offre d&apos;emploi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Score de Similarité
              </p>
              <p
                className={`text-3xl font-bold mt-1 ${getSimilarityColor(
                  similarityPercent
                )}`}
              >
                {similarityPercent}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Mots-clés Communs
              </p>
              <p className="text-3xl font-bold mt-1 text-green-600">
                {commonKeywords.length}
              </p>
            </div>
            <div className="text-4xl">🔑</div>
          </div>
        </div>

        <div
          className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
            getMatchLevelColor(analysis.match_level).split(" ")[2]
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Niveau de Correspondance
              </p>
              <p
                className={`text-xl font-bold mt-1 ${
                  getMatchLevelColor(analysis.match_level).split(" ")[0]
                }`}
              >
                {analysis.match_level ?? "N/A"}
              </p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📈</span>
            Métriques de Correspondance
          </h4>
          <div className="h-64">
            <Bar data={barData} options={barChartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🥧</span>
            Distribution des Mots-clés
          </h4>
          <div className="h-64">
            <Pie data={pieData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          Analyse des Mots-clés
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CV Keywords */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-indigo-600">Mots-clés CV</h5>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {cvKeywords.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {cvKeywords.length > 0 ? (
                cvKeywords.map((k, idx) => {
                  const isCommon = commonKeywords.includes(k);
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCommon
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {k}
                    </span>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Aucun mot-clé détecté</p>
              )}
            </div>
          </div>

          {/* Job Keywords */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-purple-600">Mots-clés Offre</h5>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {jobKeywords.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {jobKeywords.length > 0 ? (
                jobKeywords.map((k, idx) => {
                  const isCommon = commonKeywords.includes(k);
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCommon
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {k}
                    </span>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Aucun mot-clé détecté</p>
              )}
            </div>
          </div>

          {/* Common Keywords */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-green-600">
                Mots-clés Communs
              </h5>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {commonKeywords.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {commonKeywords.length > 0 ? (
                commonKeywords.map((k, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300"
                  >
                    {k}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun mot-clé commun</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Résumé de l&apos;analyse
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            • Votre CV présente une correspondance de{" "}
            <strong>{similarityPercent}%</strong> avec l&apos;offre
          </p>
          <p>
            • <strong>{commonKeywords.length}</strong> mot
            {commonKeywords.length > 1 ? "s" : ""}-clé
            {commonKeywords.length > 1 ? "s" : ""} commun
            {commonKeywords.length > 1 ? "s" : ""} détecté
            {commonKeywords.length > 1 ? "s" : ""}
          </p>
          <p>
            • Couverture des mots-clés de l&apos;offre:{" "}
            <strong>{Math.round(keywordCoverage * 100)}%</strong>
          </p>
          <p className="pt-2 text-xs text-gray-500">
            💡 Conseil: Ajoutez plus de mots-clés de l&apos;offre à votre CV
            pour améliorer votre correspondance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSection;
