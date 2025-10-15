"use client";

import { motion } from "framer-motion";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Gain de temps",
      description:
        "Générez des CV et candidatures en quelques minutes au lieu d'heures",
      icon: "⏱️",
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50",
    },
    {
      title: "Meilleure visibilité",
      description:
        "Optimisez votre profil pour attirer l'attention des recruteurs",
      icon: "👁️",
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-50",
    },
    {
      title: "Taux de succès élevé",
      description: "Augmentez vos chances d'obtenir des entretiens",
      icon: "📈",
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-50",
    },
    {
      title: "Personnalisation",
      description: "Adaptez chaque candidature à l'offre d'emploi",
      icon: "🎨",
      color: "from-orange-500 to-red-400",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section id="benefits" className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            ✨ Avantages exclusifs
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent">
              TalentBridge
            </span>
            <span className="text-[#1C96AD]">?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Découvrez les avantages qui font la différence dans votre recherche
            d&apos;emploi et vous donnent un avantage concurrentiel
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden group-hover:border-transparent">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                <div className="absolute inset-[1px] bg-white rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <motion.div 
                    className={`inline-flex items-center justify-center w-20 h-20 ${benefit.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 10 }}
                  >
                    <span className="text-4xl filter group-hover:brightness-110 transition-all duration-300">
                      {benefit.icon}
                    </span>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#1C96AD] group-hover:to-[#43C6AC] group-hover:bg-clip-text transition-all duration-300">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-[#43C6AC] to-[#1C96AD] rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "50k+", label: "CV générés" },
              { value: "95%", label: "Taux de satisfaction" },
              { value: "3x", label: "Plus d'entretiens" },
              { value: "24/7", label: "Support disponible" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}