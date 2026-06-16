"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, ArrowUp, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProfileFilters from "./ProfileFilters";
import InterestedUsersModal from "./InterestedUsersModal";
import AdCard from "./AdCard";
import { usePublications } from "../../app/services/hooks/usePublication";
import { getUserId } from "../../app/services/lib/auth";

// 🔥 Types
export interface AdItem {
  id: string;
  productName: string;
  productionType: string;
  quantity: string;
  location: string;
  description: string;
  mediaUrl: string;
  price: string;
  timeAgo: string;
  date: Date;
  interestedCount: number;
  interestedUsers: any[];
}

interface ToastState {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

interface ProfileAdsProps {
  onEditAd: (ad: AdItem) => void;
}

// 🔥 Fonction pour formater la date
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour}h`;
  if (diffDay < 7) return `il y a ${diffDay}j`;
  if (diffDay < 30) return `il y a ${Math.floor(diffDay / 7)} sem`;
  return `il y a ${Math.floor(diffDay / 30)} mois`;
};

export default function ProfileAds({ onEditAd }: ProfileAdsProps) {
  const userId = getUserId();
  const { 
    publications, 
    loading, 
    isRefreshing,
    isInitialized,
    loadUserPublications, 
    deletePublication,
    refreshPublications
  } = usePublications(userId || undefined);
  
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedAdForInterested, setSelectedAdForInterested] = useState<AdItem | null>(null);
  const [selectedAdForDelete, setSelectedAdForDelete] = useState<AdItem | null>(null);
  const [expandedAdIds, setExpandedAdIds] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 🔥 Charger les publications au montage et quand userId change
  useEffect(() => {
    if (userId) {
      setIsFirstLoad(true);
      const timer = setTimeout(() => {
        loadUserPublications(true);
        setIsFirstLoad(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [userId, loadUserPublications]);

  // 🔥 Recharger quand le userId change
  useEffect(() => {
    if (userId) {
      loadUserPublications();
    }
  }, [userId]);

  // 🔥 Transformer les publications en AdItem
  const ads: AdItem[] = (publications || []).map(pub => ({
    id: pub.id,
    productName: pub.titre || "Sans titre",
    productionType: pub.category || "Non catégorisé",
    quantity: pub.quantity || "0",
    location: pub.localisation || "Non spécifié",
    description: pub.description || "",
    mediaUrl: pub.photo || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
    price: pub.price ? `${pub.price} Ar` : "Gratuit",
    timeAgo: pub.createdAt ? formatTimeAgo(new Date(pub.createdAt)) : "Récent",
    date: pub.createdAt ? new Date(pub.createdAt) : new Date(),
    interestedCount: 0,
    interestedUsers: [],
  }));

  // Écouter la recherche
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener("profileAdsSearch", handleSearchEvent as EventListener);
    
    return () => {
      window.removeEventListener("profileAdsSearch", handleSearchEvent as EventListener);
    };
  }, []);

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollButton(scrollRef.current.scrollTop > 300);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const toggleDescription = (id: string) => {
    setExpandedAdIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteAd = (ad: AdItem) => {
    setSelectedAdForDelete(ad);
  };

  const confirmDelete = async () => {
    if (selectedAdForDelete && userId) {
      const result = await deletePublication(selectedAdForDelete.id);
      if (result.success) {
        setSelectedAdForDelete(null);
        showToast("L'annonce a été supprimée avec succès.", "success");
        setTimeout(() => {
          loadUserPublications(true);
        }, 300);
      } else {
        showToast(result.message, "error");
      }
    }
  };

  const handleAcceptInterested = (user: any, adName: string) => {
    showToast(
      `Vous avez matché avec ${user.name} pour cette annonce.`,
      "success"
    );
  };

  const handleRejectInterested = (user: any) => {
    showToast(`Vous avez rejeté l'intérêt de ${user.name}.`, "info");
  };

  // 🔥 Filtrer les annonces
  const getFilteredAds = () => {
    let filtered = [...ads];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.productName.toLowerCase().includes(query) ||
        ad.description.toLowerCase().includes(query) ||
        ad.location.toLowerCase().includes(query)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(ad => ad.productionType === filterType);
    }

    if (filterDate !== "all") {
      const now = new Date();
      filtered = filtered.filter(ad => {
        const diffDays = Math.floor((now.getTime() - ad.date.getTime()) / (1000 * 60 * 60 * 24));
        if (filterDate === "today") return diffDays === 0;
        if (filterDate === "week") return diffDays <= 7;
        if (filterDate === "month") return diffDays <= 30;
        return true;
      });
    }

    return filtered;
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterDate("all");
  };

  const filteredAds = getFilteredAds();

  // 🔥 Rafraîchir
  const handleRefresh = async () => {
    await refreshPublications();
  };

  // 🔥 Skeleton Loader
  if (loading && isFirstLoad) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 animate-pulse">
            <div className="w-full h-56 bg-slate-100 rounded-2xl" />
            <div className="h-6 w-1/3 bg-slate-100 rounded" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div ref={scrollRef} className="space-y-6 relative overflow-y-auto h-full">
        {/* Toasts */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none">
          {toasts.map((t) => (
            <div 
              key={t.id} 
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-right-5 duration-300 ${
                t.type === "success" 
                  ? "bg-[#e8f5e9] border-[#2e7d32]/30 text-[#1b5e20]" 
                  : t.type === "error"
                    ? "bg-red-50 border-red-200 text-red-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                t.type === "success" 
                  ? "bg-[#2e7d32]/10 text-[#2e7d32]" 
                  : t.type === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
              }`}>
                <Bell size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold leading-relaxed">{t.message}</p>
              </div>
              <button 
                onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Mes annonces</h2>
            
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#2e7d32] transition-colors disabled:opacity-50"
          >
            {isRefreshing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <span>⟳</span>
            )}
            Actualiser
          </button>
        </div>

        {/* Filtres */}
        <ProfileFilters
          filterType={filterType}
          filterDate={filterDate}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onFilterTypeChange={setFilterType}
          onFilterDateChange={setFilterDate}
          onResetFilters={resetFilters}
        />

        {/* Résultat */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{filteredAds.length}</span> annonce{filteredAds.length !== 1 ? 's' : ''} trouvée{filteredAds.length !== 1 ? 's' : ''}
            {searchQuery && ` pour "${searchQuery}"`}
          </p>
        </div>

        {/* Cartes */}
        {filteredAds.length === 0 && isInitialized ? (
          <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed">
            {searchQuery 
              ? `Aucune annonce ne correspond à votre recherche "${searchQuery}"`
              : "Vous n'avez pas encore publié d'annonces."}
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 size={24} className="animate-spin mx-auto text-primary" />
            <p className="text-sm text-slate-400 mt-2">Chargement...</p>
          </div>
        ) : (
          filteredAds.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              isExpanded={!!expandedAdIds[ad.id]}
              onToggleDescription={toggleDescription}
              onEdit={onEditAd}
              onDelete={handleDeleteAd}
              onViewInterested={setSelectedAdForInterested}
            />
          ))
        )}

        {/* Modale intéressés */}
        <InterestedUsersModal
          ad={selectedAdForInterested}
          onClose={() => setSelectedAdForInterested(null)}
          onAccept={handleAcceptInterested}
          onReject={handleRejectInterested}
        />

        {/* 🔥 AlertDialog avec VisuallyHidden corrigé */}
        <AlertDialog open={!!selectedAdForDelete} onOpenChange={() => setSelectedAdForDelete(null)}>
          <AlertDialogContent className="rounded-2xl max-w-md p-6">
            <VisuallyHidden>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible
                </AlertDialogDescription>
              </AlertDialogHeader>
            </VisuallyHidden>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900">Supprimer l'annonce ?</h2>
                <p className="text-xs text-slate-500">Cette action est irréversible.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <button
                  onClick={() => setSelectedAdForDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white transition-colors text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bouton scroll avec Tooltip */}
        {showScrollButton && (
          <div className="fixed bottom-24 right-6 z-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToTop}
                  className="p-3 bg-[#2e7d32] text-white rounded-full shadow-lg hover:bg-[#1b5e20] transition-all duration-300 animate-in fade-in zoom-in cursor-pointer"
                  aria-label="Remonter en haut"
                >
                  <ArrowUp size={20} strokeWidth={2.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs font-medium">
                Remonter en haut
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}