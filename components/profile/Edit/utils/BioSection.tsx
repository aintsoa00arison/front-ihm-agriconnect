// components/profile/utils/BioSection.tsx
"use client";

import { PenTool, Diamond, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface BioSectionProps {
  bio: string;
  onChange: (value: string) => void;
  isEntreprise: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export default function BioSection({ 
  bio, 
  onChange, 
  isEntreprise, 
  placeholder, 
  maxLength = 500,
  disabled = false 
}: BioSectionProps) {
  const getIcon = () => {
    if (isEntreprise) return <Diamond size={18} className="text-primary" />;
    return <PenTool size={18} className="text-primary" />;
  };

  const getTitle = () => {
    if (isEntreprise) return "Présentation de l'entreprise";
    return "Présentation personnelle";
  };

  const getDefaultPlaceholder = () => {
    if (isEntreprise) {
      return "Décrivez votre entreprise, vos valeurs, votre expérience dans le secteur agricole...";
    }
    return "Parlez de vous, de votre passion pour l'agriculture, de votre parcours...";
  };

  const remainingChars = maxLength - bio.length;
  const showRemaining = bio.length > maxLength * 0.8;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-foreground font-bold text-base">
        {getIcon()}
        <h3>Biographie</h3>
      </div>
      
      <span className="text-xs font-bold text-muted-foreground block">
        {getTitle()}
      </span>
      
      <Textarea
        value={bio}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= maxLength) {
            onChange(newValue);
          }
        }}
        placeholder={placeholder || getDefaultPlaceholder()}
        disabled={disabled}
        className="w-full min-h-[140px] bg-muted/30 border-border rounded-xl focus-visible:ring-primary p-4 text-xs font-medium resize-none"
      />
      
      {showRemaining && (
        <div className={`text-right text-[10px] font-medium ${remainingChars < 50 ? "text-amber-500" : "text-muted-foreground"}`}>
          {remainingChars} caractère{remainingChars !== 1 ? "s" : ""} restant{remainingChars !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}