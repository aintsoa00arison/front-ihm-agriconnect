"use client";

import { 
  Building2, MapPin, Phone, Mail, FileText, 
  User, CreditCard, ChevronLeft, ChevronRight, Check, Tractor 
} from 'lucide-react';

interface Props {
  type: 'particulier' | 'entreprise'; // Reçoit le type choisi à l'étape 1
  onBack: () => void;
  onNext: () => void;
}

export default function FournisseurForm({ type, onBack, onNext }: Props) {
  const isEntreprise = type === 'entreprise';

  return (
    <div className="w-full max-w-4xl mx-auto p-2 space-y-4 h-fit animate-in fade-in duration-500">
      
      {/* 1. Stepper Unifié */}
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
          <span className="text-[10px] font-bold text-primary mt-1">Type de profil</span>
        </div>
        <div className="flex-1 h-[1px] bg-separator/30 mx-4 -mt-4"></div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold ring-4 ring-primary/10">2</div>
          <span className="text-[10px] font-bold text-primary mt-1">Informations supplémentaires</span>
        </div>
        <div className="flex-1 h-[1px] bg-separator/30 mx-4 -mt-4"></div>
        <div className="flex flex-col items-center opacity-30">
          <div className="w-8 h-8 rounded-full bg-separator text-label flex items-center justify-center text-sm font-bold">3</div>
          <span className="text-[10px] font-medium mt-1">Finalisation du profil</span>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-separator/10 p-6 md:p-8 space-y-6">
        {/* Titre dynamique centré */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-label uppercase tracking-wider">Information supplémentaire</h2>
          <p className="text-[11px] text-input-element italic">
            {isEntreprise 
              ? "Détails de votre exploitation ou société de production" 
              : "Complétez vos informations personnelles de producteur"}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-6">
          
          {/* --- VUE ENTREPRISE (3 Colonnes) --- */}
          {isEntreprise && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Structure de production</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                  {[
                    { label: "Nom de l'entité", icon: Building2, placeholder: 'Ex: Ferme du Sud' },
                    { label: 'Localisation', icon: MapPin, placeholder: 'Commune, Région' },
                    { label: 'Contact exploitation', icon: Phone, placeholder: '+261 xx xx xxx xx' },
                    { label: 'E-mail contact', icon: Mail, placeholder: 'ferme@exemple.mg' },
                    { label: 'NIF', icon: FileText, placeholder: '10 chiffres' },
                    { label: 'STAT', icon: FileText, placeholder: 'Stats ID' },
                  ].map((f) => (
                    <div key={f.label} className="relative">
                      <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">{f.label}</label>
                      <div className="input-icon-step2"><f.icon size={18} /></div>
                      <input type="text" placeholder={f.placeholder} className="input-auth focus:bg-white text-xs h-10" required />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Responsable</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Nom complet</label>
                    <div className="input-icon-step2"><User size={18}/></div>
                    <input type="text" placeholder="Gérant" className="input-auth focus:bg-white text-xs h-10" required />
                  </div>
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Téléphone direct</label>
                    <div className="input-icon-step2"><Phone size={18}/></div>
                    <input type="tel" placeholder="+261 3x xx xxx xx" className="input-auth focus:bg-white text-xs h-10" required />
                  </div>
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro CIN</label>
                    <div className="input-icon-step2"><CreditCard size={18}/></div>
                    <input type="text" placeholder="CIN ID" className="input-auth focus:bg-white text-xs h-10" required />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VUE PARTICULIER (2 Colonnes - Plus aéré) --- */}
          {!isEntreprise && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Nom et prénom(s)</label>
                <div className="input-icon-step2"><User size={18}/></div>
                <input type="text" placeholder="Votre nom complet" className="input-auth focus:bg-white text-xs h-11" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro de téléphone</label>
                  <div className="input-icon-step2"><Phone size={18}/></div>
                  <input type="tel" placeholder="+261 xx xx xxx xx" className="input-auth focus:bg-white text-xs h-11" required />
                </div>
                <div className="relative">
                  <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro CIN</label>
                  <div className="input-icon-step2"><CreditCard size={18}/></div>
                  <input type="text" placeholder="CIN ID" className="input-auth focus:bg-white text-xs h-11" required />
                </div>
              </div>

              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Adresse postale / Localisation</label>
                <div className="input-icon-step2"><MapPin size={18}/></div>
                <input type="text" placeholder="Ville, Quartier, Lot" className="input-auth focus:bg-white text-xs h-11" required />
              </div>
            </div>
          )}

          {/* SECTION PRODUCTION (Commune aux deux) */}
          <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-separator/10">
            <div className="flex items-center space-x-2 ml-2">
                <Tractor size={14} className="text-label" />
                <span className="text-[10px] font-bold text-label uppercase">Type de production :</span>
            </div>
            <div className="flex gap-6 mr-2">
              {['Végétale', 'Elevage', 'Rente'].map((item) => (
                <label key={item} className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer hidden" />
                    <div className="w-5 h-5 border border-separator/40 rounded peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <Check size={12} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform stroke-[3px]" />
                  </div>
                  <span className="text-xs font-bold text-neutral-700 group-hover:text-primary">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-between pt-4 border-t border-separator/10">
            <button 
              type="button" 
              onClick={onBack} 
              className="px-8 py-2.5 rounded-xl border border-separator/30 text-sm font-bold text-label hover:bg-neutral-50 transition-all flex items-center space-x-2"
            >
              <ChevronLeft size={18} />
              <span>Précédent</span>
            </button>
            <button type="submit" className="btn-primary px-10 py-2.5 text-xs flex items-center space-x-2">
              <span>Suivant</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}