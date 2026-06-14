// components/profile/utils/CompanyInfoSection.tsx
"use client";

import { Building2, MapPin, Mail, Phone, FileText } from "lucide-react";
import FormInput from "./FormInput";
import SectionHeader from "./SectionHeader";
import type { CompanyData } from "../../types/collectorProfile";

interface CompanyInfoSectionProps {
  data: CompanyData;
  onChange: (field: keyof CompanyData, value: string) => void;
  onBlur: (field: keyof CompanyData) => void;
  errors?: Partial<Record<keyof CompanyData, string | null | undefined>>; // Correction du type
}

export default function CompanyInfoSection({ data, onChange, onBlur, errors }: CompanyInfoSectionProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <SectionHeader icon={<Building2 size={20} />} title="Informations de l'entreprise" />
      <div className="p-6 space-y-4">
        <FormInput
          label="Raison sociale"
          value={data.name}
          onChange={(v) => onChange("name", v)}
          onBlur={() => onBlur("name")}
          placeholder="Mon Entreprise"
          icon={<Building2 size={16} />}
          error={errors?.name || undefined}
          required
        />
        <FormInput
          label="Siège social"
          value={data.address}
          onChange={(v) => onChange("address", v)}
          onBlur={() => onBlur("address")}
          placeholder="Ville, Quartier"
          icon={<MapPin size={16} />}
          error={errors?.address || undefined}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Adresse e-mail"
            value={data.email}
            onChange={(v) => onChange("email", v)}
            onBlur={() => onBlur("email")}
            placeholder="email@monentreprise.com"
            icon={<Mail size={16} />}
            error={errors?.email || undefined}
            type="email"
            required
          />
          <FormInput
            label="Numéro de téléphone"
            value={data.phone}
            onChange={(v) => onChange("phone", v)}
            onBlur={() => onBlur("phone")}
            placeholder="034 xx xxx xx"
            icon={<Phone size={16} />}
            error={errors?.phone || undefined}
            numeric
            format="phone"
            required
          />
          <FormInput
            label="NIF"
            value={data.nif}
            onChange={(v) => onChange("nif", v)}
            onBlur={() => onBlur("nif")}
            placeholder="10 chiffres"
            icon={<FileText size={16} />}
            error={errors?.nif || undefined}
            numeric
            maxLength={10}
            required
          />
          <FormInput
            label="STAT"
            value={data.stat}
            onChange={(v) => onChange("stat", v)}
            onBlur={() => onBlur("stat")}
            placeholder="Stats ID"
            icon={<FileText size={16} />}
            error={errors?.stat || undefined}
            required
          />
        </div>
      </div>
    </div>
  );
}