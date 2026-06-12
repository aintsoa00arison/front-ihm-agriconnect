"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  validateEmail,
  validatePhone,
  validateNif,
  validateCin,
  validateStat,
  formatPhone,
  formatCin,
} from "../../../utils/validation";

// Importations des composants racines Shadcn
import { Stepper } from "@/components/ui/stepper";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  initialData: any;
  onBack: () => void;
  onNext: (data: any) => void;
}

export default function CollectorForm({ initialData, onBack, onNext }: Props) {
  const [formData, setFormData] = useState({
    raisonSociale: initialData?.entreprise?.raison_sociale || "",
    siegeSocial: initialData?.entreprise?.siege_social || "",
    telephonePro: initialData?.entreprise?.telephone_pro || "",
    emailPro: initialData?.entreprise?.email_pro || "",
    nif: initialData?.entreprise?.nif || "",
    stat: initialData?.entreprise?.stat || "",
    nomComplet: initialData?.representant_legal?.nom_complet || "",
    telephoneDirect: initialData?.representant_legal?.telephone_direct || "",
    cin: initialData?.representant_legal?.cin || "",
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(
    initialData?.besoins || [],
  );

  const registerSteps = [
    "Type de rôle",
    "Informations supplémentaires",
    "Finalisation du profil",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (need: string, checked: boolean) => {
    setSelectedNeeds((prev) =>
      checked ? [...prev, need] : prev.filter((item) => item !== need),
    );
  };

  // Validations en temps réel
  const isEmailValid = formData.emailPro
    ? validateEmail(formData.emailPro)
    : true;
  const isPhoneProValid = formData.telephonePro
    ? validatePhone(formData.telephonePro)
    : true;
  const isPhoneDirectValid = formData.telephoneDirect
    ? validatePhone(formData.telephoneDirect)
    : true;
  const isNifValid = formData.nif ? validateNif(formData.nif) : true;
  const isCinValid = formData.cin ? validateCin(formData.cin) : true;
  const isStatValid = formData.stat ? validateStat(formData.stat) : true;

  const hasErrors =
    !isEmailValid ||
    !isPhoneProValid ||
    !isPhoneDirectValid ||
    !isNifValid ||
    !isCinValid ||
    !isStatValid ||
    !formData.raisonSociale ||
    !formData.siegeSocial ||
    !formData.nomComplet;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors) return;

    const dataToSubmit = {
      entreprise: {
        raison_sociale: formData.raisonSociale,
        siege_social: formData.siegeSocial,
        telephone_pro: formData.telephonePro.replace(/\s/g, ""),
        email_pro: formData.emailPro,
        nif: formData.nif,
        stat: formData.stat,
      },
      representant_legal: {
        nom_complet: formData.nomComplet,
        telephone_direct: formData.telephoneDirect.replace(/\s/g, ""),
        cin: formData.cin.replace(/\s/g, ""),
      },
      besoins: selectedNeeds,
    };

    onNext(dataToSubmit);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 h-fit animate-in fade-in duration-500">
      {/* Stepper positionné sur l'étape 2 */}
      <Stepper steps={registerSteps} currentStep={2} />

      <div className="bg-white rounded-[16px] sm:rounded-[20px] shadow-sm border border-separator/10 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-base sm:text-xl font-bold text-label uppercase tracking-wider font-manrope">
            Information supplémentaire
          </h2>
          <p className="text-[10px] sm:text-[11px] text-input-element italic">
            Détails professionnels de votre compte collecteur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* SECTION ENTREPRISE */}
          <div className="space-y-3">
            <h3 className="text-[9px] sm:text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">
              Entreprise
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Raison Sociale */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Raison sociale <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building2
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Ex: Agritrade"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    value={formData.raisonSociale}
                    onChange={(e) =>
                      handleInputChange("raisonSociale", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Siège Social */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Siège social <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Ville, Quartier"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    value={formData.siegeSocial}
                    onChange={(e) =>
                      handleInputChange("siegeSocial", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Téléphone Pro */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Téléphone pro <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="034 xx xxx xx"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    aria-invalid={!isPhoneProValid}
                    value={formData.telephonePro}
                    onChange={(e) =>
                      handleInputChange(
                        "telephonePro",
                        formatPhone(e.target.value),
                      )
                    }
                    maxLength={13}
                    required
                  />
                </div>
                {!isPhoneProValid && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={10} /> Requis : 10 chiffres.
                  </p>
                )}
              </div>

              {/* E-mail Pro */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  E-mail pro <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="email"
                    placeholder="contact@cie.com"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    aria-invalid={!isEmailValid}
                    value={formData.emailPro}
                    onChange={(e) =>
                      handleInputChange("emailPro", e.target.value)
                    }
                    required
                  />
                </div>
                {!isEmailValid && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={10} /> Adresse e-mail invalide.
                  </p>
                )}
              </div>

              {/* NIF */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  NIF <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <FileText
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="10 chiffres"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    aria-invalid={!isNifValid}
                    value={formData.nif}
                    onChange={(e) => handleInputChange("nif", e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
                {!isNifValid && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={10} /> Requis : 10 chiffres.
                  </p>
                )}
              </div>

              {/* STAT */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  STAT <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <FileText
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Stats ID"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    aria-invalid={!isStatValid}
                    value={formData.stat}
                    onChange={(e) => handleInputChange("stat", e.target.value)}
                    required
                  />
                </div>
                {!isStatValid && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={10} /> Identifiant trop court (min. 5).
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION REPRÉSENTANT */}
          <div className="space-y-3">
            <h3 className="text-[9px] sm:text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">
              Représentant légal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Nom Complet */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Prénoms & Nom"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    value={formData.nomComplet}
                    onChange={(e) =>
                      handleInputChange("nomComplet", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Téléphone Direct */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Téléphone direct <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="032 xx xxx xx"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    aria-invalid={!isPhoneDirectValid}
                    value={formData.telephoneDirect}
                    onChange={(e) =>
                      handleInputChange(
                        "telephoneDirect",
                        formatPhone(e.target.value),
                      )
                    }
                    maxLength={13}
                    required
                  />
                </div>
                {!isPhoneDirectValid && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={10} /> Requis : 10 chiffres.
                  </p>
                )}
              </div>

              {/* Numéro CIN */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Numéro CIN <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <CreditCard
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="101 000 000 000"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    aria-invalid={!isCinValid}
                    value={formData.cin}
                    onChange={(e) =>
                      handleInputChange("cin", formatCin(e.target.value))
                    }
                    maxLength={15}
                    required
                  />
                </div>
                {!isCinValid && (
                  <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                    <AlertTriangle size={10} /> Requis : 12 chiffres.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BESOINS AVEC CHECKBOX SHADCN - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3 sm:p-4 rounded-xl border border-separator/10">
            <span className="text-[9px] sm:text-[10px] font-bold text-label uppercase text-center sm:text-left">
              Besoin :
            </span>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6">
              {["Végétale", "Elevage", "Rente"].map((item) => (
                <div key={item} className="flex items-center space-x-2 group">
                  <Checkbox
                    id={`need-${item}`}
                    checked={selectedNeeds.includes(item)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`need-${item}`}
                    className="text-[11px] sm:text-xs font-bold text-neutral-700 cursor-pointer group-hover:text-primary transition-colors select-none"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* NAVIGATION - Responsive */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-separator/10">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-xl border border-separator/30 text-sm font-bold text-label hover:bg-neutral-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Précédent</span>
            </button>
            <button
              type="submit"
              disabled={hasErrors}
              className="btn-primary w-full sm:w-auto px-6 sm:px-10 py-2.5 text-xs sm:text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Suivant</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}