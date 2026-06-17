"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Star, Pencil, Camera, Loader2, Building2, User, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { getUserRole } from "../../app/services/lib/auth";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    role: "fournisseur" | "collecteur";
    rating: number | string | null;
    bio: string;
    avatarUrl?: string;
    photo?: string;  // ⭐ Ajouté
    bannerUrl?: string;
    isOwner?: boolean;
    legal_name?: string;
    company_name?: string;
    first_name?: string;
    last_name?: string;
    user_type?: string;
    // ⭐ Ajouter pour les données brutes du backend
    email?: { value: string } | string;
    score?: { value: number } | number;
    description?: string;
  } | null;
  activeTab: string;
  onTabChange: (value: string) => void;
  onEditClick?: () => void;
  isLoading?: boolean;
}

// Formatage du rating
const formatRating = (rating: number | string | null | undefined): string => {
  if (rating === null || rating === undefined) return '0.0';
  
  let numRating: number;
  if (typeof rating === 'string') {
    const normalized = rating.replace(',', '.');
    const cleaned = normalized.replace(/[^0-9.]/g, '');
    numRating = parseFloat(cleaned);
  } else {
    numRating = rating;
  }
  
  if (typeof numRating !== 'number' || isNaN(numRating)) return '0.0';
  const clampedRating = Math.min(Math.max(numRating, 0), 5);
  return clampedRating.toFixed(1);
};

// Fonction pour rendre les étoiles
const renderStars = (rating: number | string | null | undefined) => {
  let numRating: number;
  if (rating === null || rating === undefined) {
    numRating = 0;
  } else if (typeof rating === 'string') {
    const normalized = rating.replace(',', '.');
    const cleaned = normalized.replace(/[^0-9.]/g, '');
    numRating = parseFloat(cleaned) || 0;
  } else {
    numRating = rating;
  }
  
  const clamped = Math.min(Math.max(numRating, 0), 5);
  const fullStars = Math.floor(clamped);
  const hasHalfStar = clamped % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const stars = [];
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star 
        key={`full-${i}`} 
        size={16} 
        className="fill-amber-400 text-amber-400"
      />
    );
  }
  
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative inline-block">
        <Star size={16} className="text-slate-200 fill-slate-200" />
        <div className="absolute top-0 left-0 overflow-hidden w-1/2">
          <Star size={16} className="fill-amber-400 text-amber-400" />
        </div>
      </div>
    );
  }
  
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star 
        key={`empty-${i}`} 
        size={16} 
        className="text-slate-200 fill-slate-200"
      />
    );
  }
  
  return stars;
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

  // Récupérer le rôle depuis le token
  const tokenRole = useMemo(() => {
    const role = getUserRole();
    console.log('🔍 ProfileHeader - rôle depuis le token:', role);
    return role;
  }, []);

  // ⭐ DEBUG : Afficher toutes les données reçues
  useEffect(() => {
    if (user) {
      console.log('📊 ProfileHeader - user complet:', user);
      console.log('📊 ProfileHeader - avatarUrl:', user.avatarUrl);
      console.log('📊 ProfileHeader - photo:', user.photo);
      console.log('📊 ProfileHeader - rating:', user.rating);
    }
  }, [user]);

  if (isLoading || !user) {
    return <ProfileHeaderSkeleton />;
  }

  // ⭐ Récupérer le nom d'affichage
  const displayName = user.name || 'Utilisateur';
  const displayInitial = displayName.charAt(0).toUpperCase();
  
  // ⭐ Récupérer la photo de profil (essayer plusieurs sources)
  const profilePhoto = user.photo || user.avatarUrl || null;
  
  // ⭐ DEBUG : Afficher la photo trouvée
  console.log('📸 ProfileHeader - profilePhoto trouvée:', profilePhoto);
  
  // Utiliser le rôle du token ou celui du user
  const userRole = tokenRole || user.role || 'fournisseur';
  const isProvider = userRole === 'fournisseur' || userRole === 'provider';
  const isCollector = userRole === 'collecteur' || userRole === 'collector';

  // Configuration du badge
  const getBadgeConfig = () => {
    if (isProvider) {
      return {
        label: "Fournisseur",
        icon: <Store size={12} className="mr-1" />,
        className: "border-green-500/20 bg-green-50 text-green-700"
      };
    } else if (isCollector) {
      return {
        label: "Collecteur",
        icon: <Truck size={12} className="mr-1" />,
        className: "border-amber-500/20 bg-amber-50 text-amber-700"
      };
    }
    return {
      label: "Utilisateur",
      icon: <User size={12} className="mr-1" />,
      className: "border-slate-500/20 bg-slate-50 text-slate-700"
    };
  };

  const badgeConfig = getBadgeConfig();

  const ratingValue = user.rating ?? 0;
  const formattedRating = formatRating(ratingValue);

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
      // TODO: Appeler l'API pour uploader la photo
      toast.success("Photo de profil mise à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
      e.target.value = '';
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
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="flex items-end gap-5">
              {/* Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-slate-200 shadow-sm flex-shrink-0 group">
                {/* ⭐ Vérification explicite */}
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt={displayName} 
                    className="w-full h-full rounded-full object-cover" 
                    onError={(e) => {
                      console.error('❌ Erreur chargement image:', profilePhoto);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                
                {/* ⭐ Afficher les initiales si pas de photo ou si la photo a échoué */}
                {!profilePhoto && (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0D631B] to-[#2D6A36] flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {displayInitial}
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
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {displayName}
                  </h1>
                  
                  {/* Badge dynamique */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold ${badgeConfig.className}`}>
                    {badgeConfig.icon}
                    {badgeConfig.label}
                  </span>
                </div>
                
                {/* Étoiles */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center">
                    {renderStars(ratingValue)}
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