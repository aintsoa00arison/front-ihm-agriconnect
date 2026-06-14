"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, ArrowUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileFilters from "./ProfileFilters";
import InterestedUsersModal from "./InterestedUsersModal";
import AdCard from "./AdCard";

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
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Simulation de chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setAds([
        {
          id: "ad_1",
          productName: "Blé de province",
          productionType: "Végétale",
          quantity: "3 tonnes",
          location: "Antananarivo, Madagascar",
          description: "Cultivé sous le soleil de Midi sur des terres préservées, ce blé offre des arômes de noisette et une digestibilité optimale.",
          mediaUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
          price: "3000 MGA/kg",
          timeAgo: "il y a 2h",
          date: new Date(Date.now() - 2 * 60 * 60 * 1000),
          interestedCount: 250,
          interestedUsers: [
            { id: "u_1", name: "John Doe", role: "Collecteur - Fianarantsoa", rating: 5.0, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=John" },
            { id: "u_2", name: "Jane Cooper", role: "Producteur - Elevage", rating: 4.2, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Jane" },
            { id: "u_3", name: "Jenny Wilson", role: "Grossiste - Rente", rating: 4.5, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Jenny" },
          ]
        },
        {
          id: "ad_2",
          productName: "Maïs Jaune Sec",
          productionType: "Rente",
          quantity: "10 tonnes",
          location: "Fianarantsoa, Madagascar",
          description: "Maïs de qualité supérieure, idéal pour l'alimentation animale.",
          mediaUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
          price: "1400 MGA/kg",
          timeAgo: "il y a 5h",
          date: new Date(Date.now() - 5 * 60 * 60 * 1000),
          interestedCount: 120,
          interestedUsers: [
            { id: "u_4", name: "Paul Raso", role: "Collecteur - Mahajanga", rating: 4.0, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Paul" },
          ]
        },
        {
          id: "ad_3",
          productName: "Pommes de terre",
          productionType: "Végétale",
          quantity: "8 tonnes",
          location: "Antsirabe, Madagascar",
          description: "Pommes de terre variété Mona Lisa, calibre 40-60mm.",
          mediaUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
          price: "3500 MGA/kg",
          timeAgo: "il y a 2 jours",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          interestedCount: 45,
          interestedUsers: []
        }
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const confirmDelete = () => {
    if (selectedAdForDelete) {
      setAds((prev) => prev.filter(ad => ad.id !== selectedAdForDelete.id));
      setSelectedAdForDelete(null);
      showToast("L'annonce a été supprimée avec succès.", "success");
    }
  };

  const handleAcceptInterested = (user: InterestedUser, adName: string) => {
    showToast(
      `Vous avez matché avec ${user.name} pour cette annonce. Vous pouvez commencer à discuter.`,
      "success"
    );
    if (selectedAdForInterested) {
      const updatedUsers = selectedAdForInterested.interestedUsers.filter(u => u.id !== user.id);
      setSelectedAdForInterested({
        ...selectedAdForInterested,
        interestedUsers: updatedUsers,
        interestedCount: Math.max(0, selectedAdForInterested.interestedCount - 1)
      });
      setAds(prev => prev.map(ad => ad.id === selectedAdForInterested.id ? {
        ...ad,
        interestedUsers: updatedUsers,
        interestedCount: Math.max(0, ad.interestedCount - 1)
      } : ad));
    }
  };

  const handleRejectInterested = (user: InterestedUser) => {
    showToast(`Vous avez rejeté l'intérêt de ${user.name} pour cette annonce.`, "info");
    if (selectedAdForInterested) {
      const updatedUsers = selectedAdForInterested.interestedUsers.filter(u => u.id !== user.id);
      setSelectedAdForInterested({
        ...selectedAdForInterested,
        interestedUsers: updatedUsers,
        interestedCount: Math.max(0, selectedAdForInterested.interestedCount - 1)
      });
      setAds(prev => prev.map(ad => ad.id === selectedAdForInterested.id ? {
        ...ad,
        interestedUsers: updatedUsers,
        interestedCount: Math.max(0, ad.interestedCount - 1)
      } : ad));
    }
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

    if (filterDate !== "all") {
      const now = new Date();
      const days7 = 7 * 24 * 60 * 60 * 1000;
      const days30 = 30 * 24 * 60 * 60 * 1000;

      filtered = filtered.filter(ad => {
        const diff = now.getTime() - ad.date.getTime();
        switch (filterDate) {
          case "today":
            return ad.date.toDateString() === now.toDateString();
          case "week":
            return diff <= days7;
          case "month":
            return diff <= days30;
          default:
            return true;
        }
      });
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
      {selectedAdForDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 text-center space-y-5 border border-slate-50">
            <div className="mx-auto size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Supprimer l'annonce?</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed px-4">
                Êtes-vous sûr de vouloir supprimer cette annonce? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedAdForDelete(null)} className="flex-1 rounded-xl font-bold border-slate-200 text-slate-600">
                Annuler
              </Button>
              <Button onClick={confirmDelete} className="flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white">
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

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