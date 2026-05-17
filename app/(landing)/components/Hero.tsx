"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  const router = useRouter();

  return (
    <section id="accueil" className="w-full bg-neutral pt-16 pb-24 font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16">
        
        {/* --- COLONNE GAUCHE : TEXTE & ACTIONS --- */}
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold text-label leading-[1.1]">
            Réunir les <br />
            <span className="text-primary">Producteurs</span> et les <br />
            <span className="text-tertiary">Collecteurs</span>.
          </h1>

          <p className="text-input-element text-lg leading-relaxed max-w-xl">
            OmniAgri est le premier écosystème numérique conçu pour dynamiser le 
            commerce agricole. Nous facilitons des transactions sécurisées, efficaces et 
            transparentes.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Utilisation du bouton shadcn lié à ta classe globale btn-primary */}
            <Button 
              onClick={() => router.push('/login?mode=register')}
              className="btn-primary font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 outline-none h-auto cursor-pointer"
            >
              Commencer <ArrowRight size={18} />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-input-element text-sm">
              Rejoint par <span className="text-primary font-bold">2 500+</span> producteurs
            </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : IMAGE & TRANSITION CARD --- */}
        <div className="flex-1 relative">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/50">
            <Image 
              src="/hero-agri.jpg" 
              alt="Agriculture"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Badge Qualité converti en Card shadcn */}
          <Card className="absolute -bottom-8 left-6 bg-white border border-separator/10 rounded-[24px] shadow-2xl min-w-[320px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="p-5 flex items-center gap-4">
              
              {/* Conteneur d'icône aux couleurs tertiaires */}
              <div className="w-14 h-14 bg-[#FFEFD7] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="text-tertiary w-7 h-7 fill-tertiary text-white" />
              </div>

              <div className="flex flex-col flex-1">
                <p className="text-[12px] text-input-element font-bold uppercase tracking-tight">
                  Qualité Garantie
                </p>
                <p className="text-2xl font-black text-label leading-none mt-0.5">
                  99.8% Succès
                </p>
                
                {/* Remplacement par le composant Progress natif de shadcn */}
                <div className="mt-3">
                  <Progress value={90} className="h-[6px] bg-gray-100" />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}