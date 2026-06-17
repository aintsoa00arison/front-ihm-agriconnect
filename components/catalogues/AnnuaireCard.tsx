// app/catalogue/components/AnnuaireCard.tsx
"use client";

import { MapPin, Tag, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserRole } from "../../app/services/lib/auth";
import type { UserProfile } from "./types/annuaire";

interface AnnuaireCardProps {
  user: UserProfile;
  onViewProfile: () => void;  // ⭐ AJOUTÉ
}

export default function AnnuaireCard({ user, onViewProfile }: AnnuaireCardProps) {
  const router = useRouter();

  // ⭐ Fonction pour obtenir le chemin de base selon le rôle de l'utilisateur connecté
  const getBasePath = () => {
    const userRole = getUserRole();
    // Si l'utilisateur connecté est un fournisseur, il utilise /f, sinon /c
    return userRole === 'fournisseur' || userRole === 'provider' ? '/f' : '/c';
  };

  // ⭐ Fonction pour rediriger vers le profil avec le pseudonyme
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile();
    } else {
      // Fallback si la fonction n'est pas passée
      const pseudonyme = user.pseudonyme || user.name;
      if (pseudonyme) {
        const basePath = getBasePath();
        router.push(`${basePath}/profile/${encodeURIComponent(pseudonyme)}`);
      }
    }
  };

  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            {/* ⭐ Avatar cliquable */}
            <button 
              onClick={handleViewProfile}
              className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="size-12 rounded-full object-cover ring-2 ring-muted group-hover:ring-primary/20 transition-all" 
              />
            </button>
            <div>
              {/* ⭐ Nom cliquable */}
              <button 
                onClick={handleViewProfile}
                className="text-base font-bold text-foreground hover:text-primary hover:underline transition-colors text-left"
              >
                {user.name}
              </button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold mt-0.5">
                <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                <span className="flex items-center gap-1"><Tag size={12} /> {user.type}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
          {user.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 mt-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={13} 
              className={i < user.rating ? "text-amber-400 fill-amber-400" : "text-muted"} 
            />
          ))}
        </div>
        <Button 
          variant="outline" 
          onClick={handleViewProfile}
          className="h-8 rounded-xl font-bold text-xs border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-all"
        >
          Consulter le Profil
        </Button>
      </div>
    </div>
  );
}