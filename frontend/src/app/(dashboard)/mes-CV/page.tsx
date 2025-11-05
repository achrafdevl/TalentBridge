"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { 
  FaFileAlt, 
  FaDownload, 
  FaChartLine, 
  FaCalendar,
  FaCheckCircle,
  FaArrowLeft 
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";
import { useRouter } from "next/navigation";

type GeneratedItem = {
  generated_id: string;
  cv_id: string;
  job_id: string;
  similarity: number;
  created_at: string | null;
  download_url: string;
  cv_name: string;
  job_title: string;
};

type AnalysisResult = {
  cv_id: string;
  job_id: string;
  similarity: number;
  match_level: string;
  keyword_match_count: number;
  total_job_keywords: number;
};

export default function MyResumesPage() {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Record<string, AnalysisResult>>({});
  const [selectedAnalysis, setSelectedAnalysis] = useState<{
    data: AnalysisResult;
    item: GeneratedItem;
  } | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/generate/history`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, API_BASE]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (items.length === 0) return;
      try {
        const pairs = await Promise.all(
          items.map(async (g) => {
            try {
              const r = await fetch(
                `${API_BASE}/analysis/cv-job/${g.cv_id}/${g.job_id}`
              );
              if (!r.ok) return [g.generated_id, null] as const;
              const data = await r.json();
              return [
                g.generated_id,
                {
                  cv_id: data.cv_id,
                  job_id: data.job_id,
                  similarity: data.similarity,
                  match_level: data.match_level,
                  keyword_match_count: data.keyword_match_count,
                  total_job_keywords: data.total_job_keywords,
                },
              ] as const;
            } catch {
              return [g.generated_id, null] as const;
            }
          })
        );
        const next: Record<string, AnalysisResult> = {};
        for (const [k, v] of pairs) {
          if (v) next[k] = v;
        }
        setAnalyses(next);
      } catch {
        // ignore errors
      }
    };
    fetchAnalyses();
  }, [items, API_BASE]);

  const getMatchColor = (similarity: number) => {
    if (similarity >= 0.8) return "bg-emerald-100 text-emerald-700";
    if (similarity >= 0.65) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getMatchLabel = (similarity: number) => {
    if (similarity >= 0.8) return "Excellent";
    if (similarity >= 0.65) return "Bon";
    return "Moyen";
  };

  const avgSimilarity = items.length > 0
    ? items.reduce((acc, cv) => acc + cv.similarity, 0) / items.length
    : 0;

  const bestMatch = items.length > 0
    ? Math.max(...items.map((cv) => cv.similarity))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* En-tête avec navigation */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1C96AD] font-medium mb-6 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour au Dashboard
          </button>
          
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1C96AD] via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                Mes CV Générés
              </h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                <FaCalendar className="text-[#1C96AD]" />
                Historique complet de vos CV personnalisés
              </p>
            </div>
            <div className="text-right">
              <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                <p className="text-sm text-gray-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-[#1C96AD]">
                  {items.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-3xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  CV Créés
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {items.length}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  CV finalisés et disponibles
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner">
                <FaFileAlt className="h-10 w-10 text-[#1C96AD]" />
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-3xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Correspondance Moyenne
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {(avgSimilarity * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Sur tous vos CV générés
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-inner">
                <FaChartLine className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-3xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Meilleure Correspondance
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {(bestMatch * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Votre CV le plus adapté
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-inner">
                <FaCheckCircle className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Liste des CV */}
        <Card className="p-8 border-0 shadow-xl bg-white rounded-3xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
            <FaFileAlt className="text-[#1C96AD]" />
            Historique Complet
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 w-full rounded-2xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-[shimmer_1.5s_infinite] bg-[length:400%_100%]"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-200">
              <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 mb-6">
                <FaFileAlt className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun CV généré pour le moment
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Générez votre premier CV personnalisé depuis le tableau de bord
              </p>
              <button
                onClick={() => router.push("/dashboard/generate")}
                className="px-8 py-4 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 transform"
              >
                Générer Mon Premier CV
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((g, index) => (
                <div
                  key={g.generated_id}
                  className="group relative overflow-hidden p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-[#1C96AD] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Badge de position */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-[#1C96AD] to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                    #{index + 1}
                  </div>

                  <div className="flex items-center justify-between pl-16">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {g.cv_name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <span className="font-semibold text-[#1C96AD]">
                          Offre:
                        </span>
                        {g.job_title}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-bold ${getMatchColor(
                            g.similarity
                          )}`}
                        >
                          {getMatchLabel(g.similarity)} •{" "}
                          {(g.similarity * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <FaCalendar className="text-[#1C96AD]" />
                          {g.created_at
                            ? new Date(g.created_at).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Date inconnue"}
                        </span>
                      </div>

                      {/* Barre de progression */}
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            g.similarity >= 0.8
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                              : g.similarity >= 0.65
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                          }`}
                          style={{ width: `${g.similarity * 100}%` }}
                        ></div>
                      </div>

                      {/* Prévisualisation de l'analyse */}
                      {analyses[g.generated_id] && (
                        <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 font-medium">
                                Niveau
                              </p>
                              <p className="font-bold text-gray-900">
                                {analyses[g.generated_id].match_level}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">
                                Mots-clés
                              </p>
                              <p className="font-bold text-gray-900">
                                {analyses[g.generated_id].keyword_match_count} /{" "}
                                {analyses[g.generated_id].total_job_keywords}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-3 ml-6">
                      <button
                        onClick={() =>
                          window.open(`${API_BASE}${g.download_url}`, "_blank")
                        }
                        className="p-4 text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-300 hover:scale-110 transform"
                        aria-label="Télécharger le CV généré"
                        title="Télécharger"
                      >
                        <FaDownload className="text-xl" />
                      </button>
                      {analyses[g.generated_id] && (
                        <button
                          onClick={() =>
                            setSelectedAnalysis({
                              data: analyses[g.generated_id],
                              item: g,
                            })
                          }
                          className="p-4 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-[#178496] hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#1C96AD] hover:scale-110 transform"
                          aria-label="Voir l'analyse détaillée"
                          title="Analyser"
                        >
                          <FaChartLine className="text-xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal d'analyse détaillée */}
        {selectedAnalysis && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FaChartLine className="text-[#1C96AD]" />
                  Analyse Détaillée
                </h4>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  ×
                </button>
              </div>

              {/* Info du CV */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <h5 className="font-bold text-gray-900 mb-1">
                  {selectedAnalysis.item.cv_name}
                </h5>
                <p className="text-sm text-gray-600">
                  Offre: {selectedAnalysis.item.job_title}
                </p>
              </div>

              <div className="space-y-6">
                {/* Score principal */}
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Score de Correspondance
                  </p>
                  <p className="text-6xl font-bold bg-gradient-to-r from-[#1C96AD] to-purple-600 bg-clip-text text-transparent mb-2">
                    {(selectedAnalysis.data.similarity * 100).toFixed(0)}%
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      selectedAnalysis.data.similarity >= 0.8
                        ? "text-emerald-600"
                        : selectedAnalysis.data.similarity >= 0.65
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Niveau: {selectedAnalysis.data.match_level}
                  </p>
                </div>

                {/* Détails */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                      Mots-clés Couverts
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {selectedAnalysis.data.keyword_match_count}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      sur {selectedAnalysis.data.total_job_keywords} requis
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                      Taux de Couverture
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(
                        (selectedAnalysis.data.keyword_match_count /
                          selectedAnalysis.data.total_job_keywords) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      des compétences demandées
                    </p>
                  </div>
                </div>

                {/* Barre de progression */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">
                      Progression
                    </span>
                    <span className="text-sm font-bold text-[#1C96AD]">
                      {(selectedAnalysis.data.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1C96AD] to-purple-600 rounded-full transition-all duration-1000"
                      style={{
                        width: `${selectedAnalysis.data.similarity * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="w-full py-4 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 transform"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
