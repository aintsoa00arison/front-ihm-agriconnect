// components/Process.tsx

export default function Process() {
  const steps = [
    {
      number: "1",
      title: "S'inscrire",
      description: "Créez votre profil en tant que Fournisseur ou Collecteur et vérifiez vos informations.",
    },
    {
      number: "2",
      title: "Se connecter",
      description: "Parcourez le marché ou publiez vos besoins pour trouver le partenaire idéal.",
    },
    {
      number: "3",
      title: "Échanger",
      description: "Finalisez les conditions, effectuez des paiements sécurisés et gérez la logistique sans effort.",
    },
  ];

  return (
    <section id="about" className="w-full bg-primary py-24 font-sans relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
        
        {/* En-tête */}
        <div className="mb-20 space-y-2">
          <p className="text-white/90 font-semibold text-sm uppercase tracking-widest">
            Simple, Rapide et Transparent.
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Lancez-vous en quelques minutes et rejoignez l'avenir du commerce agricole 
            grâce à notre processus simplifié en trois étapes.
          </p>
        </div>

        {/* Conteneur des étapes */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          
          {/* Ligne pointillée décorative (Visible uniquement sur desktop) */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-white/20 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center group">
              
              {/* Cercle avec numéro */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary text-3xl font-black">
                  {step.number}
                </span>
              </div>
              
              {/* Contenu texte */}
              <h3 className="text-white text-2xl font-bold mb-4">
                {step.title}
              </h3>
              
              <p className="text-white/70 leading-relaxed text-sm lg:text-base max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}