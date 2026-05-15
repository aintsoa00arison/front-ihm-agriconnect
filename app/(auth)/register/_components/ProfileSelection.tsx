"use client";

import { useState } from 'react';
import { Tractor, Truck, ChevronRight } from 'lucide-react';

interface Props {
  // Changement du nom du paramètre pour s'aligner sur le backend
  onNext: (role: 'fournisseur' | 'collecteur', subType: 'particulier' | 'entreprise') => void;
}

export default function RegisterProfileSelection({ onNext }: Props) {
 
  const [role, setRole] = useState<'fournisseur' | 'collecteur'>('fournisseur');
  const [subType, setSubType] = useState<'particulier' | 'entreprise'>('particulier');

  return (
    <div className="w-full max-w-4xl mx-auto p-2 space-y-6 h-fit animate-in fade-in duration-500">
      
      {/* Stepper */}
      <div className="flex items-center justify-between px-6 mb-4 mt-2">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
          <span className="text-[10px] font-bold text-primary mt-1">Type de rôle</span>
        </div>
        <div className="flex-1 h-[1px] bg-separator/30 mx-4 -mt-4"></div>
        <div className="flex flex-col items-center opacity-30">
          <div className="w-8 h-8 rounded-full bg-separator text-label flex items-center justify-center text-sm font-bold">2</div>
          <span className="text-[10px] font-medium mt-1">Informations supplémentaires</span>
        </div>
        <div className="flex-1 h-[1px] bg-separator/30 mx-4 -mt-4"></div>
        <div className="flex flex-col items-center opacity-30">
          <div className="w-8 h-8 rounded-full bg-separator text-label flex items-center justify-center text-sm font-bold">3</div>
          <span className="text-[10px] font-medium mt-1">Finalisation du profil</span>
        </div>
      </div>

      {/* Conteneur de sélection */}
      <div className="bg-white rounded-[20px] shadow-sm border border-separator/10 p-6 md:p-10 space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-neutral-800">Vous êtes :</h2>
          <p className="text-input-element text-[11px] px-6">Choisissez votre rôle pour accéder aux outils adaptés.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole('fournisseur')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-2 ${role === 'fournisseur' ? 'border-primary bg-light-bg/5 shadow-sm' : 'border-separator/20 bg-white'}`}
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
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-2 ${role === 'collecteur' ? 'border-primary bg-light-bg/5 shadow-sm' : 'border-separator/20 bg-white'}`}
          >
            <div className={`p-3 rounded-full ${role === 'collecteur' ? 'bg-primary text-white' : 'bg-neutral-100 text-label'}`}>
              <Truck size={24} />
            </div>
            <h3 className={`font-bold text-sm ${role === 'collecteur' ? 'text-primary' : 'text-neutral-800'}`}>Collecteur</h3>
            <p className="text-[9px] text-input-element leading-tight">Acheter aux producteurs</p>
          </button>
        </div>

        {role === 'fournisseur' ? (
          <div className="bg-neutral-50/50 p-4 rounded-xl border border-separator/10 space-y-3 animate-in fade-in duration-300">
            <p className="text-[10px] font-bold text-label uppercase tracking-widest text-center">Type de fournisseur</p>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center p-3 bg-white border rounded-lg cursor-pointer transition-all ${subType === 'particulier' ? 'border-primary shadow-sm' : 'border-separator/30'}`}>
                <input type="radio" className="hidden" checked={subType === 'particulier'} onChange={() => setSubType('particulier')} />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${subType === 'particulier' ? 'border-primary bg-primary' : 'border-separator'}`}>
                  {subType === 'particulier' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-bold">Particulier</span>
              </label>
              <label className={`flex-1 flex items-center p-3 bg-white border rounded-lg cursor-pointer transition-all ${subType === 'entreprise' ? 'border-primary shadow-sm' : 'border-separator/30'}`}>
                <input type="radio" className="hidden" checked={subType === 'entreprise'} onChange={() => setSubType('entreprise')} />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${subType === 'entreprise' ? 'border-primary bg-primary' : 'border-separator'}`}>
                  {subType === 'entreprise' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-bold">Entreprise</span>
              </label>
            </div>
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