"use client";

import { useRef } from "react";
import Image from "next/image";
import { Star, Pencil, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileHeaderProps {
  user: {
    name: string;
    role: "fournisseur" | "collecteur";
    rating: number;
    bio: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isOwner?: boolean;
  } | null;
  activeTab: string;
  onTabChange: (value: string) => void;
  onEditClick?: () => void;
  isLoading?: boolean;
}

// Composant Skeleton
function ProfileHeaderSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Bannière skeleton */}
      <div className="relative w-full h-48 md:h-64 bg-slate-200 animate-pulse rounded-b-[2rem]" />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
          <div className="flex items-end gap-5">
            {/* Avatar skeleton */}
            <div className="w-32 h-32 rounded-full bg-slate-200 animate-pulse border-4 border-white shadow-sm flex-shrink-0" />
            
            <div className="mb-2 space-y-2">
              {/* Nom skeleton */}
              <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
              {/* Étoiles skeleton */}
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
          
          {/* Bouton skeleton */}
          <div className="h-10 w-36 bg-slate-200 animate-pulse rounded-lg" />
        </div>
        
        {/* Bio skeleton */}
        <div className="border-b border-slate-100 pb-6 mb-0">
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4" />
          </div>
        </div>
        
        {/* Tabs skeleton */}
        <div className="w-full sm:w-1/4 mt-4">
          <div className="flex gap-6">
            <div className="h-10 w-20 bg-slate-200 animate-pulse rounded" />
            <div className="h-10 w-20 bg-slate-200 animate-pulse rounded" />
            <div className="h-10 w-20 bg-slate-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileHeader({ 
  user, 
  activeTab, 
  onTabChange, 
  onEditClick,
  isLoading = false 
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Afficher le skeleton pendant le chargement
  if (isLoading || !user) {
    return <ProfileHeaderSkeleton />;
  }

  const getTabValue = (label: string) => {
    switch (label) {
      case "À propos": return "apropos";
      case "Annonces": return "annonces";
      case "Avis": return "avis";
      default: return label.toLowerCase();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Photo sélectionnée:", file);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-white">
        {/* Bannière */}
        <div className="relative w-full h-48 md:h-64 bg-slate-100 overflow-hidden rounded-b-[2rem]">
          <Image 
            src={user.bannerUrl || "/images/auth/champ.jpeg"} 
            alt="Bannière" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-[#0D631B]/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="flex items-end gap-5">
              <div className="relative w-32 h-32 rounded-full border-4 border-white bg-slate-200 shadow-sm flex-shrink-0">
                {user.avatarUrl && (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                )}
                
                {user.isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white p-2 rounded-full border border-slate-100 shadow-sm text-[#0D631B] hover:bg-slate-50 transition-colors"
                      >
                        <Camera size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-slate-700 bg-white border-primary/30">
                      <p>Modifier la photo de profil</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                  <span className="px-3 py-1 rounded-full border border-[#0D631B]/20 bg-[#E8F5E7] text-[#0D631B] text-xs font-bold capitalize">
                    {user.role === "collecteur" ? "Collecteur" : "Fournisseur"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < (user.rating || 0) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-600">{(user.rating || 0).toFixed(1)}</span>
                </div>
              </div>
            </div>

            {user.isOwner && (
              <Button onClick={onEditClick} className="bg-[#2D6A36] hover:bg-[#23562b] text-white font-bold rounded-lg h-10 px-5 shadow-sm">
                <Pencil size={16} className="mr-2" /> Modifier le profil
              </Button>
            )}
          </div>

          {user.bio && user.bio !== "Aucune description disponible" && (
            <div className="border-b border-slate-100 pb-6 mb-0">
              <p className="text-sm text-slate-500 max-w-full leading-relaxed">{user.bio}</p>
            </div>
          )}

          <div className="w-full sm:w-1/4">
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="flex justify-start bg-transparent p-0 h-auto">
                {["Annonces", "À propos", "Avis"].map((tab, index) => (
                  <TabsTrigger 
                    key={tab} 
                    value={getTabValue(tab)} 
                    className={`py-3 text-sm font-bold data-[state=active]:text-[#0D631B] data-[state=active]:border-b-2 data-[state=active]:border-[#0D631B] rounded-none bg-transparent shadow-none
                      ${index === 0 ? "pl-0 pr-6" : "px-6"}`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}