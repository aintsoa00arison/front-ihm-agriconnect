// components/register/CollectorFormContent.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  CreditCard,
} from "lucide-react";
import {
  validateEmail,
  validatePhone,
  validateNif,
  validateCin,
  validateStat,
  formatPhone,
  formatCin,
} from "../../../../utils/validation";
import FormInput from "./FormInput";
import NeedsCheckboxGroup from "./NeedsCheckboxGroup";
import SectionHeader from "./SectionHeader";
import { CollectorFormData } from "../../types/collector";

interface CollectorFormContentProps {
  formData: CollectorFormData;
  selectedNeeds: string[];
  onInputChange: (field: keyof CollectorFormData, value: string) => void;
  onNeedChange: (need: string, checked: boolean) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function CollectorFormContent({
  formData,
  selectedNeeds,
  onInputChange,
  onNeedChange,
  onValidationChange,
}: CollectorFormContentProps) {
  // États pour savoir si les champs ont été touchés
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markAsTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Calcul des erreurs en temps réel
  const errors = {
    raisonSociale: touched.raisonSociale && !formData.raisonSociale ? "La raison sociale est requise" : undefined,
    siegeSocial: touched.siegeSocial && !formData.siegeSocial ? "Le siège social est requis" : undefined,
    telephonePro: touched.telephonePro && formData.telephonePro && !validatePhone(formData.telephonePro) 
      ? "Requis : 10 chiffres" 
      : touched.telephonePro && !formData.telephonePro ? "Le téléphone est requis" : undefined,
    emailPro: touched.emailPro && formData.emailPro && !validateEmail(formData.emailPro) 
      ? "Adresse e-mail invalide" 
      : touched.emailPro && !formData.emailPro ? "L'email est requis" : undefined,
    nif: touched.nif && formData.nif && !validateNif(formData.nif) 
      ? "Requis : 10 chiffres" 
      : touched.nif && !formData.nif ? "Le NIF est requis" : undefined,
    stat: touched.stat && formData.stat && !validateStat(formData.stat) 
      ? "Identifiant trop court (min. 5)" 
      : touched.stat && !formData.stat ? "Le STAT est requis" : undefined,
    nomComplet: touched.nomComplet && !formData.nomComplet ? "Le nom complet est requis" : undefined,
    telephoneDirect: touched.telephoneDirect && formData.telephoneDirect && !validatePhone(formData.telephoneDirect) 
      ? "Requis : 10 chiffres" 
      : touched.telephoneDirect && !formData.telephoneDirect ? "Le téléphone est requis" : undefined,
    cin: touched.cin && formData.cin && !validateCin(formData.cin) 
      ? "Requis : 12 chiffres et  doit se terminer par 1 ou 2 " 
      : touched.cin && !formData.cin ? "Le CIN est requis" : undefined,
  };

  // Vérifier si le formulaire est valide
  const isValid = Object.values(errors).every((error) => !error) &&
    formData.raisonSociale !== "" &&
    formData.siegeSocial !== "" &&
    formData.nomComplet !== "";

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const getFormattedValue = (field: string, value: string) => {
    if (field === "telephonePro" || field === "telephoneDirect") return formatPhone(value);
    if (field === "cin") return formatCin(value);
    return value;
  };

  const handleChange = (field: keyof CollectorFormData, value: string) => {
    const formattedValue = getFormattedValue(field, value);
    onInputChange(field, formattedValue);
  };

  return (
    <>
      {/* SECTION ENTREPRISE */}
      <div className="space-y-3">
        <SectionHeader title="Entreprise" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <FormInput
            label="Raison sociale"
            value={formData.raisonSociale}
            onChange={(v) => handleChange("raisonSociale", v)}
            onBlur={() => markAsTouched("raisonSociale")}
            placeholder="Ex: Agritrade"
            icon={<Building2 size={16} />}
            error={errors.raisonSociale}
            required
          />
          <FormInput
            label="Siège social"
            value={formData.siegeSocial}
            onChange={(v) => handleChange("siegeSocial", v)}
            onBlur={() => markAsTouched("siegeSocial")}
            placeholder="Ville, Quartier"
            icon={<MapPin size={16} />}
            error={errors.siegeSocial}
            required
          />
          <FormInput
            label="Téléphone pro"
            value={formData.telephonePro}
            onChange={(v) => handleChange("telephonePro", v)}
            onBlur={() => markAsTouched("telephonePro")}
            placeholder="034 xx xxx xx"
            icon={<Phone size={16} />}
            error={errors.telephonePro}
            maxLength={13}
           
            required
          />
          <FormInput
            label="E-mail pro"
            value={formData.emailPro}
            onChange={(v) => handleChange("emailPro", v)}
            onBlur={() => markAsTouched("emailPro")}
            placeholder="contact@cie.com"
            icon={<Mail size={16} />}
            error={errors.emailPro}
            type="email"
            required
          />
          <FormInput
            label="NIF"
            value={formData.nif}
            onChange={(v) => handleChange("nif", v)}
            onBlur={() => markAsTouched("nif")}
            placeholder="10 chiffres"
            icon={<FileText size={16} />}
            error={errors.nif}
            maxLength={10}
            numeric={true} 
            required
          />
          <FormInput
            label="STAT"
            value={formData.stat}
            onChange={(v) => handleChange("stat", v)}
            onBlur={() => markAsTouched("stat")}
            placeholder="Stats ID"
            icon={<FileText size={16} />}
            error={errors.stat}
            numeric={true}
            required
          />
        </div>
      </div>

      {/* SECTION REPRÉSENTANT */}
      <div className="space-y-3">
        <SectionHeader title="Représentant légal" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <FormInput
            label="Nom complet"
            value={formData.nomComplet}
            onChange={(v) => handleChange("nomComplet", v)}
            onBlur={() => markAsTouched("nomComplet")}
            placeholder="Prénoms & Nom"
            icon={<User size={16} />}
            error={errors.nomComplet}
            required
          />
          <FormInput
            label="Téléphone direct"
            value={formData.telephoneDirect}
            onChange={(v) => handleChange("telephoneDirect", v)}
            onBlur={() => markAsTouched("telephoneDirect")}
            placeholder="032 xx xxx xx"
            icon={<Phone size={16} />}
            error={errors.telephoneDirect}
            maxLength={13}
          
            required
          />
          <FormInput
            label="Numéro CIN"
            value={formData.cin}
            onChange={(v) => handleChange("cin", v)}
            onBlur={() => markAsTouched("cin")}
            placeholder="101 000 000 001"
            icon={<CreditCard size={16} />}
            error={errors.cin}
            maxLength={15}
          
            required
          />
        </div>
      </div>

      {/* BESOINS */}
      <NeedsCheckboxGroup selectedNeeds={selectedNeeds} onNeedChange={onNeedChange} />
    </>
  );
}