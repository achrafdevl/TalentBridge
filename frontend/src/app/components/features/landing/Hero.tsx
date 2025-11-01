"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles, Users, Award } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FCFC] via-white to-[#E6F6F8] pt-32 pb-32 px-4 sm:px-6 lg:px-8 text-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-32 left-16 text-[#1C96AD]/30"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div
          className="absolute top-48 right-24 text-[#43C6AC]/30"
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Users size={36} />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-32 text-[#1C96AD]/30"
          animate={{ y: [0, -25, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Award size={32} />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:space-x-40">
          {/* Left: Hero Content */}
          <motion.div
            className="w-full lg:w-1/2 mt-12 lg:mt-0 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full text-[#1C96AD] font-medium text-sm mb-8 border border-[#1C96AD]/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              #1 Générateur de CV IA en France
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Créez des CV{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent">
                  intelligents
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-4 bg-gradient-to-r from-[#1C96AD]/20 to-[#43C6AC]/20 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                ></motion.div>
              </span>{" "}
              avec l&apos;IA
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Générez automatiquement des CV{" "}
              <span className="font-semibold text-[#1C96AD]">
                personnalisés
              </span>{" "}
              et <span className="font-semibold text-[#1C96AD]">optimisés</span>{" "}
              pour chaque offre d&apos;emploi grâce à l&apos;intelligence
              artificielle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {/* Primary Button */}
              <motion.button
                className="group relative inline-flex items-center px-12 py-6 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] hover:from-[#16889C] hover:to-[#36B9A5] text-white rounded-3xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 mr-3">
                  🚀 Commencer gratuitement
                </span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              {/* Secondary Button */}
              <motion.button
                className="group inline-flex items-center px-12 py-6 border-2 border-[#1C96AD] text-[#1C96AD] rounded-3xl text-lg font-bold hover:bg-[#1C96AD] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Voir  la démo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {[
                { label: "Taux de matching", value: "95%" },
                { label: "Temps moyen", value: "3min" },
                { label: "Plus de réponses", value: "2x" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                >
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mt-12 text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">✅ 100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">🔒 Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  ⚡ Résultats instantanés
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: CV Preview */}
          <motion.div
            className="w-full lg:w-1/2 relative mb-12 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Main CV Card */}
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-700 relative border border-[#E6F6F8] overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C96AD]/5 to-[#43C6AC]/5 rounded-3xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src="/placeholder.jpeg"
                        alt="Profile"
                        width={60}
                        height={60}
                        className="w-16 h-16 rounded-full object-cover border-4 border-[#1C96AD] shadow-lg"
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Alex Carter
                      </h3>
                      <p className="text-[#1C96AD] font-semibold">
                        Full Stack Developer
                      </p>
                    </div>
                  </div>

                  {/* About */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-700 mb-2">
                      À propos de moi
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Passionné par la création d&apos;applications modernes et
                      performantes avec{" "}
                      <span className="font-bold text-[#1C96AD]">React</span>,{" "}
                      <span className="font-bold text-[#1C96AD]">Next.js</span>{" "}
                      et{" "}
                      <span className="font-bold text-[#1C96AD]">Python</span>.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-700 mb-2">
                      Expérience
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-[#1C96AD] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Frontend Developer — Freelance (2023–2025)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-[#43C6AC] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>UI/UX Designer — ARK-X Talent Factory</span>
                      </li>
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-700 mb-3">
                      Compétences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Next.js",
                        "Node.js",
                        "Tailwind CSS",
                        "Python",
                      ].map((skill, index) => (
                        <motion.span
                          key={skill}
                          className="bg-gradient-to-r from-[#E6F6F8] to-[#D4F1F4] text-[#1C96AD] px-3 py-1 rounded-full text-xs font-bold border border-[#1C96AD]/20"
                          whileHover={{ scale: 1.1 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.5 + index * 0.1,
                          }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Badge */}
                <motion.div
                  className="absolute top-1 right-2 bg-gradient-to-r from-[#43C6AC] to-[#1C96AD] text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🤖 IA
                </motion.div>
              </motion.div>

              {/* Floating Job Offer */}
              <motion.div
                className="absolute top-20 -left-16 sm:-left-20 bg-white rounded-2xl shadow-xl p-6 w-72 transform -rotate-6 hover:rotate-0 transition-transform duration-700 opacity-90 hover:opacity-100 border border-[#E6F6F8]"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.9, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/logo.png"
                    alt="Company"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg object-cover border-2 border-[#1C96AD]"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      Frontend Developer
                    </p>
                    <p className="text-xs text-gray-500">Remote · Full-time</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Rejoignez une équipe créative qui construit le futur du web.
                </p>
                <div className="flex gap-2">
                  <span className="bg-[#E6F6F8] text-[#1C96AD] px-3 py-1 rounded-full text-xs font-medium">
                    React
                  </span>
                  <span className="bg-[#E6F6F8] text-[#1C96AD] px-3 py-1 rounded-full text-xs font-medium">
                    Python
                  </span>
                </div>
              </motion.div>

              {/* Background Decorative Elements */}
              <div className="absolute inset-0 -z-10">
                <motion.div
                  className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-[#43C6AC]/20 to-[#AEEEEE]/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-[#AEEEEE]/20 to-[#D4FAF6]/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
