"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileHeaderProps {
  user: {
    name: string;
    role: "fournisseur" | "collecteur";
    rating: number;
    bio: string;
    avatarUrl?: string;
    bannerUrl?: string;
  };
  activeTab: string;
  onTabChange: (value: string) => void;
  onEditClick?: () => void;
}

export default function ProfileHeader({
  user,
  activeTab,
  onTabChange,
  onEditClick,
}: ProfileHeaderProps) {
  const isFournisseur = user.role === "fournisseur";
  
  // Valeur par défaut locale pour la bannière
  const defaultBanner = "/images/auth/champ.jpeg";

  // États locaux de repli réactifs
  const [bannerSrc, setBannerSrc] = useState<string>(defaultBanner);
  const [avatarSrc, setAvatarSrc] = useState<string>(user.avatarUrl || "");

  // Synchronisation stricte avec les propriétés reçues
  useEffect(() => {
    if (user.bannerUrl && user.bannerUrl.trim() !== "" && user.bannerUrl.startsWith("/")) {
      setBannerSrc(user.bannerUrl);
    } else {
      setBannerSrc(defaultBanner);
    }

    setAvatarSrc(user.avatarUrl || "");
  }, [user.bannerUrl, user.avatarUrl]);

  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i <= floorRating
              ? "fill-amber-400 text-amber-400"
              : "text-input-element/20"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="w-full bg-white rounded-b-3xl shadow-sm border border-separator/10 overflow-hidden">
      {/* 1. Bannière de couverture */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-t-2xl bg-slate-100">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerSrc}
            alt="Bannière de profil"
            fill
            priority
            className="object-cover"
            onError={() => setBannerSrc(defaultBanner)}
          />
          <div className="absolute inset-0 bg-[#0D631B]/20" />
        </div>
      </div>

      {/* Container principal des infos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0 relative">
        
        {/* 2. Ligne de l'Avatar et du Bouton Modifier */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4 relative z-10">
          {/* Avatar dynamique fourni par la donnée */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
            {avatarSrc && (
              <Image
                src={avatarSrc}
                alt={`Avatar de ${user.name}`}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          {/* Bouton Modifier le profil */}
          <Button
            onClick={onEditClick}
            className="btn-primary font-bold rounded-xl px-4 py-2 flex items-center gap-2 self-start sm:self-end h-11 shadow-sm transition-all text-sm"
          >
            <Pencil size={16} strokeWidth={2.5} />
            Modifier le profil
          </Button>
        </div>

        {/* 3. Informations textuelles du profil */}
        <div className="space-y-3 mt-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight tracking-tight break-all">
              {user.name}
            </h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                isFournisseur
                  ? "bg-green-50 text-emerald-700 border-green-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              } capitalize`}
            >
              {user.role}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center">{renderStars(user.rating)}</div>
            <span className="text-sm font-bold text-slate-700 ml-1">
              {user.rating.toFixed(1)}
            </span>
          </div>

          <p className="text-sm text-input-element font-medium leading-relaxed max-w-4xl pt-1">
            {user.bio}
          </p>
        </div>

        {/* 4. Barre d'onglets (Tabs) réalignée parfaitement sur la gauche */}
        <div className="border-t border-separator/20 mt-8">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="flex w-full justify-start bg-transparent border-b border-transparent h-auto p-0 rounded-none gap-8">
              <TabsTrigger
                value="annonces"
                className="pb-3 pt-4 text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-[#0D631B] data-[state=active]:border-[#0D631B] data-[state=active]:bg-transparent data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent pl-0 pr-2 shadow-none"
              >
                Annonces
              </TabsTrigger>
              <TabsTrigger
                value="apropos"
                className="pb-3 pt-4 text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-[#0D631B] data-[state=active]:border-[#0D631B] data-[state=active]:bg-transparent data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent px-2 shadow-none"
              >
                À propos
              </TabsTrigger>
              <TabsTrigger
                value="avis"
                className="pb-3 pt-4 text-base font-bold transition-all border-b-2 rounded-none data-[state=active]:text-[#0D631B] data-[state=active]:border-[#0D631B] data-[state=active]:bg-transparent data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent bg-transparent px-2 shadow-none"
              >
                Avis
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

      </div>
    </div>
  );
}