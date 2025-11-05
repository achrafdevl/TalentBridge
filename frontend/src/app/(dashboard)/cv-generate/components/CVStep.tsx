"use client";
import { useState } from "react";
import * as api from "@/services/api";

interface CVStepProps {
  onNext: (cvId: string) => void;
  onBack: () => void;
}

type CVSource = "file" | "profile" | null;

export default function CVStep({ onNext, onBack }: CVStepProps) {
  const [cvSource, setCvSource] = useState<CVSource>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleNext = async () => {
    if (!cvSource) {
      setError("Veuillez choisir une source pour votre CV");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let cvId: string;

      if (cvSource === "file") {
        if (!cvFile) {
          setError("Veuillez sélectionner un fichier CV");
          setUploading(false);
          return;
        }

        try {
          const data = await api.uploadCV(cvFile);
          if (!data.cv_id) throw new Error("ID de CV manquant");
          cvId = data.cv_id;
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Erreur lors du téléchargement";
          // Normalize common 401 message for the UI
          if (msg.includes("401") || msg.toLowerCase().includes("auth")) {
            throw new Error(
              "Authentification requise. Veuillez vous connecter puis réessayer."
            );
          }
          throw new Error(msg);
        }
      } else {
        // Use profile
        const data = await api.createCVFromProfile();
        if (!data.cv_id) throw new Error("ID de CV manquant");
        cvId = data.cv_id;
      }

      onNext(cvId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du traitement du CV"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Étape 2: Sélectionner votre CV
        </h2>
        <p className="text-indigo-100">
          Choisissez entre télécharger un fichier CV ou utiliser votre profil
          professionnel
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setCvSource("file");
              setCvFile(null);
            }}
            className={`p-6 rounded-xl border-2 transition-all ${
              cvSource === "file"
                ? "border-indigo-600 bg-indigo-50 shadow-lg"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
            disabled={uploading}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="font-semibold text-lg mb-2">
                Télécharger un fichier
              </h3>
              <p className="text-sm text-gray-600">PDF ou DOCX</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setCvSource("profile");
              setCvFile(null);
            }}
            className={`p-6 rounded-xl border-2 transition-all ${
              cvSource === "profile"
                ? "border-indigo-600 bg-indigo-50 shadow-lg"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
            disabled={uploading}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-semibold text-lg mb-2">
                Utiliser mon profil
              </h3>
              <p className="text-sm text-gray-600">
                Données de votre profil professionnel
              </p>
            </div>
          </button>
        </div>

        {/* File Upload Section */}
        {cvSource === "file" && (
          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 bg-indigo-50 hover:bg-indigo-100 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              📄 Sélectionnez votre fichier CV
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              disabled={uploading}
            />
            {cvFile && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {cvFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(cvFile.size / 1024).toFixed(2)} KB •{" "}
                      {cvFile.type || "Type inconnu"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Selection Info */}
        {cvSource === "profile" && (
          <div className="border-2 border-indigo-200 rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-3xl">👤</div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  CV depuis votre profil
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Votre profil professionnel sera converti en CV pour la
                  génération personnalisée
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">ℹ️</span> Les informations de
                votre profil (expériences, compétences, projets, etc.) seront
                utilisées pour créer un CV adapté à l&apos;offre d&apos;emploi.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold"
            disabled={uploading}
          >
            ← Retour
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2"
            disabled={
              uploading || !cvSource || (cvSource === "file" && !cvFile)
            }
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Traitement...</span>
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
    </div>
  );
}
