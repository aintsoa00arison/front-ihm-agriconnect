import Reveal from "./Reveal";

export default function Process() {
  const steps = [
    {
      number: "1",
      title: "S'inscrire",
      description:
        "Créez votre profil en tant que Fournisseur ou Collecteur et validez vos informations.",
    },
    {
      number: "2",
      title: "Publier",
      description:
        "Affichez vos offres ou publiez vos besoins d'achat pour capter les meilleures opportunités.",
    },
    {
      number: "3",
      title: "Échanger",
      description:
        "Entrez en contact direct, discutez des modalités et concluez vos accords de gré à gré en toute transparence.",
    },
  ];

  return (
    <section
      id="about"
      className="w-full bg-primary py-16 sm:py-20 md:py-24 font-sans relative overflow-hidden"
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-16 text-center">
        <div className="mb-12 sm:mb-16 md:mb-20 space-y-2">
          <p className="text-white/90 font-semibold text-sm uppercase tracking-widest">
            Simple, Rapide et Transparent.
          </p>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Lancez-vous en quelques minutes et rejoignez la plateforme de
            collecte grâce à notre processus simplifié en trois étapes.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-white/20 z-0"></div>

          {steps.map((step, index) => (
            <Reveal key={index} delay={index * 120}>
              <div className="relative z-10 flex flex-col items-center group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300 select-none">
                  <span className="text-primary text-2xl sm:text-3xl font-black">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-4">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-sm lg:text-base max-w-70">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
