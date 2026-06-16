"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Star, Pencil, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    role: "fournisseur" | "collecteur";
    rating: number | string | null;
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

const formatRating = (rating: number | string | null | undefined): string => {
  if (rating === null || rating === undefined) return '0.0';
  
  let numRating: number;
  if (typeof rating === 'string') {
    const cleaned = rating.replace(/[^0-9.]/g, '');
    numRating = parseFloat(cleaned);
  } else {
    numRating = rating;
  }
  
  if (typeof numRating !== 'number' || isNaN(numRating)) return '0.0';
  const clampedRating = Math.min(Math.max(numRating, 0), 5);
  return clampedRating.toFixed(1);
};

const getFullStars = (rating: number | string | null | undefined): number => {
  if (rating === null || rating === undefined) return 0;
  
  let numRating: number;
  if (typeof rating === 'string') {
    const cleaned = rating.replace(/[^0-9.]/g, '');
    numRating = parseFloat(cleaned);
  } else {
    numRating = rating;
  }
  
  if (typeof numRating !== 'number' || isNaN(numRating)) return 0;
  return Math.floor(Math.min(Math.max(numRating, 0), 5));
};

function ProfileHeaderSkeleton() {
  return (
    <div className="w-full bg-white">
      <div className="relative w-full h-48 md:h-64 bg-slate-200 animate-pulse rounded-b-[2rem]" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
          <div className="flex items-end gap-5">
            <div className="w-32 h-32 rounded-full bg-slate-200 animate-pulse border-4 border-white shadow-sm flex-shrink-0" />
            <div className="mb-2 space-y-2">
              <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
          <div className="h-10 w-36 bg-slate-200 animate-pulse rounded-lg" />
        </div>
        <div className="border-b border-slate-100 pb-6 mb-0">
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4" />
          </div>
        </div>
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
  const [isUploading, setIsUploading] = useState(false);

  // 🔥 Log pour déboguer
  useEffect(() => {
    if (user) {
      console.log('📊 ProfileHeader - user.rating:', user.rating);
      console.log('📊 ProfileHeader - user complet:', user);
    }
  }, [user]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5Mo");
      return;
    }

    setIsUploading(true);
    try {
      toast.success("Photo de profil mise à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // 🔥 Récupérer le rating
  const ratingValue = user.rating ?? 0;
  const formattedRating = formatRating(ratingValue);
  const fullStars = getFullStars(ratingValue);

  console.log('⭐ Rating affiché:', { ratingValue, formattedRating, fullStars });

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
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="flex items-end gap-5">
              {/* Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-slate-200 shadow-sm flex-shrink-0 group">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0D631B] to-[#2D6A36] flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {user.isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 bg-white p-1.5 sm:p-2 rounded-full border border-slate-200 shadow-sm text-[#0D631B] hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        {isUploading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Camera size={14} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Modifier la photo de profil</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleFileChange}
                />
              </div>

              {/* Infos utilisateur */}
              <div className="mb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
                  <span className="px-3 py-1 rounded-full border border-[#0D631B]/20 bg-[#E8F5E7] text-[#0D631B] text-[10px] sm:text-xs font-bold capitalize">
                    {user.role === "collecteur" ? "Collecteur" : "Fournisseur"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < fullStars ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    {formattedRating}
                  </span>
                </div>
              </div>
            </div>

            {user.isOwner && (
              <Button 
                onClick={onEditClick} 
                className="bg-[#2D6A36] hover:bg-[#23562b] text-white font-bold rounded-lg h-10 px-5 shadow-sm transition-all active:scale-95"
              >
                <Pencil size={16} className="mr-2" /> Modifier le profil
              </Button>
            )}
          </div>

          {user.bio && user.bio !== "Aucune description disponible" && (
            <div className="border-b border-slate-100 pb-6 mb-0">
              <p className="text-sm text-slate-500 max-w-full leading-relaxed">{user.bio}</p>
            </div>
          )}

          <div className="w-full sm:w-1/2">
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="flex justify-start bg-transparent p-0 h-auto gap-1 sm:gap-2">
                {["Annonces", "À propos", "Avis"].map((tab, index) => (
                  <TabsTrigger 
                    key={tab} 
                    value={getTabValue(tab)} 
                    className={`py-2.5 sm:py-3 text-xs sm:text-sm font-bold data-[state=active]:text-[#0D631B] data-[state=active]:border-b-2 data-[state=active]:border-[#0D631B] rounded-none bg-transparent shadow-none
                      ${index === 0 ? "pl-0 pr-4 sm:pr-6" : "px-4 sm:px-6"}`}
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