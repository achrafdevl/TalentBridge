"use client";

import { useState, useEffect } from "react";
import { Brain, Shield, Zap, Target, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Optimisation IA Avancée",
    description:
      "Des algorithmes de traitement du langage naturel analysent les offres d'emploi et optimisent votre CV pour un impact maximum.",
    color: "from-purple-500 to-blue-500",
    bgColor: "bg-purple-50",
    delay: 0,
  },
  {
    icon: Target,
    title: "Format Compatible ATS",
    description:
      "Assurez-vous que votre CV passe les systèmes de suivi des candidatures grâce à notre technologie de formatage intelligente.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    delay: 0.1,
  },
  {
    icon: Zap,
    title: "Génération Instantanée",
    description:
      "Créez des CV professionnels en quelques secondes, pas en heures. Parfait pour postuler rapidement à plusieurs postes.",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    delay: 0.2,
  },
  {
    icon: Shield,
    title: "Sécurisé et Privé",
    description:
      "Vos données sont chiffrées et protégées. Nous ne partageons jamais vos informations avec des tiers.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    delay: 0.3,
  },
  {
    icon: FileText,
    title: "Templates Multiples",
    description:
      "Choisissez parmi des modèles conçus par des professionnels qui correspondent à votre secteur et niveau d'expérience.",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    delay: 0.4,
  },
  {
    icon: TrendingUp,
    title: "Analyses de Carrière",
    description:
      "Obtenez des recommandations concrètes pour améliorer votre CV et augmenter vos chances d'entretien.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50",
    delay: 0.5,
  },
];

// Hydration-safe floating dots
const FloatingDots = () => {
  const [dots, setDots] = useState<{ left: number; top: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 8 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setDots(generated);
  }, []);

  return (
    <>
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] rounded-full opacity-30"
          style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay }}
        />
      ))}
    </>
  );
};

const Features = () => {
  return (
    <section className="relative py-32 px-4 bg-gradient-to-br from-[#F8FCFC] via-white to-[#E6F6F8] overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingDots />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div 
          className="text-center space-y-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full text-[#1C96AD] font-medium text-sm mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ⚡ Fonctionnalités puissantes
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Des outils{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent">
                révolutionnaires
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-[#1C96AD]/20 to-[#43C6AC]/20 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              ></motion.div>
            </span>
            <br />
            pour votre succès
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tout ce dont vous avez besoin pour créer des CV exceptionnels qui vous démarquent auprès des recruteurs
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <div className="relative p-10 bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden group-hover:border-transparent">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                <div className="absolute inset-[2px] bg-white rounded-3xl"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className={`relative w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 10 }}
                  >
                    <feature.icon className="w-10 h-10 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  <motion.div 
                    className="flex items-center text-[#1C96AD] font-medium group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#1C96AD] group-hover:to-[#43C6AC] group-hover:bg-clip-text transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-2">En savoir plus</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                </div>

                <div className={`absolute top-6 right-6 w-3 h-3 bg-gradient-to-r ${feature.color} rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-3">🚀 Découvrir toutes les fonctionnalités</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
