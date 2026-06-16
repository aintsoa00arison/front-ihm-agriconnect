"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, ArrowUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProfileFilters from "./ProfileFilters";
import InterestedUsersModal from "./InterestedUsersModal";
import AdCard from "./AdCard";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { usePublications } from "../../app/services/hooks/usePublication";
import { getUserId } from "../../app/services/lib/auth";

interface InterestedUser {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
}

interface AdItem {
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
  interestedUsers: InterestedUser[];
}

interface ToastState {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

interface ProfileAdsProps {
  onEditAd: (ad: AdItem) => void;
}


export default function ProfileAds({ onEditAd }: ProfileAdsProps) {
  const userId = getUserId();
  const { publications, loading, deletePublication } = usePublications(userId || undefined);
  
  // 🔥 S'assurer que publications est un tableau
  const safePublications = Array.isArray(publications) ? publications : [];
  
  // 🔥 Si publications est vide ou que le chargement est terminé
  const ads: AdItem[] = safePublications.map(pub => ({
    id: pub.id,
    productName: pub.titre || "Sans titre",
    productionType: pub.category || "Non catégorisé",
    quantity: pub.quantity || "0",
    location: pub.localisation || "Non spécifié",
    description: pub.description || "",
    mediaUrl: pub.photo || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
    price: "0 MGA",
    timeAgo: "il y a 2h",
    date: new Date(),
    interestedCount: 0,
    interestedUsers: [],
  }));

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





  // Écouter la recherche depuis le layout
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener("profileAdsSearch", handleSearchEvent as EventListener);
    
    return () => {
      window.removeEventListener("profileAdsSearch", handleSearchEvent as EventListener);
    };
  }, []);

  // Détecter le scroll pour afficher le bouton
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
  }, [loading]);

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
    if (selectedAdForDelete) {
      const result = await deletePublication(selectedAdForDelete.id);
      if (result.success) {
        setSelectedAdForDelete(null);
        showToast("L'annonce a été supprimée avec succès.", "success");
      } else {
        showToast(result.message, "error");
      }
    }
  };

  const handleAcceptInterested = (user: InterestedUser, adName: string) => {
    showToast(
      `Vous avez matché avec ${user.name} pour cette annonce. Vous pouvez commencer à discuter.`,
      "success"
    );
    // Logique à implémenter avec le backend
  };

  const handleRejectInterested = (user: InterestedUser) => {
    showToast(`Vous avez rejeté l'intérêt de ${user.name} pour cette annonce.`, "info");
    // Logique à implémenter avec le backend
  };

  // Fonction pour filtrer les annonces
  const getFilteredAds = () => {
    let filtered = [...ads];

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(ad => 
        ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(ad => ad.productionType === filterType);
    }

    // Filtre par date à implémenter avec les vraies dates
    if (filterDate !== "all") {
      // ...
    }

    return filtered;
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterDate("all");
  };

  const filteredAds = getFilteredAds();

  // Skeleton Loader
  if (loading) {
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

      {/* Résultat du filtrage */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{filteredAds.length}</span> annonce{filteredAds.length !== 1 ? 's' : ''} trouvée{filteredAds.length !== 1 ? 's' : ''}
          {searchQuery && ` pour "${searchQuery}"`}
        </p>
      </div>

      {/* Cartes d'annonces */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed">
          {searchQuery 
            ? `Aucune annonce ne correspond à votre recherche "${searchQuery}"`
            : "Aucune annonce ne correspond à vos critères."}
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

      {/* Modale suppression */}
      <AlertDialog open={!!selectedAdForDelete} onOpenChange={() => setSelectedAdForDelete(null)}>
        <AlertDialogContent className="rounded-2xl max-w-md p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="size-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                Supprimer l'annonce ?
              </h2>
              <p className="text-xs text-slate-500">
                Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
              </p>
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

      {/* Flèche de défilement */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 p-3 bg-[#2e7d32] text-white rounded-full shadow-lg hover:bg-[#1b5e20] transition-all duration-300 animate-in fade-in zoom-in cursor-pointer"
          aria-label="Remonter en haut"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}