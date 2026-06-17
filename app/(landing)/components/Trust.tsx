"use client";

import Image from "next/image";
import { UserCheck, Star, Gavel, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Trust() {
  const trustFeatures = [
    {
      icon: <UserCheck className="text-primary" size={24} />,
      title: "Identités Vérifiées",
      description: "Vérification KYC et d'entreprise pour tous les membres.",
    },
    {
      icon: <Star className="text-primary" size={24} />,
      title: "Système de Notation",
      description: "Retours transparents après chaque transaction.",
    },
    {
      icon: <Gavel className="text-primary" size={24} />,
      title: "Résolution de Litiges",
      description: "Médiation équitable pour tout désaccord contractuel.",
    },
    {
      icon: <ClipboardCheck className="text-primary" size={24} />,
      title: "Contrôles Qualité",
      description: "Services optionnels d'inspection par des tiers.",
    },
  ];

  return (
    <section className="w-full bg-background py-16 sm:py-20 md:py-24 font-sans select-none">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-[1.2] space-y-8 sm:space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-label">
                La confiance est notre priorité.
              </h2>
              <p className="text-input-element text-base sm:text-lg leading-relaxed max-w-2xl">
                Nous savons qu&apos;en agriculture, la fiabilité est primordiale.
                C&apos;est pourquoi nous avons intégré un système de confiance
                multicouche au cœur de notre plateforme.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-label tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="text-input-element text-sm leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row lg:flex-col gap-6 w-full">
            <div className="relative rounded-[32px] overflow-hidden shadow-xl h-64 lg:h-80 w-full md:w-1/2 lg:w-full shrink-0 border-3 border-border group">
              <Image
                src="/images/landing/trust.jpeg"
                alt="Fiabilité Agricole"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                height={736}
                width={736}
              />
            </div>

            <div className="flex flex-col gap-6 w-full md:w-1/2 lg:w-auto">
              <Card className="bg-secondary p-0 border-0 rounded-[24px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-center min-w-50 overflow-hidden">
                <CardContent className="p-6 flex flex-col">
                  <span className="text-4xl font-black tracking-tight">
                    4.9/5
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">
                    Note Plateforme
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-primary p-0 border-0 rounded-[24px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-center min-w-50 overflow-hidden">
                <CardContent className="p-6 flex flex-col">
                  <span className="text-4xl font-black tracking-tight">
                    50k+
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">
                    Échanges Vérifiés
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
