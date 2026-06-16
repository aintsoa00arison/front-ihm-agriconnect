"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin, Phone, Mail, FileText, User, CreditCard } from "lucide-react";
import FormInput from "./FormInput";
import SectionHeader from "./SectionHeader";
import { formatPhone, formatCin, validateEmail, validatePhone, validateNif, validateCin } from "../../../../utils/validation";

interface EntrepriseFormProps {
  formData: {
    nomEntite: string;
    localisationEntite: string;
    contactExploitation: string;
    emailContact: string;
    nif: string;
    stat: string;
    nomResponsable: string;
    telephoneResponsable: string;
    cinResponsable: string;
  };
  onInputChange: (field: string, value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

// 🔥 Validation STAT : 17 chiffres exactement
const validateStat = (stat: string): boolean => {
  const cleanStat = stat.replace(/\s/g, "");
  return /^\d{17}$/.test(cleanStat);
};

export default function EntrepriseForm({ formData, onInputChange, onValidationChange }: EntrepriseFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markAsTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 🔥 Calcul des erreurs en temps réel
  const errors = {
    nomEntite: touched.nomEntite && !formData.nomEntite ? "Le nom de l'entité est requis" : undefined,
    localisationEntite: touched.localisationEntite && !formData.localisationEntite ? "La localisation est requise" : undefined,
    contactExploitation: touched.contactExploitation && formData.contactExploitation && !validatePhone(formData.contactExploitation)
      ? "Le numéro doit commencer par 032, 033 ou 034 et faire 10 chiffres"
      : touched.contactExploitation && !formData.contactExploitation ? "Le contact est requis" : undefined,
    emailContact: touched.emailContact && formData.emailContact && !validateEmail(formData.emailContact)
      ? "E-mail invalide"
      : touched.emailContact && !formData.emailContact ? "L'email est requis" : undefined,
    nif: touched.nif && formData.nif && !validateNif(formData.nif)
      ? "Requis : 10 chiffres"
      : touched.nif && !formData.nif ? "Le NIF est requis" : undefined,
    stat: touched.stat && formData.stat && !validateStat(formData.stat)
      ? "Le STAT doit contenir exactement 17 chiffres"
      : touched.stat && !formData.stat ? "Le STAT est requis" : undefined,
    nomResponsable: touched.nomResponsable && !formData.nomResponsable ? "Le nom du responsable est requis" : undefined,
    telephoneResponsable: touched.telephoneResponsable && formData.telephoneResponsable && !validatePhone(formData.telephoneResponsable)
      ? "Le numéro doit commencer par 032, 033 ou 034 et faire 10 chiffres"
      : touched.telephoneResponsable && !formData.telephoneResponsable ? "Le téléphone est requis" : undefined,
    cinResponsable: touched.cinResponsable && formData.cinResponsable && !validateCin(formData.cinResponsable)
      ? "12 chiffres requis (le 2ème chiffre doit être 0 ou 1)"
      : touched.cinResponsable && !formData.cinResponsable ? "Le CIN est requis" : undefined,
  };

  // Validation globale
  const isValid = !errors.nomEntite && !errors.localisationEntite && !errors.contactExploitation &&
    !errors.emailContact && !errors.nif && !errors.stat && !errors.nomResponsable &&
    !errors.telephoneResponsable && !errors.cinResponsable &&
    formData.nomEntite !== "" && formData.localisationEntite !== "" && formData.nomResponsable !== "";

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const getFormattedValue = (field: string, value: string) => {
    if (field === "contactExploitation" || field === "telephoneResponsable") return formatPhone(value);
    if (field === "cinResponsable") return formatCin(value);
    return value;
  };

  const handleChange = (field: string, value: string) => {
    const formattedValue = getFormattedValue(field, value);
    onInputChange(field, formattedValue);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in slide-in-from-bottom-2 duration-300">
      {/* Structure de production */}
      <div className="space-y-3">
        <SectionHeader title="Structure de production" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <FormInput
            label="Nom de l'entité"
            value={formData.nomEntite}
            onChange={(v) => handleChange("nomEntite", v)}
            onBlur={() => markAsTouched("nomEntite")}
            placeholder="Ex: Ferme du Sud"
            icon={<Building2 size={16} />}
            error={errors.nomEntite}
            required
          />
          <FormInput
            label="Localisation"
            value={formData.localisationEntite}
            onChange={(v) => handleChange("localisationEntite", v)}
            onBlur={() => markAsTouched("localisationEntite")}
            placeholder="Commune, Région"
            icon={<MapPin size={16} />}
            error={errors.localisationEntite}
            required
          />
          <FormInput
            label="Contact exploitation"
            value={formData.contactExploitation}
            onChange={(v) => handleChange("contactExploitation", v)}
            onBlur={() => markAsTouched("contactExploitation")}
            placeholder="034 xx xxx xx"
            icon={<Phone size={16} />}
            error={errors.contactExploitation}
            maxLength={13}
            required
          />
          <FormInput
            label="E-mail contact"
            value={formData.emailContact}
            onChange={(v) => handleChange("emailContact", v)}
            onBlur={() => markAsTouched("emailContact")}
            placeholder="ferme@exemple.mg"
            icon={<Mail size={16} />}
            error={errors.emailContact}
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
            placeholder="17 chiffres"
            icon={<FileText size={16} />}
            error={errors.stat}
            numeric={true}
            maxLength={17}
            required
          />
        </div>
      </div>

      {/* Responsable */}
      <div className="space-y-3">
        <SectionHeader title="Responsable" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <FormInput
            label="Nom complet"
            value={formData.nomResponsable}
            onChange={(v) => handleChange("nomResponsable", v)}
            onBlur={() => markAsTouched("nomResponsable")}
            placeholder="Gérant"
            icon={<User size={16} />}
            error={errors.nomResponsable}
            required
          />
          <FormInput
            label="Téléphone direct"
            value={formData.telephoneResponsable}
            onChange={(v) => handleChange("telephoneResponsable", v)}
            onBlur={() => markAsTouched("telephoneResponsable")}
            placeholder="034 xx xxx xx"
            icon={<Phone size={16} />}
            error={errors.telephoneResponsable}
            maxLength={13}
            required
          />
          <FormInput
            label="Numéro CIN"
            value={formData.cinResponsable}
            onChange={(v) => handleChange("cinResponsable", v)}
            onBlur={() => markAsTouched("cinResponsable")}
            placeholder="101 000 000 001"
            icon={<CreditCard size={16} />}
            error={errors.cinResponsable}
            maxLength={15}
            required
          />
        </div>
      </div>
    </div>
  );
}