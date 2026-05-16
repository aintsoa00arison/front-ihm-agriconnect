"use client";

import { useState } from 'react';
import { 
  Building2, MapPin, Phone, Mail, FileText, 
  User, CreditCard, ChevronLeft, ChevronRight, Check, AlertTriangle 
} from 'lucide-react';
import { 
  validateEmail, 
  validatePhone, 
  validateNif, 
  validateCin, 
  validateStat 
} from '.././../../utils/validation';

interface Props {
  initialData: any; // Ajout de la prop pour la mémoire du formulaire
  onBack: () => void;
  onNext: (data: any) => void;
}

export default function CollectorForm({ initialData, onBack, onNext }: Props) {
  // 1. États pour les inputs textuels initialisés avec initialData si disponible
  const [formData, setFormData] = useState({
    raisonSociale: initialData?.entreprise?.raison_sociale || '',
    siegeSocial: initialData?.entreprise?.siege_social || '',
    telephonePro: initialData?.entreprise?.telephone_pro || '',
    emailPro: initialData?.entreprise?.email_pro || '',
    nif: initialData?.entreprise?.nif || '',
    stat: initialData?.entreprise?.stat || '',
    nomComplet: initialData?.representant_legal?.nom_complet || '',
    telephoneDirect: initialData?.representant_legal?.telephone_direct || '',
    cin: initialData?.representant_legal?.cin || ''
  });

  // 2. État pour la liste des besoins cochés réhydraté depuis initialData
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(initialData?.besoins || []);

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

  // --- VALIDATIONS EN TEMPS RÉEL (Via fichier utils) ---
  const isEmailValid = validateEmail(formData.emailPro);
  const isPhoneProValid = validatePhone(formData.telephonePro);
  const isPhoneDirectValid = validatePhone(formData.telephoneDirect);
  const isNifValid = validateNif(formData.nif);
  const isCinValid = validateCin(formData.cin);
  const isStatValid = validateStat(formData.stat);

  // Blocage global si une erreur est détectée
  const hasErrors = !isEmailValid || !isPhoneProValid || !isPhoneDirectValid || !isNifValid || !isCinValid || !isStatValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors) return;
    
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
              
              {/* Raison Sociale */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Raison sociale</label>
                <div className="input-icon-step2"><Building2 size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Ex: Agritrade" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.raisonSociale}
                  onChange={(e) => handleInputChange('raisonSociale', e.target.value)}
                  required 
                />
              </div>

              {/* Siège Social */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Siège social</label>
                <div className="input-icon-step2"><MapPin size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Ville, Quartier" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.siegeSocial}
                  onChange={(e) => handleInputChange('siegeSocial', e.target.value)}
                  required 
                />
              </div>

              {/* Téléphone Pro */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Téléphone pro</label>
                <div className="input-icon-step2"><Phone size={18} /></div>
                <input 
                  type="tel" 
                  placeholder="034 xx xxx xx" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.telephonePro}
                  onChange={(e) => handleInputChange('telephonePro', e.target.value)}
                  maxLength={10}
                  required 
                />
                {!isPhoneProValid && (
                  <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={11} /> Requis : 10 chiffres.
                  </p>
                )}
              </div>

              {/* E-mail Pro */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">E-mail pro</label>
                <div className="input-icon-step2"><Mail size={18} /></div>
                <input 
                  type="email" 
                  placeholder="contact@cie.com" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.emailPro}
                  onChange={(e) => handleInputChange('emailPro', e.target.value)}
                  required 
                />
                {!isEmailValid && (
                  <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={11} /> Adresse e-mail invalide.
                  </p>
                )}
              </div>

              {/* NIF */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">NIF</label>
                <div className="input-icon-step2"><FileText size={18} /></div>
                <input 
                  type="text" 
                  placeholder="10 chiffres" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value)}
                  maxLength={10}
                  required 
                />
                {!isNifValid && (
                  <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={11} /> Requis : 10 chiffres.
                  </p>
                )}
              </div>

              {/* STAT */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">STAT</label>
                <div className="input-icon-step2"><FileText size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Stats ID" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.stat}
                  onChange={(e) => handleInputChange('stat', e.target.value)}
                  required 
                />
                {!isStatValid && (
                  <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={11} /> Identifiant trop court (min. 5).
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* SECTION REPRÉSENTANT */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Représentant légal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Nom Complet */}
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

              {/* Téléphone Direct */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Téléphone direct</label>
                <div className="input-icon-step2"><Phone size={18}/></div>
                <input 
                  type="tel" 
                  placeholder="032 xx xxx xx" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.telephoneDirect}
                  onChange={(e) => handleInputChange('telephoneDirect', e.target.value)}
                  maxLength={10}
                  required 
                />
                {!isPhoneDirectValid && (
                  <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={11} /> Requis : 10 chiffres.
                  </p>
                )}
              </div>

              {/* Numéro CIN */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro CIN</label>
                <div className="input-icon-step2"><CreditCard size={18}/></div>
                <input 
                  type="text" 
                  placeholder="CIN ID" 
                  className="input-auth focus:bg-white text-xs h-10" 
                  value={formData.cin}
                  onChange={(e) => handleInputChange('cin', e.target.value)}
                  maxLength={12}
                  required 
                />
                {!isCinValid && (
                  <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={11} /> Requis : 12 chiffres.
                  </p>
                )}
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
              disabled={hasErrors}
              className="btn-primary px-10 py-2.5 text-xs flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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