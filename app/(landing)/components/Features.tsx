// components/Features.tsx
import { PiShieldCheckFill, PiLightningFill, PiChartLineUpFill } from 'react-icons/pi'; // Phosphor icons pour un style plus gras

export default function Features() {
  const features = [
    {
      title: "Informations Sécurisées",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      // Utilisation du vert Primary direct pour l'icône
      icon: <PiShieldCheckFill className="text-primary text-4xl" />, 
    },
    {
      title: "Efficacité du Marché",
      description: "Les connexions directes éliminent les intermédiaires inutiles, maximisant la valeur pour les deux parties.",
      icon: <PiLightningFill className="text-primary text-4xl" />,
    },
    {
      title: "Analyses en Temps Réel",
      description: "Accédez aux prix du marché en direct et aux tendances de la demande pour prendre des décisions éclairées.",
      icon: <PiChartLineUpFill className="text-primary text-4xl" />,
    },
  ];

  return (
    <section id="features" className="w-full bg-neutral py-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
        
        {/* En-tête de la section */}
        <div className="mb-20 space-y-4">
          <p className="text-label font-medium text-sm tracking-widest uppercase">
            Autonomiser l'Écosystème
          </p>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-input-element text-lg max-w-3xl mx-auto leading-relaxed pt-4">
            Chez AgriConnect, notre mission est de numériser la chaîne d'approvisionnement agricole. 
            Nous créons un environnement sécurisé et transparent où les fournisseurs trouvent 
            une demande stable et les collecteurs peuvent s'approvisionner en produits de haute qualité directement à la source.
          </p>
        </div>

        {/* Grille des cartes de caractéristiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              // Suppression de 'border' et changement pour 'shadow-xl' vers 'shadow-2xl'
              className="bg-white p-10 rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center space-y-6 group"
            >
              {/* Conteneur d'icône avec un vert plus présent */}
              <div className="w-24 h-24 bg-light-bg rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-extrabold text-label">
                {feature.title}
              </h3>
              
              <p className="text-input-element leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}