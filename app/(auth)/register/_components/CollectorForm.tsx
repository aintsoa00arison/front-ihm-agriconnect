"use client";

import { Building2, MapPin, Phone, Mail, FileText, User, CreditCard, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export default function CollectorInfoForm({ onBack, onNext }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Stepper Original (Identique à l'étape 1) */}
      <div className="flex items-center justify-center space-x-4 mb-10">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">1</div>
          <span className="text-xs font-medium text-primary mt-2">Type du profil</span>
        </div>
        <div className="w-20 h-[2px] bg-primary -mt-6"></div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold ring-4 ring-primary/10">2</div>
          <span className="text-xs font-bold text-primary mt-2">Informations supplémentaires</span>
        </div>
        <div className="w-20 h-[2px] bg-separator/30 -mt-6"></div>
        <div className="flex flex-col items-center opacity-40">
          <div className="w-10 h-10 rounded-full bg-separator text-label flex items-center justify-center font-bold">3</div>
          <span className="text-xs font-medium text-label mt-2">Finalisation du profil</span>
        </div>
      </div>

      {/* 2. Formulaire Compact */}
      <div className="bg-white rounded-[25px] shadow-sm border border-separator/10 p-8 md:p-10 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Information supplémentaire</h2>
          <p className="text-xs text-input-element italic mt-1">Veuillez compléter les détails de votre entreprise</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-8">
          
          {/* SECTION ENTREPRISE - 3 Colonnes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-2">Entreprise</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              {[
                { label: 'Raison sociale', icon: Building2, placeholder: 'Ex: Agritrade' },
                { label: 'Siège social', icon: MapPin, placeholder: 'Ville, Quartier' },
                { label: 'Téléphone', icon: Phone, placeholder: '034 xx xxx xx' },
                { label: 'E-mail', icon: Mail, placeholder: 'contact@cie.com' },
                { label: 'NIF', icon: FileText, placeholder: '10 chiffres' },
                { label: 'STAT', icon: FileText, placeholder: 'Stats ID' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[11px] font-bold text-label mb-1.5 block ml-1">{f.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-input-element/40">
                      <f.icon size={16}/>
                    </div>
                    <input 
                      type="text" 
                      placeholder={f.placeholder} 
                      className="input-auth-compact pl-12 text-xs h-11" 
                      required 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION REPRÉSENTANT - Layout 3 Colonnes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-2">Représentant légal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[11px] font-bold text-label mb-1.5 block ml-1">Nom complet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-input-element/40"><User size={16}/></div>
                  <input type="text" placeholder="Prénoms & Nom" className="input-auth-compact pl-12 text-xs h-11" required />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-label mb-1.5 block ml-1">Téléphone direct</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-input-element/40"><Phone size={16}/></div>
                  <input type="tel" placeholder="032 xx xxx xx" className="input-auth-compact pl-12 text-xs h-11" required />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-label mb-1.5 block ml-1">Numéro CIN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-input-element/40"><CreditCard size={16}/></div>
                  <input type="text" placeholder="CIN ID" className="input-auth-compact pl-12 text-xs h-11" required />
                </div>
              </div>
            </div>
          </div>

          {/* PRÉFÉRENCES - Cliquable et Clair */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-label uppercase tracking-wider">Types de produits recherchés</p>
            <div className="flex flex-wrap gap-4 pt-1">
              {['Végétale', 'Elevage', 'Rente'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer group bg-neutral-50 hover:bg-neutral-100/80 px-4 py-3 rounded-xl border border-separator/20 transition-all">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer hidden" />
                    <div className="w-5 h-5 border-2 border-separator/40 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <Check size={14} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform stroke-[3px]" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-between pt-6 border-t border-separator/10">
            <button 
              type="button" 
              onClick={onBack} 
              className="flex items-center space-x-2 px-6 py-2 border border-separator/30 rounded-xl text-sm font-bold text-label hover:bg-neutral-50 transition-all"
            >
              <ChevronLeft size={18} />
              <span>Précédent</span>
            </button>
            <button 
              type="submit" 
              className="btn-primary px-12 py-3 text-sm flex items-center space-x-2 shadow-lg shadow-primary/20"
            >
              <span>Finaliser</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}