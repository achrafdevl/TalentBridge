export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Créez votre profil",
      description: "Inscrivez-vous et complétez votre profil professionnel",
    },
    {
      number: "2",
      title: "Générez votre CV",
      description: "L'IA crée un CV optimisé basé sur votre profil",
    },
    {
      number: "3",
      title: "Trouvez des offres",
      description:
        "Découvrez des opportunités qui correspondent à votre profil",
    },
    {
      number: "4",
      title: "Candidaturez facilement",
      description: "Postulez en un clic avec des candidatures personnalisées",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En quelques étapes simples, transformez votre recherche
            d&apos;emploi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
