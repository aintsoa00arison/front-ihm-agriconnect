"use client";

import { ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      title: "Informations Sécurisées",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      icon: <ShieldCheck className="text-green-700 w-8 h-8" />,
    },
    {
      title: "Efficacité du Marché",
      description:
        "Les connexions directes éliminent les intermédiaires inutiles, maximisant la valeur pour les deux parties.",
      icon: <Zap className="text-primary w-8 h-8" />,
    },
    {
      title: "Analyses en Temps Réel",
      description:
        "Accédez aux prix du marché en direct et aux tendances de la demande pour prendre des décisions éclairées.",
      icon: <BarChart3 className="text-primary w-8 h-8" />,
    },
  ];

  return (
    <section
      id="features"
      className="w-full bg-background py-12 sm:py-16 font-sans select-none"
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-16 text-center">
        <div className="mb-10 sm:mb-14 space-y-3">
          <p className="text-label font-bold text-xs tracking-widest uppercase font-manrope">
            Autonomiser l&apos;Ecosystème
          </p>
          <div className="w-12 h-0.5 bg-primary mx-auto rounded-full"></div>
          <p className="text-input-element text-sm max-w-2xl mx-auto leading-relaxed pt-2">
            Chez OmniAgri, notre mission est de numériser la chaîne
            d&apos;approvisionnement agricole. Nous créons un environnement
            sécurisé et transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-white border border-separator/5 rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center p-6 space-y-4"
            >
              <div className="flex items-center justify-center text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <div className="space-y-2 w-full">
                <CardTitle className="text-base font-bold text-neutral-800 tracking-tight whitespace-normal">
                  {feature.title}
                </CardTitle>
                <CardContent className="p-0 text-input-element/80 leading-relaxed text-xs px-2">
                  <p>{feature.description}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
