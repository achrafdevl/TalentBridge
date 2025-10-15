"use client";

import { useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaSearch,
  FaFilter,
  FaHeart,
  FaRegHeart,
  FaBuilding,
  FaCalendar,
  FaUsers,
  FaArrowRight,
  FaBookmark,
} from "react-icons/fa";
import { Card } from "@/app/components/ui/Card";

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: "CDI" | "CDD" | "Stage" | "Freelance";
  workMode: "Présentiel" | "Remote" | "Hybride";
  publishedAt: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isFavorite: boolean;
  isApplied: boolean;
  applicants: number;
  logo?: string;
}

const mockJobs: JobOffer[] = [
  {
    id: "1",
    title: "Développeur Full Stack Senior",
    company: "TechCorp Solutions",
    location: "Paris, France",
    salary: "55k - 75k €",
    type: "CDI",
    workMode: "Hybride",
    publishedAt: "2024-01-15",
    description:
      "Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe...",
    requirements: [
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "5+ ans d'expérience",
    ],
    benefits: [
      "Télétravail partiel",
      "Formation continue",
      "RTT",
      "Mutuelle premium",
    ],
    isFavorite: false,
    isApplied: false,
    applicants: 23,
  },
  {
    id: "2",
    title: "Lead Frontend Developer",
    company: "StartupInno",
    location: "Lyon, France",
    salary: "50k - 65k €",
    type: "CDI",
    workMode: "Remote",
    publishedAt: "2024-01-14",
    description:
      "Rejoignez notre startup en forte croissance en tant que Lead Frontend...",
    requirements: [
      "Vue.js",
      "React",
      "Leadership",
      "UX/UI",
      "4+ ans d'expérience",
    ],
    benefits: [
      "100% Remote",
      "Stock-options",
      "MacBook Pro",
      "Budget formation",
    ],
    isFavorite: true,
    isApplied: true,
    applicants: 45,
  },
  {
    id: "3",
    title: "Développeur Backend Python",
    company: "DataFlow Inc",
    location: "Marseille, France",
    salary: "45k - 60k €",
    type: "CDI",
    workMode: "Présentiel",
    publishedAt: "2024-01-13",
    description:
      "Vous travaillerez sur des projets de data engineering à grande échelle...",
    requirements: [
      "Python",
      "Django",
      "PostgreSQL",
      "Docker",
      "3+ ans d'expérience",
    ],
    benefits: [
      "CE attractif",
      "Prime vacances",
      "Tickets restaurant",
      "Salle de sport",
    ],
    isFavorite: false,
    isApplied: false,
    applicants: 31,
  },
  {
    id: "4",
    title: "Consultant DevOps",
    company: "CloudTech Partners",
    location: "Remote, France",
    salary: "600 - 800 €/jour",
    type: "Freelance",
    workMode: "Remote",
    publishedAt: "2024-01-12",
    description:
      "Mission de 6 mois pour accompagner la transformation cloud d'un grand groupe...",
    requirements: [
      "AWS",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "5+ ans d'expérience",
    ],
    benefits: [
      "Télétravail complet",
      "Mission longue durée",
      "Client final",
      "Équipe tech",
    ],
    isFavorite: true,
    isApplied: false,
    applicants: 12,
  },
];

export default function JobOffersPage() {
  const [jobs, setJobs] = useState<JobOffer[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    workMode: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, isFavorite: !job.isFavorite } : job
      )
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      !selectedFilters.type || job.type === selectedFilters.type;
    const matchesWorkMode =
      !selectedFilters.workMode || job.workMode === selectedFilters.workMode;
    const matchesLocation =
      !selectedFilters.location ||
      job.location
        .toLowerCase()
        .includes(selectedFilters.location.toLowerCase());

    return matchesSearch && matchesType && matchesWorkMode && matchesLocation;
  });

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Offres d&apos;emploi
          </h1>
          <p className="text-gray-500 mt-2">
            Découvrez {filteredJobs.length} opportunités qui correspondent à
            votre profil
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
            <FaBookmark />
            Mes favoris
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1C96AD] text-white rounded-lg hover:bg-[#178496] transition-all">
            <FaBriefcase />
            Mes candidatures
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par poste ou entreprise..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            <FaFilter />
            Filtres
          </button>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-gray-200">
            <select
              value={selectedFilters.type}
              onChange={(e) =>
                setSelectedFilters({ ...selectedFilters, type: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C96AD]"
            >
              <option value="">Tous les types</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>

            <select
              value={selectedFilters.workMode}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  workMode: e.target.value,
                })
              }
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C96AD]"
            >
              <option value="">Mode de travail</option>
              <option value="Présentiel">Présentiel</option>
              <option value="Remote">Remote</option>
              <option value="Hybride">Hybride</option>
            </select>

            <input
              type="text"
              value={selectedFilters.location}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  location: e.target.value,
                })
              }
              placeholder="Ville ou région..."
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C96AD]"
            />
          </div>
        )}
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-2xl font-bold text-[#1C96AD]">
            {filteredJobs.length}
          </div>
          <div className="text-gray-600 text-sm">Offres disponibles</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-2xl font-bold text-emerald-600">
            {jobs.filter((j) => j.isFavorite).length}
          </div>
          <div className="text-gray-600 text-sm">Favoris</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="text-2xl font-bold text-purple-600">
            {jobs.filter((j) => j.isApplied).length}
          </div>
          <div className="text-gray-600 text-sm">Candidatures</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="text-2xl font-bold text-amber-600">
            {jobs.filter((j) => j.workMode === "Remote").length}
          </div>
          <div className="text-gray-600 text-sm">Postes remote</div>
        </Card>
      </div>

      {/* Liste des offres */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onToggleFavorite={() => toggleFavorite(job.id)}
          />
        ))}

        {filteredJobs.length === 0 && (
          <Card className="p-12 text-center">
            <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune offre trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function JobCard({
  job,
  onToggleFavorite,
}: {
  job: JobOffer;
  onToggleFavorite: () => void;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-l-[#1C96AD]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 hover:text-[#1C96AD] cursor-pointer">
              {job.title}
            </h3>
            <button
              onClick={onToggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
            >
              {job.isFavorite ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <FaBuilding className="text-[#1C96AD]" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-[#1C96AD]" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <FaDollarSign className="text-[#1C96AD]" />
              {job.salary}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.type === "CDI"
                  ? "bg-green-100 text-green-700"
                  : job.type === "Freelance"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {job.type}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {job.workMode}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <FaCalendar />
              {new Date(job.publishedAt).toLocaleDateString("fr-FR")}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <FaUsers />
              {job.applicants} candidats
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      {/* Compétences requises */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">
          Compétences requises:
        </h4>
        <div className="flex flex-wrap gap-2">
          {job.requirements.slice(0, 5).map((req, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#1C96AD]/10 text-[#1C96AD] rounded-full text-sm font-medium"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 5 && (
            <span className="text-sm text-gray-500">
              +{job.requirements.length - 5} autres
            </span>
          )}
        </div>
      </div>

      {/* Avantages */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Avantages:</h4>
        <div className="flex flex-wrap gap-2">
          {job.benefits.slice(0, 3).map((benefit, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button className="text-[#1C96AD] hover:underline font-medium">
          Voir les détails
        </button>

        <div className="flex gap-3">
          {job.isApplied ? (
            <span className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium">
              Candidature envoyée
            </span>
          ) : (
            <button className="flex items-center gap-2 px-6 py-2 bg-[#1C96AD] text-white rounded-lg hover:bg-[#178496] transition-all font-medium">
              Postuler
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
