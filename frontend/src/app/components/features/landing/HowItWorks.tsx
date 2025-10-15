"use client";

import { motion } from "framer-motion";
import { UserPlus, FileText, Search, Send, ArrowRight, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Créez votre profil",
      description: "Inscrivez-vous et complétez votre profil professionnel en quelques clics",
      icon: UserPlus,
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50",
      details: ["Informations personnelles", "Expériences professionnelles", "Compétences et formations"]
    },
    {
      number: "2",
      title: "Générez votre CV",
      description: "L'IA crée un CV optimisé basé sur votre profil et les meilleures pratiques",
      icon: FileText,
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-50",
      details: ["Analyse intelligente", "Optimisation ATS", "Design professionnel"]
    },
    {
      number: "3",
      title: "Trouvez des offres",
      description: "Découvrez des opportunités qui correspondent parfaitement à votre profil",
      icon: Search,
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-50",
      details: ["Matching intelligent", "Filtres avancés", "Alertes personnalisées"]
    },
    {
      number: "4",
      title: "Candidaturez facilement",
      description: "Postulez en un clic avec des candidatures personnalisées et optimisées",
      icon: Send,
      color: "from-orange-500 to-red-400",
      bgColor: "bg-orange-50",
      details: ["Lettres de motivation", "Suivi des candidatures", "Statistiques détaillées"]
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Connecting Lines */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <motion.path
            d="M 300 200 Q 600 100 900 200 Q 1200 300 900 400 Q 600 500 300 400"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C96AD" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#43C6AC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1C96AD" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full text-[#1C96AD] font-medium text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            🚀 Processus simplifié
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Comment{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent">
                ça marche
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-[#1C96AD]/20 to-[#43C6AC]/20 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              ></motion.div>
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            En quelques étapes simples, transformez votre recherche d&apos;emploi et{" "}
            <span className="font-semibold text-[#1C96AD]">multipliez vos chances de succès</span>
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Step Card */}
              <div className="relative text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                <div className="absolute inset-[2px] bg-white rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Step Number */}
                  <motion.div 
                    className={`relative w-20 h-20 bg-gradient-to-r ${step.color} text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 10 }}
                  >
                    {step.number}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <step.icon className="w-3 h-3 text-gray-700" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, ${step.color.split(' ')[1]}, ${step.color.split(' ')[3]})` }}>
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2 text-sm text-gray-500">
                    {step.details.map((detail, detailIndex) => (
                      <motion.li 
                        key={detailIndex}
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.2 + detailIndex * 0.1 + 0.5 }}
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${step.color} rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${step.color} rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>

              {/* Step Connector (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] opacity-30"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-[#1C96AD]/5 to-[#43C6AC]/5 rounded-3xl border border-[#1C96AD]/20 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Prêt à commencer votre transformation ?
              </h3>
              <p className="text-gray-600">
                Rejoignez des milliers de professionnels qui ont déjà trouvé leur emploi idéal
              </p>
            </div>
            
            <motion.button
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-3">🚀 Démarrer maintenant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}