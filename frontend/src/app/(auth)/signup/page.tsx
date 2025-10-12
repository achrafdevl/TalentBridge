"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { signupUser } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, loading, error } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect when token is available
  useEffect(() => {
    console.log("Signup page - Token changed:", token);
    console.log("Signup page - Loading:", loading);
    console.log("Signup page - Error:", error);

    if (token && !loading) {
      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [token, loading, router]);

  // Show loading if we're checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1C96AD]/20 to-[#1492A6]/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error from Redux state
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(signupUser({ full_name: fullName, email, password }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1C96AD]/20 to-[#1492A6]/20">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-10 rounded-2xl w-full max-w-md space-y-6 relative overflow-hidden"
      >
        {/* Decorative floating circles */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#1C96AD]/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-[#1492A6]/20 rounded-full animate-pulse-slow"></div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Créer un compte
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Rejoignez TalentBridge pour booster vos candidatures avec l&apos;IA
        </p>

        {/* Display error safely */}
        {(error || localError) && (
          <p className="text-red-500 text-center">
            {typeof localError === "string"
              ? localError
              : typeof error === "string"
              ? error
              : "Une erreur est survenue"}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C96AD] focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#1C96AD] to-[#1492A6] text-white font-semibold text-lg hover:from-[#1492A6] hover:to-[#1C96AD] shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <p className="text-center text-gray-800 mt-4 text-sm">
          Déjà un compte?{" "}
          <a href="/login" className="text-[#1C96AD] hover:underline">
            Connectez-vous
          </a>
        </p>
      </form>
    </div>
  );
}
