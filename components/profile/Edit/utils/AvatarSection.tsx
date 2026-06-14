// components/profile/utils/AvatarSection.tsx
"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

interface AvatarSectionProps {
  avatarSrc: string;
  onAvatarChange: (src: string) => void;
  isEntreprise: boolean;
  disabled?: boolean;
}

export default function AvatarSection({ 
  avatarSrc, 
  onAvatarChange, 
  isEntreprise, 
  disabled = false 
}: AvatarSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérification de la taille (max 10Mo)
      if (file.size > 10 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. Maximum 10Mo.");
        return;
      }
      
      // Vérification du type
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide (JPG, PNG).");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onAvatarChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center text-center justify-center space-y-4">
      <div className="relative w-28 h-28 rounded-full overflow-hidden bg-muted border-2 border-border group">
        {avatarSrc ? (
          <Image 
            src={avatarSrc} 
            alt={isEntreprise ? "Logo de l'entreprise" : "Photo de profil"} 
            fill 
            className="object-cover" 
            unoptimized 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Camera size={32} className="text-muted-foreground" />
          </div>
        )}
        
        {/* Overlay au survol */}
        <label 
          htmlFor="avatar-upload"
          className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <Camera size={24} className="text-white" />
        </label>
      </div>
      
      <div>
        <h4 className="text-sm font-bold text-foreground">
          {isEntreprise ? "Logo de l'entreprise" : "Photo de profil"}
        </h4>
        <p className="text-[10px] font-medium text-muted-foreground mt-1">
          PNG ou JPG jusqu'à 10Mo
        </p>
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
      />
      
      <button
        type="button"
        onClick={() => document.getElementById("avatar-upload")?.click()}
        disabled={disabled}
        className="text-xs font-bold text-primary hover:underline mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Changer {isEntreprise ? "le logo" : "la photo"}
      </button>
    </div>
  );
}