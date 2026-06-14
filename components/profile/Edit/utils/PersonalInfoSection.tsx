// components/profile/utils/PersonalInfoSection.tsx
"use client";

import { User, Calendar, MapPin, Phone, Mail, FileText } from "lucide-react";
import FormInput from "./FormInput";
import SectionHeader from "./SectionHeader";
import type { PersonalData } from "../../types/supplierProfile";

interface PersonalInfoSectionProps {
  data: PersonalData;
  onChange: (field: keyof PersonalData, value: string) => void;
  onBlur: (field: keyof PersonalData) => void;
  errors?: Partial<Record<keyof PersonalData, string | null | undefined>>; // Correction du type
}

export default function PersonalInfoSection({ 
  data, 
  onChange, 
  onBlur, 
  errors 
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <SectionHeader icon={<User size={20} />} title="Informations personnelles" />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Nom"
            value={data.lastName}
            onChange={(v) => onChange("lastName", v)}
            onBlur={() => onBlur("lastName")}
            placeholder="RAKOTO"
            icon={<User size={16} />}
            error={errors?.lastName || undefined}
            required
          />
          <FormInput
            label="Prénom"
            value={data.firstName}
            onChange={(v) => onChange("firstName", v)}
            onBlur={() => onBlur("firstName")}
            placeholder="Jean"
            icon={<User size={16} />}
            error={errors?.firstName || undefined}
            required
          />
          <FormInput
            label="Date de naissance"
            value={data.birthDate}
            onChange={(v) => onChange("birthDate", v)}
            onBlur={() => onBlur("birthDate")}
            placeholder="15/02/2001"
            icon={<Calendar size={16} />}
            error={errors?.birthDate || undefined}
            required
          />
          <FormInput
            label="Lieu de naissance"
            value={data.birthPlace}
            onChange={(v) => onChange("birthPlace", v)}
            onBlur={() => onBlur("birthPlace")}
            placeholder="Fianarantsoa"
            icon={<MapPin size={16} />}
            error={errors?.birthPlace || undefined}
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
            label="Adresse e-mail"
            value={data.email}
            onChange={(v) => onChange("email", v)}
            onBlur={() => onBlur("email")}
            placeholder="email@exemple.com"
            icon={<Mail size={16} />}
            error={errors?.email || undefined}
            type="email"
            required
          />
          <FormInput
            label="Adresse physique"
            value={data.address}
            onChange={(v) => onChange("address", v)}
            onBlur={() => onBlur("address")}
            placeholder="Fianarantsoa"
            icon={<MapPin size={16} />}
            error={errors?.address || undefined}
            required
          />
          <FormInput
            label="Numéro CIN"
            value={data.cin}
            onChange={(v) => onChange("cin", v)}
            onBlur={() => onBlur("cin")}
            placeholder="101 000 000 000"
            icon={<FileText size={16} />}
            error={errors?.cin || undefined}
            numeric
            format="cin"
            maxLength={15}
            required
          />
        </div>
      </div>
    </div>
  );
}