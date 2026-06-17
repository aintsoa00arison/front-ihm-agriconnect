// app/profile/VisiteHeader.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, User, Store, Truck, Eye, Check, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useInvitations } from "../../app/services/hooks/useInvitations";
import { getUserId } from "../../app/services/lib/auth";

interface VisiteHeaderProps {
  user: {
    id: string;
    name: string;
    role: "fournisseur" | "collecteur";
    rating: number | string | null;
    bio: string;
    avatarUrl?: string;
    photo?: string;
    bannerUrl?: string;
    legal_name?: string;
    company_name?: string;
    first_name?: string;
    last_name?: string;
    user_type?: string;
  } | null;
  activeTab: string;
  onTabChange: (value: string) => void;
  isLoading?: boolean;
  invitationId?: string | null;  // ⭐ AJOUTÉ
  publicationId?: string | null; // ⭐ AJOUTÉ
  onInvitationAction?: (action: 'accept' | 'refuse') => void; // ⭐ AJOUTÉ
}

// Formatage du rating (code existant...)
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

// Fonction pour rendre les étoiles (code existant...)
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

function VisiteHeaderSkeleton() {
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

export default function VisiteHeader({ 
  user, 
  activeTab, 
  onTabChange,
  isLoading = false,
  invitationId = null,
  publicationId = null,
  onInvitationAction
}: VisiteHeaderProps) {
  const router = useRouter();
  const currentUserId = getUserId();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRefusing, setIsRefusing] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState<'pending' | 'accepted' | 'refused' | null>(null);
  
  const { acceptInvitation, refuseInvitation } = useInvitations(currentUserId || undefined);

  // ⭐ Vérifier si l'invitation est déjà traitée
  useEffect(() => {
    if (invitationId) {
      // Vérifier le statut de l'invitation via l'API
      const checkStatus = async () => {
        try {
          const response = await fetch(`/api/invitations/${invitationId}/status`);
          const data = await response.json();
          if (data.status) {
            setInvitationStatus(data.status);
          }
        } catch (error) {
          console.error('Erreur vérification statut:', error);
        }
      };
      checkStatus();
    }
  }, [invitationId]);

  if (isLoading || !user) {
    return <VisiteHeaderSkeleton />;
  }

  const displayName = user.name || 'Utilisateur';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const profilePhoto = user.photo || user.avatarUrl || null;
  
  const isProvider = user.role === 'fournisseur';
  const isCollector = user.role === 'collecteur';

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

  // ⭐ Gestion de l'acceptation
  const handleAccept = async () => {
    if (!invitationId) {
      toast.error("Aucune invitation trouvée");
      return;
    }

    setIsAccepting(true);
    try {
      const result = await acceptInvitation(invitationId);
      if (result.success) {
        setInvitationStatus('accepted');
        toast.success("✅ Invitation acceptée !");
        if (onInvitationAction) onInvitationAction('accept');
        // Rediriger vers la page de visite avec le token d'authentification
        router.push(`/visite/profil/${user.name}?invitation_accepted=true`);
      }
    } catch (error) {
      toast.error("Erreur lors de l'acceptation");
    } finally {
      setIsAccepting(false);
    }
  };

  // ⭐ Gestion du refus
  const handleRefuse = async () => {
    if (!invitationId) {
      toast.error("Aucune invitation trouvée");
      return;
    }

    setIsRefusing(true);
    try {
      const result = await refuseInvitation(invitationId);
      if (result.success) {
        setInvitationStatus('refused');
        toast.info("Invitation refusée");
        if (onInvitationAction) onInvitationAction('refuse');
      }
    } catch (error) {
      toast.error("Erreur lors du refus");
    } finally {
      setIsRefusing(false);
    }
  };

  // ⭐ Voir la publication
  const handleViewPublication = () => {
    if (publicationId) {
      router.push(`/publication/${publicationId}`);
    } else {
      toast.info("Publication non disponible");
    }
  };

  // ⭐ Déterminer si les boutons doivent être affichés
  const showInvitationButtons = invitationId && 
    invitationStatus === 'pending' && 
    currentUserId !== user.id;

  const isAlreadyProcessed = invitationStatus === 'accepted' || invitationStatus === 'refused';

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
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt={displayName} 
                    className="w-full h-full rounded-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                
                {!profilePhoto && (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0D631B] to-[#2D6A36] flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {displayInitial}
                    </span>
                  </div>
                )}
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

            {/* ⭐ BOUTONS D'ACTION */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Bouton Voir Publication */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleViewPublication}
                    variant="outline"
                    className="h-9 px-4 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
                    disabled={!publicationId}
                  >
                    <Eye size={16} className="mr-1.5" />
                    Voir publication
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voir la publication concernée</p>
                </TooltipContent>
              </Tooltip>

              {/* Bouton Accepter */}
              {showInvitationButtons && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAccept}
                      disabled={isAccepting || isAlreadyProcessed}
                      className="h-9 px-4 text-xs font-bold bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isAccepting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <Check size={16} className="mr-1.5" />
                          Accepter
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accepter l'invitation</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Bouton Refuser */}
              {showInvitationButtons && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRefuse}
                      disabled={isRefusing || isAlreadyProcessed}
                      variant="destructive"
                      className="h-9 px-4 text-xs font-bold"
                    >
                      {isRefusing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <X size={16} className="mr-1.5" />
                          Refuser
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refuser l'invitation</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Message si déjà traité */}
              {invitationId && isAlreadyProcessed && (
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                  {invitationStatus === 'accepted' ? '✅ Invitation acceptée' : '❌ Invitation refusée'}
                </span>
              )}
            </div>
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