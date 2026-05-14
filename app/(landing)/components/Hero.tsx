// components/Hero.tsx
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { PiSealCheckFill } from "react-icons/pi"; 

export default function Hero() {
  return (
    // Ajout de l'ID "accueil" ici pour l'ancrage
    <section id="accueil" className="w-full bg-neutral pt-16 pb-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16">
        
        {/* --- COLONNE GAUCHE : TEXTE --- */}
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold text-label leading-[1.1]">
            Réunir les <br />
            <span className="text-primary">Producteurs</span> et les <br />
            <span className="text-tertiary">Collecteurs</span>.
          </h1>

          <p className="text-input-element text-lg leading-relaxed max-w-xl">
            AgriConnect est le premier écosystème numérique conçu pour dynamiser le 
            commerce agricole. Nous facilitons des transactions sécurisées, efficaces et 
            transparentes.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95">
              Commencer <HiArrowRight className="text-xl" />
            </button>
            <button className="bg-white border border-input-border text-label px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all">
              En savoir plus
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-input-element text-sm">
              Rejoint par <span className="text-primary font-bold">2 500+</span> producteurs
            </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : IMAGE & BADGE --- */}
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

          {/* Badge Qualité (Positionné sur l'image) */}
          <div className="absolute -bottom-8 left-6 bg-white p-5 pr-10 rounded-[24px] shadow-2xl flex items-center gap-4 min-w-[320px]">
            
            {/* Cercle de fond beige avec l'icône marron (Tertiary) */}
            <div className="w-14 h-14 bg-[#FFEFD7] rounded-full flex items-center justify-center flex-shrink-0">
              <PiSealCheckFill className="text-tertiary text-3xl" />
            </div>

            <div className="flex flex-col flex-1">
              <p className="text-[12px] text-[#4A4A4A] font-bold uppercase tracking-tight">
                Qualité Garantie
              </p>
              <p className="text-2xl font-extrabold text-[#1a1a1a]">
                99.8% Succès
              </p>
              
              {/* Barre de progression marron épaisse (Tertiary) */}
              <div className="mt-3 w-full bg-gray-100 h-[6px] rounded-full overflow-hidden">
                <div 
                  className="bg-tertiary h-full rounded-full" 
                  style={{ width: '90%' }} 
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}