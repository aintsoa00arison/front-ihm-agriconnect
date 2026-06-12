"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  const router = useRouter();

  return (
    <section
      id="accueil"
      className="w-full bg-background pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 font-sans select-none overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 md:gap-16">
        
        {/* --- COLONNE GAUCHE : TEXTE (visible sur tous les écrans) --- */}
        <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-label leading-[1.2] sm:leading-[1.1]">
            Réunir les <br className="hidden sm:block" />
            <span className="text-primary">Producteurs</span>{" "}
            <br className="hidden sm:block" />
            et les <br className="hidden sm:block" />
            <span className="text-tertiary">Collecteurs</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-input-element leading-relaxed max-w-xl mx-auto lg:mx-0">
            OmniAgri est le premier écosystème numérique conçu pour dynamiser le
            commerce agricole. Nous facilitons des transactions sécurisées,
            efficaces et transparentes.
          </p>
        </div>

        {/* --- COLONNE DROITE : IMAGE (visible sur desktop, cachée sur mobile/tablette) --- */}
        <div className="hidden lg:block flex-1 relative">
          <div className="rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl border-4 sm:border-8 border-white/50">
            <Image
              src="/images/landing/hero.png"
              alt="Agriculture"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Badge Qualité */}
          <Card className="absolute -bottom-6 sm:-bottom-8 left-6 bg-white border border-separator/10 rounded-[20px] sm:rounded-[24px] shadow-2xl min-w-[280px] sm:min-w-[320px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#FFEFD7] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-tertiary w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 fill-tertiary text-white" />
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-[10px] sm:text-[12px] text-input-element font-bold uppercase tracking-tight">
                  Qualité Garantie
                </p>
                <p className="text-xl sm:text-2xl font-black text-label leading-none mt-0.5">
                  99.8% Succès
                </p>
                <div className="mt-2 sm:mt-3">
                  <Progress value={90} className="h-[4px] sm:h-[6px] bg-gray-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- SECTION MOBILE : IMAGE + STATS + BOUTON (visible seulement sur mobile/tablette) --- */}
      <div className="lg:hidden mt-8 sm:mt-12">
        {/* Image */}
        <div className="px-4 sm:px-6 mb-6 sm:mb-8">
          <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/50 relative">
            <Image
              src="/images/landing/hero.png"
              alt="Agriculture"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            
            {/* Badge Qualité pour mobile (superposé sur l'image) */}
            <Card className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-separator/10 rounded-[20px] shadow-2xl min-w-[280px] w-[90%] overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFEFD7] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-tertiary w-5 h-5 fill-tertiary text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-[10px] text-input-element font-bold uppercase tracking-tight">
                    Qualité Garantie
                  </p>
                  <p className="text-xl font-black text-label leading-none mt-0.5">
                    99.8% Succès
                  </p>
                  <div className="mt-2">
                    <Progress value={90} className="h-[4px] bg-gray-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nombre d'utilisateurs */}
        <div className="flex items-center justify-center gap-4 px-4 sm:px-6 mb-6 sm:mb-8">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm"
              >
                <img
                  src={`https://i.pravatar.cc/100?u=${i}`}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-input-element">
            Rejoint par{" "}
            <span className="text-primary font-bold">2 500+</span>{" "}
            producteurs
          </p>
        </div>

        {/* Bouton */}
        <div className="flex justify-center px-4 sm:px-6">
          <Button
            onClick={() => router.push("/login?mode=register")}
            className="btn-primary font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 outline-none h-auto cursor-pointer w-full sm:w-auto"
          >
            Commencer <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      {/* --- VERSION DESKTOP : BOUTON ET STATS (cachés sur mobile) --- */}
      <div className="hidden lg:block mt-8 lg:mt-0">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button
              onClick={() => router.push("/login?mode=register")}
              className="btn-primary font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 outline-none h-auto cursor-pointer"
            >
              Commencer <ArrowRight size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-8 justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-input-element">
              Rejoint par{" "}
              <span className="text-primary font-bold">2 500+</span>{" "}
              producteurs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}