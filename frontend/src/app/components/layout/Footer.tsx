"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Produit",
      links: [
        { name: "Fonctionnalités", href: "#features" },
        { name: "Comment ça marche", href: "#how-it-works" },
        { name: "Avantages", href: "#benefits" },
        { name: "Tarifs", href: "/pricing" },
        { name: "Templates", href: "/templates" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Centre d'aide", href: "/help" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Guides", href: "/guides" },
        { name: "Webinaires", href: "/webinars" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { name: "À propos", href: "/about" },
        { name: "Carrières", href: "/careers" },
        { name: "Presse", href: "/press" },
        { name: "Partenaires", href: "/partners" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Légal",
      links: [
        { name: "Conditions d'utilisation", href: "/terms" },
        { name: "Politique de confidentialité", href: "/privacy" },
        { name: "Cookies", href: "/cookies" },
        { name: "RGPD", href: "/gdpr" },
        { name: "Sécurité", href: "/security" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/talentbridge", name: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/talentbridge", name: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/talentbridge", name: "Instagram" },
    { icon: Github, href: "https://github.com/talentbridge", name: "GitHub" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Decorations using inline SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 60"
          fill="none"
        >
          <g fill="#ffffff" fillOpacity="0.05">
            <circle cx="30" cy="30" r="1" />
          </g>
        </svg>
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-[#1C96AD]/10 to-[#43C6AC]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <motion.div
          className="border-b border-gray-700 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Restez informé des{" "}
                <span className="bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] bg-clip-text text-transparent">
                  dernières nouveautés
                </span>
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl">
                Recevez des conseils carrière exclusifs, des nouvelles fonctionnalités et des offres spéciales directement dans votre boîte mail.
              </p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:min-w-[400px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#1C96AD] transition-colors duration-300"
                />
              </div>
              <motion.button
                className="group px-8 py-4 bg-gradient-to-r from-[#1C96AD] to-[#43C6AC] rounded-2xl font-bold flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-[#1C96AD]/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">S&apos;abonner</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Links Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand + Contact */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center mb-6">
                <motion.img
                  src="/TalentBridge.png"
                  alt="TalentBridge"
                  className="h-10 w-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Transformez votre recherche d&apos;emploi avec l&apos;intelligence artificielle. Créez des CV optimisés qui vous démarquent et trouvez l&apos;emploi de vos rêves.
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-5 h-5 mr-3 text-[#1C96AD]" />
                  <span>contact@talentbridge.fr</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-5 h-5 mr-3 text-[#1C96AD]" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-5 h-5 mr-3 text-[#1C96AD]" />
                  <span>Paris, France</span>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-6 text-white">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-300 inline-flex items-center group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-700 py-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-400 text-center md:text-left">
              <p className="mb-2">© 2024 TalentBridge. Tous droits réservés.</p>
              <p className="text-sm">Fait avec ❤️ à Casablanca, Maroc.</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 mr-2">Suivez-nous :</span>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-[#1C96AD] hover:to-[#43C6AC] rounded-full flex items-center justify-center transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C96AD" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#43C6AC" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1C96AD" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
