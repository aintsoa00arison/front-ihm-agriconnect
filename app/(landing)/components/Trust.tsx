// components/Trust.tsx
import Image from 'next/image';
import { UserCheck, Star, Gavel, ClipboardCheck } from 'lucide-react';

export default function Trust() {
  const trustFeatures = [
    {
      icon: <UserCheck className="text-primary" size={24} />,
      title: "Identités Vérifiées",
      description: "Vérification KYC et d'entreprise pour tous les membres."
    },
    {
      icon: <Star className="text-primary" size={24} />,
      title: "Système de Notation",
      description: "Retours transparents après chaque transaction."
    },
    {
      icon: <Gavel className="text-primary" size={24} />,
      title: "Résolution de Litiges",
      description: "Médiation équitable pour tout désaccord contractuel."
    },
    {
      icon: <ClipboardCheck className="text-primary" size={24} />,
      title: "Contrôles Qualité",
      description: "Services optionnels d'inspection par des tiers."
    }
  ];

  return (
    <section className="w-full bg-neutral py-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- PARTIE GAUCHE : TEXTE ET GRILLE --- */}
          <div className="flex-[1.2] space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-label">
                La confiance est notre priorité.
              </h2>
              <p className="text-input-element text-lg leading-relaxed max-w-2xl">
                Nous savons qu'en agriculture, la fiabilité est primordiale. C'est pourquoi nous 
                avons intégré un système de confiance multicouche au cœur de notre plateforme.
              </p>
            </div>

            {/* Grille des fonctionnalités de confiance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-label">{feature.title}</h4>
                    <p className="text-input-element text-sm leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- PARTIE DROITE : VISUELS ET STATS --- */}
          <div className="flex-1 flex flex-col md:flex-row lg:flex-col gap-6 w-full">
            
            {/* Image principale avec arrondis */}
            <div className="relative rounded-[32px] overflow-hidden shadow-xl h-64 lg:h-80 w-full">
              <Image 
                src="/trust-seeds.jpg" // Image des mains avec les graines
                alt="Fiabilité Agricole"
                fill
                className="object-cover"
              />
            </div>

            {/* Conteneur des petites cartes de stats */}
            <div className="flex flex-col gap-6 w-full lg:w-auto">
              {/* Carte Note Plateforme */}
              <div className="bg-secondary p-6 rounded-[24px] shadow-lg text-white flex flex-col justify-center min-w-[240px]">
                <span className="text-4xl font-black">4.9/5</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Note Plateforme</span>
              </div>

              {/* Carte Échanges Vérifiés */}
              <div className="bg-primary p-6 rounded-[24px] shadow-lg text-white flex flex-col justify-center min-w-[240px]">
                <span className="text-4xl font-black">50k+</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Échanges Vérifiés</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}