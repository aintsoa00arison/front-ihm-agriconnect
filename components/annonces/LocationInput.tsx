// components/ad/LocationInput.tsx
"use client";

import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdFormMode } from "./types/ad";

interface LocationInputProps {
  mode: AdFormMode;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function LocationInput({ mode, value, onChange, disabled }: LocationInputProps) {
  const label = mode === "annonce" ? "Localisation" : "Lieu de livraison";
  const placeholder = mode === "annonce" ? "Ex: Antananarivo" : "Ex: Fianarantsoa";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-800">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-11 bg-slate-50/50 border-slate-200/80 rounded-xl h-11 text-sm font-medium focus-visible:ring-[#0D631B]"
          required
        />
      </div>
    </div>
  );
}