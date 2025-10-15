"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../redux/hooks";
import { Card } from "@/app/components/ui/Card";
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaChartLine,
  FaSearch,
  FaRocket,
  FaBriefcase,
  FaEdit,
  FaEye,
  FaHeart,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaCalendar,
  FaBuilding,
  FaBell
} from "react-icons/fa";

const stats = [
  {
    title: "Candidatures",
    value: "24",
    icon: FaFileAlt,
    trend: "+12%",
    trendUp: true,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    description: "Ce mois-ci"
  },
  {
    title: "Offres actives",
    value: "156",
    icon: FaTachometerAlt,
    trend: "+8%",
    trendUp: true,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "from-emerald-50 to-emerald-100",
    description: "Nouvelles cette semaine"
  },
  {
    title: "Vues profil",
    value: "342",
    icon: FaUser,
    trend: "+23%",
    trendUp: true,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    description: "Ce mois-ci"
  },
  {
    title: "Taux de réussite",
    value: "87%",
    icon: FaChartLine,
    trend: "+5%",
    trendUp: true,
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100",
    description: "Candidatures acceptées"
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Candidature à Software Engineer",
    company: "TechCorp Inc.",
    time: "Il y a 2 heures",
    type: "application",
    status: "En attente",
    statusColor: "bg-yellow-100 text-yellow-700"
  },
  {
    id: 2,
    title: "Profil consulté par un recruteur",
    company: "StartupXYZ",
    time: "Il y a 5 heures",
    type: "view",
    status: "Nouveau",
    statusColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 3,
    title: "CV généré avec succès",
    company: "TalentBridge",
    time: "Il y a 1 jour",
    type: "cv",
    status: "Terminé",
    statusColor: "bg-green-100 text-green-700"
  },
  {
    id: 4,
    title: "Entretien programmé",
    company: "DataFlow Corp",
    time: "Il y a 2 jours",
    type: "interview",
    status: "Confirmé",
    statusColor: "bg-purple-100 text-purple-700"
  },
  {
    id: 5,
    title: "Offre ajoutée aux favoris",
    company: "CloudTech",
    time: "Il y a 3 jours",
    type: "favorite",
    status: "Sauvegardé",
    statusColor: "bg-pink-100 text-pink-700"
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: "Entretien technique - TechCorp",
    date: "Demain 14h00",
    type: "interview",
    priority: "high"
  },
  {
    id: 2,
    title: "Suivi candidature - StartupXYZ",
    date: "Vendredi 10h00",
    type: "follow-up",
    priority: "medium"
  },
  {
    id: 3,
    title: "Mettre à jour le CV",
    date: "Ce weekend",
    type: "task",
    priority: "low"
  }
];

const jobRecommendations = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "InnovateTech",
    location: "Paris, France",
    match: "95%",
    salary: "65k - 80k €",
    posted: "Il y a 2 jours"
  },
  {
    id: 2,
    title: "Lead Frontend Engineer",
    company: "DigitalCorp",
    location: "Lyon, France", 
    match: "89%",
    salary: "55k - 70k €",
    posted: "Il y a 4 jours"
  }
];

export default function Dashboard() {
  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 17) return "Bon après-midi";
    return "Bonsoir";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C96AD]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* En-tête personnalisé */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1C96AD] to-blue-600 bg-clip-text text-transparent">
            {getGreeting()}, {user?.full_name || user?.email?.split('@')[0] || 'Utilisateur'} !
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <FaCalendar className="text-[#1C96AD]" />
            {currentTime.toLocaleDateString("fr-FR", { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all">
            <FaBell className="text-[#1C96AD]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-12 h-12 bg-gradient-to-r from-[#1C96AD] to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {(user?.full_name || user?.email || "U")[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center text-sm font-medium ${
                      stat.trendUp ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {stat.trendUp ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                      {stat.trend}
                    </span>
                    <span className="text-xs text-gray-500">{stat.description}</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} shadow-inner`}>
                  <StatIcon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contenu principal */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Activité récente */}
        <Card className="lg:col-span-2 p-8 shadow-lg border-0 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaClock className="text-[#1C96AD]" />
              Activité récente
            </h3>
            <button className="text-[#1C96AD] hover:underline font-medium">
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => {
              const ActivityIcon = 
                activity.type === "application" ? FaFileAlt :
                activity.type === "view" ? FaEye :
                activity.type === "cv" ? FaRocket :
                activity.type === "interview" ? FaUser :
                FaHeart;
              
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full ${
                    activity.type === "application" ? "bg-blue-100 text-blue-600" :
                    activity.type === "view" ? "bg-green-100 text-green-600" :
                    activity.type === "cv" ? "bg-purple-100 text-purple-600" :
                    activity.type === "interview" ? "bg-orange-100 text-orange-600" :
                    "bg-pink-100 text-pink-600"
                  }`}>
                    <ActivityIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{activity.title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaBuilding className="h-3 w-3" />
                      {activity.company}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
                    {activity.status}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Actions rapides et tâches */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <FaRocket className="text-[#1C96AD]" />
              Actions rapides
            </h3>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl bg-gradient-to-r from-[#1C96AD] to-blue-600 text-white font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all">
                <FaRocket />
                Générer un nouveau CV
              </button>
              <button className="w-full p-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                <FaSearch />
                Parcourir les offres
              </button>
              <button className="w-full p-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                <FaEdit />
                Mettre à jour le profil
              </button>
              <button className="w-full p-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                <FaBriefcase />
                Mes candidatures
              </button>
            </div>
          </Card>

          {/* Tâches à venir */}
          <Card className="p-6 shadow-lg border-0 bg-white">
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <FaCalendar className="text-[#1C96AD]" />
              À venir
            </h3>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === "high" ? "bg-red-500" :
                    task.priority === "medium" ? "bg-yellow-500" :
                    "bg-green-500"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recommandations d'emploi */}
      <Card className="p-8 shadow-lg border-0 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaBriefcase className="text-[#1C96AD]" />
            Emplois recommandés pour vous
          </h3>
          <button className="text-[#1C96AD] hover:underline font-medium">
            Voir toutes les recommandations
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {jobRecommendations.map((job) => (
            <div key={job.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-gray-600 flex items-center gap-2 mb-1">
                    <FaBuilding className="h-4 w-4" />
                    {job.company}
                  </p>
                  <p className="text-gray-600 text-sm">{job.location}</p>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
                    {job.match} match
                  </div>
                  <p className="text-sm text-gray-500">{job.posted}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1C96AD]">{job.salary}</span>
                <button className="px-4 py-2 bg-[#1C96AD] text-white rounded-lg hover:bg-[#178496] transition-all">
                  Voir l'offre
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}