"use client";

import { FaFileAlt, FaDownload, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";

interface GeneratedCV {
  id: string;
  name: string;
  template: string;
  createdAt: string;
  status: "draft" | "completed";
  downloadUrl?: string;
}

const myResumes: GeneratedCV[] = [
  {
    id: "1",
    name: "CV Développeur Senior - TechCorp",
    template: "Moderne Professionnel",
    createdAt: "2024-01-15",
    status: "completed",
    downloadUrl: "#"
  },
  {
    id: "2",
    name: "CV Consultant IT - Freelance", 
    template: "Classique Élégant",
    createdAt: "2024-01-10",
    status: "draft"
  },
  {
    id: "3",
    name: "CV Lead Developer - Startup",
    template: "Créatif Designer", 
    createdAt: "2024-01-05",
    status: "completed",
    downloadUrl: "#"
  }
];

export default function MyResumesPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Titre */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Mes CV</h1>
        <p className="text-gray-500 mt-2">
          Historique des CV créés et générés
        </p>
      </div>

      <MyResumesContent resumes={myResumes} />
    </div>
  );
}

function MyResumesContent({ resumes }: { resumes: GeneratedCV[] }) {
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-3xl font-bold text-[#1C96AD]">{resumes.length}</div>
          <div className="text-gray-600">CV créés</div>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-3xl font-bold text-emerald-600">
            {resumes.filter(r => r.status === "completed").length}
          </div>
          <div className="text-gray-600">CV finalisés</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="text-3xl font-bold text-amber-600">
            {resumes.filter(r => r.status === "draft").length}
          </div>
          <div className="text-gray-600">Brouillons</div>
        </Card>
      </div>

      {/* Liste des CV */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaFileAlt className="text-[#1C96AD]" />
          Mes CV générés
        </h2>

        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    resume.status === "completed"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <FaFileAlt />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{resume.name}</h3>
                  <p className="text-sm text-gray-600">
                    Modèle: {resume.template} • Créé le{" "}
                    {new Date(resume.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resume.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {resume.status === "completed" ? "Finalisé" : "Brouillon"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-[#1C96AD] hover:bg-blue-50 rounded-lg transition-all">
                  <FaEye />
                </button>
                <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                  <FaEdit />
                </button>
                {resume.downloadUrl && (
                  <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                    <FaDownload />
                  </button>
                )}
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
