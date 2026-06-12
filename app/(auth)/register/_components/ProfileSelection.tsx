"use client";

import { useState } from 'react';
import { Tractor, Truck, ChevronRight } from 'lucide-react';
import { Stepper } from "@/components/ui/stepper";
// Importation des composants racines RadioGroup
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  onNext: (role: 'fournisseur' | 'collecteur', subType: 'particulier' | 'entreprise') => void;
}

export default function RegisterProfileSelection({ onNext }: Props) {
  const [role, setRole] = useState<'fournisseur' | 'collecteur'>('fournisseur');
  const [subType, setSubType] = useState<'particulier' | 'entreprise'>('particulier');

  const registerSteps = ["Type de rôle", "Informations supplémentaires", "Finalisation du profil"];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 h-fit animate-in fade-in duration-500">
      
      <Stepper steps={registerSteps} currentStep={1} />

      <div className="bg-white rounded-auth shadow-sm border border-separator/10 p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 font-manrope">
            Vous êtes :
          </h2>
          <p className="text-input-element text-[10px] sm:text-[11px] px-4 sm:px-6">
            Choisissez votre rôle pour accéder aux outils adaptés.
          </p>
        </div>

        {/* Sélection principale (Rôle) - Gauche/Droite sur desktop, empilé sur mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setRole('fournisseur')}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-2 cursor-pointer ${
              role === 'fournisseur' ? 'border-primary bg-light-bg/5 shadow-sm' : 'border-separator/20 bg-white hover:border-primary/50'
            }`}
          >
            <div className={`p-2 sm:p-3 rounded-full transition-all ${
              role === 'fournisseur' ? 'bg-primary text-white' : 'bg-neutral-100 text-label'
            }`}>
              <Tractor size={20} />
            </div>
            <h3 className={`font-bold text-xs sm:text-sm ${
              role === 'fournisseur' ? 'text-primary' : 'text-neutral-800'
            }`}>
              Fournisseur
            </h3>
            <p className="text-[8px] sm:text-[9px] text-input-element leading-tight">
              Vendre mes produits agricoles
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole('collecteur')}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-2 cursor-pointer ${
              role === 'collecteur' ? 'border-primary bg-light-bg/5 shadow-sm' : 'border-separator/20 bg-white hover:border-primary/50'
            }`}
          >
            <div className={`p-2 sm:p-3 rounded-full transition-all ${
              role === 'collecteur' ? 'bg-primary text-white' : 'bg-neutral-100 text-label'
            }`}>
              <Truck size={20} />
            </div>
            <h3 className={`font-bold text-xs sm:text-sm ${
              role === 'collecteur' ? 'text-primary' : 'text-neutral-800'
            }`}>
              Collecteur
            </h3>
            <p className="text-[8px] sm:text-[9px] text-input-element leading-tight">
              Acheter aux producteurs
            </p>
          </button>
        </div>

        {/* Sous-type avec Shadcn RadioGroup - Responsive */}
        {role === 'fournisseur' ? (
          <div className="bg-neutral-50/50 p-3 sm:p-4 rounded-xl border border-separator/10 space-y-3 animate-in fade-in duration-300">
            <p className="text-[9px] sm:text-[10px] font-bold text-label uppercase tracking-widest text-center">
              Type de fournisseur
            </p>
            
            <RadioGroup 
              value={subType} 
              onValueChange={(value) => setSubType(value as 'particulier' | 'entreprise')}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3"
            >
              {/* Option Particulier */}
              <label 
                className={`flex-1 flex items-center p-2 sm:p-3 bg-white border rounded-lg cursor-pointer transition-all ${
                  subType === 'particulier' ? 'border-primary shadow-sm' : 'border-separator/30 hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="particulier" id="particulier" className="mr-2 sm:mr-3" />
                <span className="text-[11px] sm:text-xs font-bold text-neutral-800 select-none">
                  Particulier
                </span>
              </label>
              
              {/* Option Entreprise */}
              <label 
                className={`flex-1 flex items-center p-2 sm:p-3 bg-white border rounded-lg cursor-pointer transition-all ${
                  subType === 'entreprise' ? 'border-primary shadow-sm' : 'border-separator/30 hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="entreprise" id="entreprise" className="mr-2 sm:mr-3" />
                <span className="text-[11px] sm:text-xs font-bold text-neutral-800 select-none">
                  Entreprise
                </span>
              </label>
            </RadioGroup>
          </div>
        ) : (
          <div className="h-[70px] sm:h-[82px] flex items-center justify-center border border-dashed border-separator/20 rounded-xl bg-neutral-50/30">
            <p className="text-[10px] sm:text-[11px] text-input-element italic text-center px-4 sm:px-10">
              Accès direct au compte acheteur.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button 
            type="button"
            onClick={() => onNext(role, subType)} 
            className="btn-primary w-full sm:w-auto md:w-40 py-2.5 sm:py-3 px-4 sm:px-6 flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <span>Suivant</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}