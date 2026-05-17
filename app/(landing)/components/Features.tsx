"use client";

import { ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      title: "Informations Sécurisées",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      icon: <ShieldCheck className="text-primary w-10 h-10" />, 
    },
    {
      title: "Efficacité du Marché",
      description: "Les connexions directes éliminent les intermédiaires inutiles, maximisant la valeur pour les deux parties.",
      icon: <Zap className="text-primary w-10 h-10" />,
    },
    {
      title: "Analyses en Temps Réel",
      description: "Accédez aux prix du marché en direct et aux tendances de la demande pour prendre des décisions éclairées.",
      icon: <BarChart3 className="text-primary w-10 h-10" />,
    },
  ];

  return (
    <section id="features" className="w-full bg-neutral py-24 font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
        
        {/* --- EN-TÊTE DE LA SECTION --- */}
        <div className="mb-20 space-y-4">
          <p className="text-label font-bold text-sm tracking-widest uppercase">
            Autonomiser l'Écosystème
          </p>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-input-element text-lg max-w-3xl mx-auto leading-relaxed pt-4">
            Chez AgriConnect, notre mission est de numériser la chaîne d'approvisionnement agricole. 
            Nous créons un environnement sécurisé et transparent où les fournisseurs trouvent 
            une demande stable et les collecteurs peuvent s'approvisionner en produits de haute qualité directement à la source.
          </p>
        </div>

        {/* --- GRILLE DES CARACTÉRISTIQUES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white border border-separator/10 rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group"
            >
              {/* CardHeader corrigé : pas de padding global shadcn, gestion manuelle de l'espace */}
              <CardHeader className="flex flex-col items-center p-0 pt-10 px-6 space-y-6 w-full">
                {/* Conteneur de l'icône */}
                <div className="w-24 h-24 bg-light-bg rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner flex-shrink-0">
                  {feature.icon}
                </div>
                
                <CardTitle className="text-2xl font-black text-label tracking-tight whitespace-normal">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              {/* CardContent corrigé : px-8 pour donner de la largeur et empêcher le texte de se tasser verticalement */}
              <CardContent className="p-0 pt-4 pb-10 px-8 text-input-element leading-relaxed text-sm lg:text-base w-full">
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}