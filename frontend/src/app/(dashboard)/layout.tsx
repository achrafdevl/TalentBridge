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
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, loading, router]);

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
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-8 space-y-8">
        {children}
      </main>
    </div>
  );
}
