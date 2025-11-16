"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../redux/hooks";
import { Card } from "@/app/components/ui/Card";
import {
  FaFileAlt,
  FaChartLine,
  FaRocket,
  FaEye,
  FaDownload,
  FaCalendar,
  FaBell,
  FaArrowUp,
  FaCheckCircle,
  FaHistory,
  FaPlus,
} from "react-icons/fa";

const stats = [
  {
    title: "CV Générés",
    value: "0",
    icon: FaFileAlt,
    trend: "+100%",
    trendUp: true,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    description: "Ce mois-ci",
  },
  {
    title: "Taux de Correspondance Moyen",
    value: "0%",
    icon: FaChartLine,
    trend: "0%",
    trendUp: true,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "from-emerald-50 to-emerald-100",
    description: "Sur tous vos CV",
  },
  {
    title: "Meilleure Correspondance",
    value: "0%",
    icon: FaCheckCircle,
    trend: "+0%",
    trendUp: true,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    description: "CV le plus adapté",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [generatedList, setGeneratedList] = useState<
    Array<{
      generated_id: string;
      cv_id: string;
      job_id: string;
      similarity: number;
      created_at: string | null;
      download_url: string;
      cv_name: string;
      job_title: string;
    }>
  >([]);
  const [analysis, setAnalysis] = useState<null | {
    cv_id: string;
    job_id: string;
    similarity: number;
    match_level: string;
    keyword_match_count: number;
    total_job_keywords: number;
  }>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/generate/history`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const data = await res.json();
          setGeneratedList(data.items || []);
        }
      } catch {
        // ignore silently for dashboard
      }
    };
    if (token) loadHistory();
  }, [token, API_BASE]);

  // Mettre à jour les statistiques dynamiquement
  useEffect(() => {
    if (generatedList.length > 0) {
      const avgSimilarity =
        generatedList.reduce((acc, cv) => acc + cv.similarity, 0) /
        generatedList.length;
      const bestMatch = Math.max(...generatedList.map((cv) => cv.similarity));

      stats[0].value = generatedList.length.toString();
      stats[1].value = `${(avgSimilarity * 100).toFixed(0)}%`;
      stats[2].value = `${(bestMatch * 100).toFixed(0)}%`;
    }
  }, [generatedList]);

  const runAnalysis = async (cvId: string, jobId: string) => {
    try {
      const res = await fetch(`${API_BASE}/analysis/cv-job/${cvId}/${jobId}`);
      if (!res.ok) return;
      const data = await res.json();
      setAnalysis({
        cv_id: data.cv_id,
        job_id: data.job_id,
        similarity: data.similarity,
        match_level: data.match_level,
        keyword_match_count: data.keyword_match_count,
        total_job_keywords: data.total_job_keywords,
      });
    } catch {
      // no-op
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 17) return "Bon après-midi";
    return "Bonsoir";
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1C96AD] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* En-tête personnalisé */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1C96AD] via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                {getGreeting()},{" "}
                {user?.full_name ||
                  user?.email?.split("@")[0] ||
                  "Utilisateur"}{" "}
                !
              </h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <FaCalendar className="text-[#1C96AD]" />
                {currentTime.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#1C96AD]"
                aria-label="Notifications"
              >
                <FaBell className="text-[#1C96AD] text-xl" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {generatedList.length}
                </span>
              </button>
              <div className="w-16 h-16 bg-gradient-to-r from-[#1C96AD] via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                {(user?.full_name || user?.email || "U")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-3xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center text-sm font-bold ${
                          stat.trendUp ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {stat.trendUp && <FaArrowUp className="mr-1" />}
                        {stat.trend}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-5 rounded-2xl bg-gradient-to-br ${stat.bgColor} shadow-inner`}
                  >
                    <StatIcon
                      className={`h-10 w-10 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions rapides */}
        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-[#1C96AD] to-blue-600 rounded-3xl text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold flex items-center gap-3">
              <FaRocket className="text-white" />
              Actions Rapides
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => router.push("/cv-generate")}
              className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all font-semibold flex items-center justify-center gap-3 border-2 border-white/30 hover:border-white/50 hover:scale-105 transform duration-200"
            >
              <FaPlus className="text-2xl" />
              <span className="text-lg">Générer un Nouveau CV</span>
            </button>
            <button
              onClick={() => router.push("/mes-CV")}
              className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all font-semibold flex items-center justify-center gap-3 border-2 border-white/30 hover:border-white/50 hover:scale-105 transform duration-200"
            >
              <FaHistory className="text-2xl" />
              <span className="text-lg">Voir l&apos;Historique Complet</span>
            </button>
          </div>
        </Card>

        {/* Mes CV générés (historique) */}
        <Card className="p-8 shadow-xl border-0 bg-white rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaFileAlt className="text-[#1C96AD]" />
              Mes CV Générés Récemment
            </h3>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-[#1C96AD] rounded-full text-sm font-bold">
                {generatedList.length} CV au total
              </span>
              {generatedList.length > 0 && (
                <button
                  onClick={() => router.push("/dashboard/history")}
                  className="text-[#1C96AD] hover:underline font-semibold text-sm"
                >
                  Voir tout →
                </button>
              )}
            </div>
          </div>

          {generatedList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-6xl text-gray-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-700 mb-3">
                Aucun CV généré pour le moment
              </h4>
              <p className="text-gray-500 mb-8 text-lg">
                Commencez par générer votre premier CV personnalisé
              </p>
              <button
                onClick={() => router.push("/dashboard/generate")}
                className="px-8 py-4 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 transform inline-flex items-center gap-3"
              >
                <FaPlus />
                Générer Mon Premier CV
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedList.slice(0, 5).map((g, index) => (
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
                      <h4 className="font-bold text-xl text-gray-900 mb-2">
                        {g.cv_name}
                      </h4>
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
                        <span className="text-xs text-gray-500 font-medium">
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
                            : ""}
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
                    </div>

                    <div className="flex items-center gap-3 ml-6">
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
                      <button
                        onClick={() => runAnalysis(g.cv_id, g.job_id)}
                        className="p-4 text-white bg-gradient-to-r from-[#1C96AD] to-blue-600 hover:from-[#178496] hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#1C96AD] hover:scale-110 transform"
                        aria-label="Voir l'analyse détaillée"
                        title="Analyser"
                      >
                        <FaEye className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal d'analyse */}
          {analysis && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FaChartLine className="text-[#1C96AD]" />
                    Analyse Détaillée de Similarité
                  </h4>
                  <button
                    onClick={() => setAnalysis(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Score principal */}
                  <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Score de Correspondance
                    </p>
                    <p className="text-6xl font-bold bg-gradient-to-r from-[#1C96AD] to-purple-600 bg-clip-text text-transparent mb-2">
                      {(analysis.similarity * 100).toFixed(0)}%
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        analysis.similarity >= 0.8
                          ? "text-emerald-600"
                          : analysis.similarity >= 0.65
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      Niveau: {analysis.match_level}
                    </p>
                  </div>

                  {/* Détails */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Mots-clés Couverts
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {analysis.keyword_match_count}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        sur {analysis.total_job_keywords} requis
                      </p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Taux de Couverture
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {(
                          (analysis.keyword_match_count /
                            analysis.total_job_keywords) *
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
                        {(analysis.similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1C96AD] to-purple-600 rounded-full transition-all duration-1000"
                        style={{ width: `${analysis.similarity * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setAnalysis(null)}
                    className="w-full py-4 bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105 transform"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
