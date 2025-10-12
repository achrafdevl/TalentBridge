// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { loginUser } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect when token is available
  useEffect(() => {
    if (token && !loading) {
      router.push("/dashboard");
    }
  }, [token, loading, router]);

  // Show Redux errors
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1C96AD]/20 to-[#1492A6]/20">
      <div className="w-full max-w-md">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl p-10 rounded-2xl w-full space-y-6 relative overflow-hidden"
          >
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#1C96AD]/20 rounded-full animate-pulse-slow" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#1492A6]/20 rounded-full animate-pulse-slow" />

            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Bienvenue
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Connectez-vous pour accéder à votre tableau de bord
            </p>

            {(localError || error) && (
              <p className="text-red-500 text-center">{localError || error}</p>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#1C96AD] to-[#1492A6] text-white font-semibold text-lg hover:from-[#1492A6] hover:to-[#1C96AD] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <p className="text-center text-gray-400 mt-4 text-sm">
              Pas encore de compte?{" "}
              <Link href="/signup" className="text-[#1C96AD] hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
