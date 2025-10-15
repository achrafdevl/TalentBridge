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

  useEffect(() => {
    if (token && !loading) router.push("/dashboard");
  }, [token, loading, router]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1C96AD] to-[#1492A6] text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1C96AD33,_transparent_50%)] animate-pulse"></div>

      {/* Floating glass card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl text-center animate-fade-in"
      >
        <h1 className="text-4xl font-bold mb-2">Bienvenue 👋</h1>
        <p className="text-white/80 mb-8">
          Connectez-vous pour accéder à TalentBridge
        </p>

        {(localError || error) && (
          <p className="text-red-400 mb-4 text-sm">{localError || error}</p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] transition"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#1C96AD] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#1C96AD] to-[#1492A6] hover:from-[#1492A6] hover:to-[#1C96AD] transition-transform hover:scale-105 text-white font-semibold text-lg shadow-lg"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-white/70 mt-6 text-sm">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-[#7BE0F2] hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </form>
    </div>
  );
}
