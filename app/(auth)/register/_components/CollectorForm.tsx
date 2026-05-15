"use client";

import { useState } from 'react';
import { 
  Building2, MapPin, Phone, Mail, FileText, 
  User, CreditCard, ChevronLeft, ChevronRight, Check 
} from 'lucide-react';

interface Props {
  onBack: () => void;
  // Modification pour passer les données récoltées au composant parent
  onNext: (data: any) => void;
}

export default function CollectorForm({ onBack, onNext }: Props) {
  // 1. États pour les inputs textuels
  const [formData, setFormData] = useState({
    raisonSociale: '',
    siegeSocial: '',
    telephonePro: '',
    emailPro: '',
    nif: '',
    stat: '',
    nomComplet: '',
    telephoneDirect: '',
    cin: ''
  });

  // 2. État pour la liste des besoins cochés
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  // Gestionnaire des changements textuels
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gestionnaire des cases à cocher (Besoins)
  const handleCheckboxChange = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(item => item !== need) 
        : [...prev, need]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Regroupement propre des données pour le parent / backend
    const dataToSubmit = {
      entreprise: {
        raison_sociale: formData.raisonSociale,
        siege_social: formData.siegeSocial,
        telephone_pro: formData.telephonePro,
        email_pro: formData.emailPro,
        nif: formData.nif,
        stat: formData.stat,
      },
      representant_legal: {
        nom_complet: formData.nomComplet,
        telephone_direct: formData.telephoneDirect,
        cin: formData.cin,
      },
      besoins: selectedNeeds
    };

    onNext(dataToSubmit);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 space-y-4 h-fit animate-in fade-in duration-500">
      
      {/* Stepper */}
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
          <span className="text-[10px] font-bold text-primary mt-1">Type de rôle</span>
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
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-label uppercase tracking-wider">Information supplémentaire</h2>
          <p className="text-[11px] text-input-element italic">Détails professionnels de votre compte collecteur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION ENTREPRISE */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Entreprise</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
              {[
                { label: 'Raison sociale', key: 'raisonSociale', icon: Building2, placeholder: 'Ex: Agritrade', type: 'text' },
                { label: 'Siège social', key: 'siegeSocial', icon: MapPin, placeholder: 'Ville, Quartier', type: 'text' },
                { label: 'Téléphone pro', key: 'telephonePro', icon: Phone, placeholder: '034 xx xxx xx', type: 'tel' },
                { label: 'E-mail pro', key: 'emailPro', icon: Mail, placeholder: 'contact@cie.com', type: 'email' },
                { label: 'NIF', key: 'nif', icon: FileText, placeholder: '10 chiffres', type: 'text' },
                { label: 'STAT', key: 'stat', icon: FileText, placeholder: 'Stats ID', type: 'text' },
              ].map((f) => (
                <div key={f.key} className="relative">
                  <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">{f.label}</label>
                  <div className="input-icon-step2"><f.icon size={18} /></div>
                  <input 
                    type={f.type} 
                    placeholder={f.placeholder} 
                    className="input-auth focus:bg-white text-xs h-10" 
                    value={(formData as any)[f.key]}
                    onChange={(e) => handleInputChange(f.key, e.target.value)}
                    required 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION REPRÉSENTANT */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Représentant légal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Nom complet</label>
                <div className="input-icon-step2"><User size={18}/></div>
                <input 
                  type="text" 
                  placeholder="Prénoms & Nom" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.nomComplet}
                  onChange={(e) => handleInputChange('nomComplet', e.target.value)}
                  required 
                />
              </div>
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Téléphone direct</label>
                <div className="input-icon-step2"><Phone size={18}/></div>
                <input 
                  type="tel" 
                  placeholder="032 xx xxx xx" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.telephoneDirect}
                  onChange={(e) => handleInputChange('telephoneDirect', e.target.value)}
                  required 
                />
              </div>
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro CIN</label>
                <div className="input-icon-step2"><CreditCard size={18}/></div>
                <input 
                  type="text" 
                  placeholder="CIN ID" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.cin}
                  onChange={(e) => handleInputChange('cin', e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          {/* BESOINS */}
          <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-separator/10">
            <span className="text-[10px] font-bold text-label uppercase ml-2">Besoin :</span>
            <div className="flex gap-6 mr-2">
              {['Végétale', 'Elevage', 'Rente'].map((item) => (
                <label key={item} className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer hidden" 
                      checked={selectedNeeds.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
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
            <button 
              type="submit" 
              className="btn-primary px-10 py-2.5 text-xs flex items-center space-x-2"
            >
              <span>Suivant</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}