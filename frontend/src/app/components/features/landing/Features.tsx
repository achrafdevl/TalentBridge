export default function Features() {
  const features = [
    {
      title: "Génération de CV IA",
      description:
        "Créez des CV professionnels optimisés avec l'intelligence artificielle",
      icon: "📄",
    },
    {
      title: "Optimisation des candidatures",
      description:
        "Améliorez vos chances de succès avec des candidatures personnalisées",
      icon: "🎯",
    },
    {
      title: "Matching intelligent",
      description:
        "Trouvez les offres d'emploi qui correspondent parfaitement à votre profil",
      icon: "🔍",
    },
    {
      title: "Suivi des candidatures",
      description:
        "Gardez une trace de toutes vos candidatures et leurs statuts",
      icon: "📊",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités puissantes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment TalentBridge peut transformer votre recherche
            d&apos;emploi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
