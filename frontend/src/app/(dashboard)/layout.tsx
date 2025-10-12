"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only redirect if we're not loading and there's no token
    if (!loading && !token) {
      console.log("Dashboard layout - No token, redirecting to login");
      router.push("/login");
    }
  }, [token, loading, router]);

  // Show loading or nothing while checking authentication
  if (loading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
