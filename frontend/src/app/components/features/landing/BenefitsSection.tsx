export default function BenefitsSection() {
  const benefits = [
    {
      title: "Gain de temps",
      description:
        "Générez des CV et candidatures en quelques minutes au lieu d'heures",
      icon: "⏱️",
    },
    {
      title: "Meilleure visibilité",
      description:
        "Optimisez votre profil pour attirer l'attention des recruteurs",
      icon: "👁️",
    },
    {
      title: "Taux de succès élevé",
      description: "Augmentez vos chances d'obtenir des entretiens",
      icon: "📈",
    },
    {
      title: "Personnalisation",
      description: "Adaptez chaque candidature à l'offre d'emploi",
      icon: "🎨",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir TalentBridge ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les avantages qui font la différence dans votre recherche
            d&apos;emploi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
