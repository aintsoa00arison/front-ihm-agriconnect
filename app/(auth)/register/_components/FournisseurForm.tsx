"use client";

import { useState } from 'react';
import { 
  Building2, MapPin, Phone, Mail, FileText, 
  User, CreditCard, ChevronLeft, ChevronRight, Check, Tractor, AlertTriangle 
} from 'lucide-react';
import { 
  validateEmail, 
  validatePhone, 
  validateNif, 
  validateCin, 
  validateStat,
  formatPhone,
  formatCin
} from '.././../../utils/validation'; 

interface Props {
  type: 'particulier' | 'entreprise'; // Choix de l'étape 1
  initialData: any; // Données pré-remplies pour réhydratation des champs
  onBack: () => void;
  onNext: (data: any) => void; 
}

export default function FournisseurForm({ type, initialData, onBack, onNext }: Props) {
  const isEntreprise = type === 'entreprise';

  // 1. États pour la totalité des champs, réhydratés dynamiquement selon initialData
  const [formData, setFormData] = useState({
    // Champs Entreprise
    nomEntite: initialData?.type === 'entreprise' ? initialData.structure?.nom_entite || '' : '',
    localisationEntite: initialData?.type === 'entreprise' ? initialData.structure?.localisation || '' : '',
    contactExploitation: initialData?.type === 'entreprise' ? initialData.structure?.contact_exploitation || '' : '',
    emailContact: initialData?.type === 'entreprise' ? initialData.structure?.email_contact || '' : '',
    nif: initialData?.type === 'entreprise' ? initialData.structure?.nif || '' : '',
    stat: initialData?.type === 'entreprise' ? initialData.structure?.stat || '' : '',
    nomResponsable: initialData?.type === 'entreprise' ? initialData.responsable?.nom_complet || '' : '',
    telephoneResponsable: initialData?.type === 'entreprise' ? initialData.responsable?.telephone_direct || '' : '',
    cinResponsable: initialData?.type === 'entreprise' ? initialData.responsable?.cin || '' : '',
    
    // Champs Particulier
    nomParticulier: initialData?.type === 'particulier' ? initialData.profil?.nom_complet || '' : '',
    telephoneParticulier: initialData?.type === 'particulier' ? initialData.profil?.telephone || '' : '',
    cinParticulier: initialData?.type === 'particulier' ? initialData.profil?.cin || '' : '',
    localisationParticulier: initialData?.type === 'particulier' ? initialData.profil?.localisation || '' : ''
  });

  // État pour les types de production cochés réhydraté depuis initialData
  const [selectedProductions, setSelectedProductions] = useState<string[]>(initialData?.productions || []);

  // Gestionnaire des changements textuels
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gestionnaire des cases à cocher (Productions)
  const handleCheckboxChange = (prod: string) => {
    setSelectedProductions(prev => 
      prev.includes(prod) ? prev.filter(item => item !== prod) : [...prev, prod]
    );
  };

  // --- VALIDATIONS DYNAMIQUES EN TEMPS RÉEL ---
  let hasErrors = false;

  // Calculs individuels des validités
  const isEmailContactValid = validateEmail(formData.emailContact);
  const isContactExploitationValid = validatePhone(formData.contactExploitation);
  const isTelephoneResponsableValid = validatePhone(formData.telephoneResponsable);
  const isNifValid = validateNif(formData.nif);
  const isCinResponsableValid = validateCin(formData.cinResponsable);
  const isStatValid = validateStat(formData.stat);

  const isTelephoneParticulierValid = validatePhone(formData.telephoneParticulier);
  const isCinParticulierValid = validateCin(formData.cinParticulier);

  // Application de la condition d'erreur selon le type de profil actif
  if (isEntreprise) {
    hasErrors = !isEmailContactValid || !isContactExploitationValid || 
                !isTelephoneResponsableValid || !isNifValid || 
                !isCinResponsableValid || !isStatValid;
  } else {
    hasErrors = !isTelephoneParticulierValid || !isCinParticulierValid;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors) return;

    // Regroupement conditionnel et nettoyage des espaces avant envoi
    const dataToSubmit = isEntreprise ? {
      type: 'entreprise',
      structure: {
        nom_entite: formData.nomEntite,
        localisation: formData.localisationEntite,
        contact_exploitation: formData.contactExploitation.replace(/\s/g, ''),
        email_contact: formData.emailContact,
        nif: formData.nif,
        stat: formData.stat,
      },
      responsable: {
        nom_complet: formData.nomResponsable,
        telephone_direct: formData.telephoneResponsable.replace(/\s/g, ''),
        cin: formData.cinResponsable.replace(/\s/g, ''),
      },
      productions: selectedProductions
    } : {
      type: 'particulier',
      profil: {
        nom_complet: formData.nomParticulier,
        telephone: formData.telephoneParticulier.replace(/\s/g, ''),
        cin: formData.cinParticulier.replace(/\s/g, ''),
        localisation: formData.localisationParticulier,
      },
      productions: selectedProductions
    };

    onNext(dataToSubmit);
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- VUE ENTREPRISE (3 Colonnes) --- */}
          {isEntreprise && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Structure de production</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                  
                  {/* Nom Entité */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Nom de l'entité</label>
                    <div className="input-icon-step2"><Building2 size={18} /></div>
                    <input 
                      type="text" 
                      placeholder="Ex: Ferme du Sud" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      value={formData.nomEntite}
                      onChange={(e) => handleInputChange('nomEntite', e.target.value)}
                      required 
                    />
                  </div>

                  {/* Localisation Entité */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Localisation</label>
                    <div className="input-icon-step2"><MapPin size={18} /></div>
                    <input 
                      type="text" 
                      placeholder="Commune, Région" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      value={formData.localisationEntite}
                      onChange={(e) => handleInputChange('localisationEntite', e.target.value)}
                      required 
                    />
                  </div>

                  {/* Contact Exploitation */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Contact exploitation</label>
                    <div className="input-icon-step2"><Phone size={18} /></div>
                    <input 
                      type="text" 
                      placeholder="034 xx xxx xx" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      maxLength={13}
                      value={formData.contactExploitation}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        handleInputChange('contactExploitation', formatted);
                      }}
                      required 
                    />
                    {!isContactExploitationValid && (
                      <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={11} /> Requis : 10 chiffres.
                      </p>
                    )}
                  </div>

                  {/* Email Contact */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">E-mail contact</label>
                    <div className="input-icon-step2"><Mail size={18} /></div>
                    <input 
                      type="email" 
                      placeholder="ferme@exemple.mg" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      value={formData.emailContact}
                      onChange={(e) => handleInputChange('emailContact', e.target.value)}
                      required 
                    />
                    {!isEmailContactValid && (
                      <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={11} /> E-mail invalide.
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
                      maxLength={10}
                      value={formData.nif}
                      onChange={(e) => handleInputChange('nif', e.target.value)}
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

              {/* SECTION RESPONSABLE ENTREPRISE */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">Responsable</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Nom complet responsable */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Nom complet</label>
                    <div className="input-icon-step2"><User size={18}/></div>
                    <input 
                      type="text" 
                      placeholder="Gérant" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      value={formData.nomResponsable}
                      onChange={(e) => handleInputChange('nomResponsable', e.target.value)}
                      required 
                    />
                  </div>

                  {/* Téléphone direct responsable */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Téléphone direct</label>
                    <div className="input-icon-step2"><Phone size={18}/></div>
                    <input 
                      type="text" 
                      placeholder="03x xx xxx xx" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      maxLength={13}
                      value={formData.telephoneResponsable}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        handleInputChange('telephoneResponsable', formatted);
                      }}
                      required 
                    />
                    {!isTelephoneResponsableValid && (
                      <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={11} /> Requis : 10 chiffres.
                      </p>
                    )}
                  </div>

                  {/* CIN responsable */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro CIN</label>
                    <div className="input-icon-step2"><CreditCard size={18}/></div>
                    <input 
                      type="text" 
                      placeholder="101 000 000 000" 
                      className="input-auth focus:bg-white text-xs h-10" 
                      maxLength={15}
                      value={formData.cinResponsable}
                      onChange={(e) => {
                        const formatted = formatCin(e.target.value);
                        handleInputChange('cinResponsable', formatted);
                      }}
                      required 
                    />
                    {!isCinResponsableValid && (
                      <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={11} /> Requis : 12 chiffres et doit se terminer par 1 et 2.
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* --- VUE PARTICULIER (2 Colonnes) --- */}
          {!isEntreprise && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              
              {/* Nom complet particulier */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Nom et prénom(s)</label>
                <div className="input-icon-step2"><User size={18}/></div>
                <input 
                  type="text" 
                  placeholder="Votre nom complet" 
                  className="input-auth focus:bg-white text-xs h-11" 
                  value={formData.nomParticulier}
                  onChange={(e) => handleInputChange('nomParticulier', e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Téléphone particulier */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro de téléphone</label>
                  <div className="input-icon-step2"><Phone size={18}/></div>
                  <input 
                    type="text" 
                    placeholder="03x xx xxx xx" 
                    className="input-auth focus:bg-white text-xs h-11" 
                    maxLength={13}
                    value={formData.telephoneParticulier}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      handleInputChange('telephoneParticulier', formatted);
                    }}
                    required 
                  />
                  {!isTelephoneParticulierValid && (
                    <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                      <AlertTriangle size={11} /> Requis : 10 chiffres.
                    </p>
                  )}
                </div>

                {/* CIN particulier */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Numéro CIN</label>
                  <div className="input-icon-step2"><CreditCard size={18}/></div>
                  <input 
                    type="text" 
                    placeholder="101 000 000 000" 
                    className="input-auth focus:bg-white text-xs h-11" 
                    maxLength={15}
                    value={formData.cinParticulier}
                    onChange={(e) => {
                      const formatted = formatCin(e.target.value);
                      handleInputChange('cinParticulier', formatted);
                    }}
                    required 
                  />
                  {!isCinParticulierValid && (
                    <p className="text-red-500 text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                      <AlertTriangle size={11} /> Requis : 12 chiffres et doit se terminer par 1 et 2.
                    </p>
                  )}
                </div>

              </div>

              {/* Localisation particulier */}
              <div className="relative">
                <label className="text-[11px] font-bold text-label block ml-1 mb-1.5">Adresse postale / Localisation</label>
                <div className="input-icon-step2"><MapPin size={18}/></div>
                <input 
                  type="text" 
                  placeholder="Ville, Quartier, Lot" 
                  className="input-auth focus:bg-white text-xs h-11" 
                  value={formData.localisationParticulier}
                  onChange={(e) => handleInputChange('localisationParticulier', e.target.value)}
                  required 
                />
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
                    <input 
                      type="checkbox" 
                      className="peer hidden" 
                      checked={selectedProductions.includes(item)}
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