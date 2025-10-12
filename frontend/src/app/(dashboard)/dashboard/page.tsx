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
} from "react-icons/fa";

const stats = [
  { title: "Total Applications", value: "24", icon: FaFileAlt, trend: "+12%", trendUp: true, color: "from-blue-500 to-blue-600", bgColor: "from-blue-50 to-blue-100" },
  { title: "Active Jobs", value: "156", icon: FaTachometerAlt, trend: "+8%", trendUp: true, color: "from-emerald-500 to-emerald-600", bgColor: "from-emerald-50 to-emerald-100" },
  { title: "Profile Views", value: "342", icon: FaUser, trend: "+23%", trendUp: true, color: "from-purple-500 to-purple-600", bgColor: "from-purple-50 to-purple-100" },
  { title: "Success Rate", value: "87%", icon: FaChartLine, trend: "+5%", trendUp: true, color: "from-orange-500 to-orange-600", bgColor: "from-orange-50 to-orange-100" },
];

const recentActivities = [
  { id: 1, title: "Applied to Software Engineer position", company: "TechCorp Inc.", time: "2 hours ago", type: "application", status: "pending" },
  { id: 2, title: "Profile viewed by recruiter", company: "StartupXYZ", time: "5 hours ago", type: "view", status: "viewed" },
  { id: 3, title: "CV generated successfully", company: "TalentBridge", time: "1 day ago", type: "cv", status: "completed" },
];

export default function Dashboard() {
  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.auth);

  // Hook-safe loading state instead of early return
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Redirection vers la page de connexion...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Bienvenue, {user?.email}</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs">
                    {stat.trendUp ? "+" : "-"} {stat.trend}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor}`}>
                  <StatIcon className={`h-8 w-8 bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Activité récente</h3>
          <div className="space-y-4">
            {recentActivities.map((act) => {
              const ActivityIcon =
                act.type === "application" ? FaFileAlt :
                act.type === "view" ? FaUser : FaRocket;
              return (
                <div key={act.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <ActivityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{act.title}</p>
                    <p className="text-sm text-gray-600">{act.company}</p>
                    <p className="text-xs text-gray-500">{act.time}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {act.status}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Actions rapides</h3>
          <button className="w-full p-4 rounded-xl bg-blue-500 text-white mb-2 flex items-center justify-center gap-2">
            <FaRocket /> Générer un nouveau CV
          </button>
          <button className="w-full p-4 rounded-xl border mb-2 flex items-center justify-center gap-2">
            <FaSearch /> Parcourir les offres
          </button>
          <button className="w-full p-4 rounded-xl border mb-2 flex items-center justify-center gap-2">
            <FaEdit /> Mettre à jour le profil
          </button>
          <button className="w-full p-4 rounded-xl border flex items-center justify-center gap-2">
            <FaBriefcase /> Mes candidatures
          </button>
        </Card>
      </div>
    </div>
  );
}
