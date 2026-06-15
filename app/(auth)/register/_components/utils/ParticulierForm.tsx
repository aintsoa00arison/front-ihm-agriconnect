// components/register/utils/ParticulierForm.tsx
"use client";

import { useState, useEffect } from "react";
import { User, Phone, CreditCard, MapPin } from "lucide-react";
import FormInput from "./FormInput";
import { formatPhone, formatCin, validatePhone, validateCin } from "../../../../utils/validation";

interface ParticulierFormProps {
  formData: {
    nom: string;        // last_name
    prenom: string;     // first_name
    telephoneParticulier: string;
    cinParticulier: string;
    localisationParticulier: string;
  };
  onInputChange: (field: string, value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function ParticulierForm({ formData, onInputChange, onValidationChange }: ParticulierFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markAsTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const errors = {
    nom: touched.nom && !formData.nom ? "Le nom est requis" : undefined,
    prenom: touched.prenom && !formData.prenom ? "Le prénom est requis" : undefined,
    telephoneParticulier: touched.telephoneParticulier && formData.telephoneParticulier && !validatePhone(formData.telephoneParticulier)
      ? "Requis : 10 chiffres"
      : touched.telephoneParticulier && !formData.telephoneParticulier ? "Le téléphone est requis" : undefined,
    cinParticulier: touched.cinParticulier && formData.cinParticulier && !validateCin(formData.cinParticulier)
      ? "Requis : 12 chiffres (doit se terminer par 1 ou 2)"
      : touched.cinParticulier && !formData.cinParticulier ? "Le CIN est requis" : undefined,
    localisationParticulier: touched.localisationParticulier && !formData.localisationParticulier ? "L'adresse est requise" : undefined,
  };

  const isValid = !errors.nom && !errors.prenom && !errors.telephoneParticulier && !errors.cinParticulier && !errors.localisationParticulier &&
    formData.nom !== "" && formData.prenom !== "" && formData.localisationParticulier !== "";

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const getFormattedValue = (field: string, value: string) => {
    if (field === "telephoneParticulier") return formatPhone(value);
    if (field === "cinParticulier") return formatCin(value);
    return value;
  };

  const handleChange = (field: string, value: string) => {
    const formattedValue = getFormattedValue(field, value);
    onInputChange(field, formattedValue);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 animate-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Nom"
          value={formData.nom}
          onChange={(v) => handleChange("nom", v)}
          onBlur={() => markAsTouched("nom")}
          placeholder="RAKOTO"
          icon={<User size={16} />}
          error={errors.nom}
          required
        />
        <FormInput
          label="Prénom"
          value={formData.prenom}
          onChange={(v) => handleChange("prenom", v)}
          onBlur={() => markAsTouched("prenom")}
          placeholder="Jean"
          icon={<User size={16} />}
          error={errors.prenom}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <FormInput
          label="Numéro de téléphone"
          value={formData.telephoneParticulier}
          onChange={(v) => handleChange("telephoneParticulier", v)}
          onBlur={() => markAsTouched("telephoneParticulier")}
          placeholder="034 xx xxx xx"
          icon={<Phone size={16} />}
          error={errors.telephoneParticulier}
          maxLength={13}
         
          required
        />
        <FormInput
          label="Numéro CIN"
          value={formData.cinParticulier}
          onChange={(v) => handleChange("cinParticulier", v)}
          onBlur={() => markAsTouched("cinParticulier")}
          placeholder="101 000 000 001"
          icon={<CreditCard size={16} />}
          error={errors.cinParticulier}
          maxLength={15}
          
          required
        />
      </div>

      <FormInput
        label="Adresse"
        value={formData.localisationParticulier}
        onChange={(v) => handleChange("localisationParticulier", v)}
        onBlur={() => markAsTouched("localisationParticulier")}
        placeholder="Ville, Quartier, Lot"
        icon={<MapPin size={16} />}
        error={errors.localisationParticulier}
        required
      />
    </div>
  );
}