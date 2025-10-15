"use client";

import { useState } from "react";
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye, 
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCog,
  FaPalette,
  FaLanguage
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";

interface CVTemplate {
  id: string;
  name: string;
  preview: string;
  style: "modern" | "classic" | "creative" | "minimal";
  color: string;
}

interface GeneratedCV {
  id: string;
  name: string;
  template: string;
  createdAt: string;
  status: "draft" | "completed";
  downloadUrl?: string;
}

const templates: CVTemplate[] = [
  {
    id: "1",
    name: "Moderne Professionnel",
    preview: "/api/placeholder/300/400",
    style: "modern",
    color: "#1C96AD"
  },
  {
    id: "2", 
    name: "Classique Élégant",
    preview: "/api/placeholder/300/400",
    style: "classic",
    color: "#2563EB"
  },
  {
    id: "3",
    name: "Créatif Designer",
    preview: "/api/placeholder/300/400", 
    style: "creative",
    color: "#7C3AED"
  },
  {
    id: "4",
    name: "Minimaliste Clean",
    preview: "/api/placeholder/300/400",
    style: "minimal", 
    color: "#059669"
  }
];

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

export default function CVGenerate() {
  const [activeTab, setActiveTab] = useState<"generate" | "my-resumes">("generate");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCV = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    // Simulation d'une génération de CV
    setTimeout(() => {
      setIsGenerating(false);
      setActiveTab("my-resumes");
    }, 3000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Générateur de CV</h1>
        <p className="text-gray-500 mt-2">
          Créez des CV professionnels adaptés à vos candidatures
        </p>
      </div>

      {/* Navigation par tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "generate"
                ? "bg-[#1C96AD] text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaPlus className="inline mr-2" />
            Générer un CV
          </button>
          <button
            onClick={() => setActiveTab("my-resumes")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "my-resumes"
                ? "bg-[#1C96AD] text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaFileAlt className="inline mr-2" />
            Mes CV ({myResumes.length})
          </button>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === "generate" ? (
        <GenerateCVContent
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          onGenerate={handleGenerateCV}
          isGenerating={isGenerating}
        />
      ) : (
        <MyResumesContent resumes={myResumes} />
      )}
    </div>
  );
}

function GenerateCVContent({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onGenerate,
  isGenerating
}: {
  templates: CVTemplate[];
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Étapes de génération */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-[#1C96AD] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaPalette className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-lg mb-2">1. Choisir un modèle</h3>
          <p className="text-gray-600 text-sm">Sélectionnez le design qui correspond à votre domaine</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-lg mb-2">2. Personnaliser</h3>
          <p className="text-gray-600 text-sm">Adaptez le contenu selon l'offre d'emploi</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaDownload className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-lg mb-2">3. Télécharger</h3>
          <p className="text-gray-600 text-sm">Exportez votre CV en PDF haute qualité</p>
        </Card>
      </div>

      {/* Sélection de modèle */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaPalette className="text-[#1C96AD]" />
          Choisissez votre modèle
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`cursor-pointer rounded-xl border-2 transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? "border-[#1C96AD] shadow-lg ring-2 ring-[#1C96AD]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-4">
                <div 
                  className="w-full h-48 rounded-lg mb-4 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: template.color }}
                >
                  Aperçu CV
                </div>
                <h3 className="font-semibold text-center">{template.name}</h3>
                <p className="text-sm text-gray-500 text-center capitalize">{template.style}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Options de personnalisation */}
      {selectedTemplate && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaCog className="text-[#1C96AD]" />
            Options de personnalisation
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Poste visé
                </label>
                <input
                  type="text"
                  placeholder="Ex: Développeur Full Stack Senior"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1C96AD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Entreprise cible
                </label>
                <input
                  type="text"
                  placeholder="Ex: TechCorp Inc."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1C96AD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaLanguage className="inline mr-2" />
                  Langue
                </label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1C96AD]">
                  <option>Français</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sections à inclure
                </label>
                <div className="space-y-2">
                  {[
                    "Expérience professionnelle",
                    "Formation",
                    "Compétences techniques", 
                    "Projets personnels",
                    "Langues",
                    "Centres d'intérêt"
                  ].map((section) => (
                    <label key={section} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bouton de génération */}
      {selectedTemplate && (
        <div className="text-center">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-12 py-4 bg-[#1C96AD] text-white font-bold text-lg rounded-xl hover:bg-[#178496] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                Génération en cours...
              </>
            ) : (
              <>
                <FaFileAlt className="inline mr-3" />
                Générer mon CV
              </>
            )}
          </button>
        </div>
      )}
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
            <div key={resume.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  resume.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  <FaFileAlt />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{resume.name}</h3>
                  <p className="text-sm text-gray-600">
                    Modèle: {resume.template} • Créé le {new Date(resume.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resume.status === "completed" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
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

        {resumes.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun CV créé</h3>
            <p className="text-gray-500">Commencez par générer votre premier CV professionnel</p>
          </div>
        )}
      </Card>
    </div>
  );
}