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
    <div className="w-full max-w-4xl mx-auto p-2 space-y-6 h-fit animate-in fade-in duration-500">
      
      <Stepper steps={registerSteps} currentStep={1} />

      <div className="bg-white rounded-auth shadow-sm border border-separator/10 p-6 md:p-10 space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-neutral-800 font-manrope">Vous êtes :</h2>
          <p className="text-input-element text-[11px] px-6">Choisissez votre rôle pour accéder aux outils adaptés.</p>
        </div>

        {/* Sélection principale (Rôle) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole('fournisseur')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-2 cursor-pointer ${
              role === 'fournisseur' ? 'border-primary bg-light-bg/5 shadow-sm' : 'border-separator/20 bg-white'
            }`}
          >
            <div className={`p-3 rounded-full ${role === 'fournisseur' ? 'bg-primary text-white' : 'bg-neutral-100 text-label'}`}>
              <Tractor size={24} />
            </div>
            <h3 className={`font-bold text-sm ${role === 'fournisseur' ? 'text-primary' : 'text-neutral-800'}`}>Fournisseur</h3>
            <p className="text-[9px] text-input-element leading-tight">Vendre mes produits agricoles</p>
          </button>

          <button
            type="button"
            onClick={() => setRole('collecteur')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-2 cursor-pointer ${
              role === 'collecteur' ? 'border-primary bg-light-bg/5 shadow-sm' : 'border-separator/20 bg-white'
            }`}
          >
            <div className={`p-3 rounded-full ${role === 'collecteur' ? 'bg-primary text-white' : 'bg-neutral-100 text-label'}`}>
              <Truck size={24} />
            </div>
            <h3 className={`font-bold text-sm ${role === 'collecteur' ? 'text-primary' : 'text-neutral-800'}`}>Collecteur</h3>
            <p className="text-[9px] text-input-element leading-tight">Acheter aux producteurs</p>
          </button>
        </div>

        {/* Sous-type avec Shadcn RadioGroup */}
        {role === 'fournisseur' ? (
          <div className="bg-neutral-50/50 p-4 rounded-xl border border-separator/10 space-y-3 animate-in fade-in duration-300">
            <p className="text-[10px] font-bold text-label uppercase tracking-widest text-center">Type de fournisseur</p>
            
            <RadioGroup 
              value={subType} 
              onValueChange={(value) => setSubType(value as 'particulier' | 'entreprise')}
              className="flex gap-3"
            >
              {/* Option Particulier */}
              <label 
                className={`flex-1 flex items-center p-3 bg-white border rounded-lg cursor-pointer transition-all ${
                  subType === 'particulier' ? 'border-primary shadow-sm' : 'border-separator/30'
                }`}
              >
                <RadioGroupItem value="particulier" id="particulier" className="mr-3" />
                <span className="text-xs font-bold text-neutral-800 select-none">Particulier</span>
              </label>
              
              {/* Option Entreprise */}
              <label 
                className={`flex-1 flex items-center p-3 bg-white border rounded-lg cursor-pointer transition-all ${
                  subType === 'entreprise' ? 'border-primary shadow-sm' : 'border-separator/30'
                }`}
              >
                <RadioGroupItem value="entreprise" id="entreprise" className="mr-3" />
                <span className="text-xs font-bold text-neutral-800 select-none">Entreprise</span>
              </label>
            </RadioGroup>
          </div>
        ) : (
          <div className="h-[82px] flex items-center justify-center border border-dashed border-separator/20 rounded-xl bg-neutral-50/30">
            <p className="text-[11px] text-input-element italic text-center px-10">Accès direct au compte acheteur.</p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button 
            type="button"
            onClick={() => onNext(role, subType)} 
            className="btn-primary w-full md:w-40 py-3 flex items-center justify-center space-x-2 text-xs font-bold shadow-lg shadow-primary/20"
          >
            <span>Suivant</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}