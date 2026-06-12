"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreVertical, Edit2, Trash2, X, Star, Check, AlertTriangle, Scale, MapPin, ChevronDown, ChevronUp, Bell, SlidersHorizontal, Calendar, ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // --- Données de l'annonce ---
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fonction pour filtrer les annonces
  const getFilteredAds = () => {
    let filtered = [...ads];

    // Filtre par recherche
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(ad => 
        ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par type de production
    if (filterType !== "all") {
      filtered = filtered.filter(ad => ad.productionType === filterType);
    }

    // Filtre par date
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

  const filteredAds = getFilteredAds();

  // --- États UI ---
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedAdForInterested, setSelectedAdForInterested] = useState<AdItem | null>(null);
  const [selectedAdForDelete, setSelectedAdForDelete] = useState<AdItem | null>(null);
  const [expandedAdIds, setExpandedAdIds] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<ToastState[]>([]);

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

  const handleDeleteAd = (id: string) => {
    setAds((prev) => prev.filter(ad => ad.id !== id));
    setSelectedAdForDelete(null);
    showToast("L'annonce a été supprimée avec succès.", "success");
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

  // Reset filters
  const resetFilters = () => {
    setFilterType("all");
    setFilterDate("all");
  };

  // --- Skeleton Loader ---
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
      
      {/* Pop-ups / Toasts de notification en bas à droite */}
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

      {/* Barre de filtres */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full p-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#2e7d32]" />
            <span className="text-sm font-bold text-slate-700">Filtres</span>
            {(filterType !== "all" || filterDate !== "all") && (
              <span className="text-xs font-bold bg-[#2e7d32] text-white px-2 py-0.5 rounded-full">
                {(filterType !== "all" ? 1 : 0) + (filterDate !== "all" ? 1 : 0)}
              </span>
            )}
          </div>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {showFilters && (
          <div className="p-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filtre par type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Type de production</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-10 border-slate-200 rounded-xl text-sm bg-slate-50/50">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Végétale">Végétale</SelectItem>
                    <SelectItem value="Élevage">Élevage</SelectItem>
                    <SelectItem value="Rente">Rente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Calendar size={12} /> Période
                </label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="h-10 border-slate-200 rounded-xl text-sm bg-slate-50/50">
                    <SelectValue placeholder="Toutes les périodes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les périodes</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bouton réinitialiser */}
            {(filterType !== "all" || filterDate !== "all") && (
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
        filteredAds.map((ad) => {
          const isExpanded = !!expandedAdIds[ad.id];
          return (
            <div key={ad.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div>
                <div className="relative w-full h-56 md:h-72 bg-slate-50">
                  <img src={ad.mediaUrl} alt={ad.productName} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-[#2e7d32] text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    {ad.productionType}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1.5 flex-1">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        {ad.productName}
                        <span className="text-xs font-semibold text-slate-400 normal-case">{ad.timeAgo}</span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Scale size={14} />{ad.quantity}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} />{ad.location}</span>
                      </div>
                      {isExpanded && (
                        <div className="pt-3 mt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">{ad.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="sm:text-right flex-shrink-0 flex flex-col sm:items-end justify-between min-h-[50px]">
                      <span className="text-xl font-extrabold text-[#ffa000]">{ad.price}</span>
                      <button onClick={() => toggleDescription(ad.id)} className="text-xs font-bold text-slate-900 hover:text-[#2e7d32] mt-1 underline transition-colors flex items-center gap-1">
                        {isExpanded ? <>masquer détails<ChevronUp size={14} /></> : <>voir détails<ChevronDown size={14} /></>}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {ad.interestedUsers.slice(0, 3).map((usr) => (
                        <div key={usr.id} className="relative size-7 rounded-full border-2 border-white overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={usr.avatar} alt={usr.name} className="object-cover size-full" />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs font-bold">
                      <span className="text-slate-800">{ad.interestedCount} personnes sont intéressées</span>
                      <button onClick={() => setSelectedAdForInterested(ad)} className="text-[#ffa000] hover:underline">voir tout</button>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === ad.id ? null : ad.id)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <MoreVertical size={20} className="text-slate-600" />
                    </button>
                    {activeMenuId === ad.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button onClick={() => { onEditAd(ad); setActiveMenuId(null); }} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 hover:bg-green-50/50 hover:text-[#2e7d32] transition-all text-left">
                            <Edit2 size={14} className="text-[#2e7d32]" /> Modifier
                          </button>
                          <button onClick={() => { setSelectedAdForDelete(ad); setActiveMenuId(null); }} className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left border-t border-slate-100">
                            <Trash2 size={14} className="text-red-500" /> Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Modale intéressés */}
      {selectedAdForInterested && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800">Liste des Intéressés</h3>
              <button onClick={() => setSelectedAdForInterested(null)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"><X size={18} /></button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {selectedAdForInterested.interestedUsers.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400 font-bold">Aucun profil restant.</p>
              ) : (
                selectedAdForInterested.interestedUsers.map((usr) => (
                  <div key={usr.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden bg-slate-100 border">
                        <img src={usr.avatar} alt={usr.name} className="size-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{usr.name}</h4>
                        <p className="text-[10px] font-medium text-slate-400">{usr.role}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} size={10} className={idx < Math.floor(usr.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-xs font-bold text-[#ffa000] hover:underline">Profil</button>
                      <button onClick={() => handleAcceptInterested(usr, selectedAdForInterested.productName)} className="p-2 bg-emerald-50 text-[#2e7d32] rounded-xl hover:bg-[#e8f5e9]"><Check size={14} strokeWidth={3} /></button>
                      <button onClick={() => handleRejectInterested(usr)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><X size={14} strokeWidth={2.5} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale suppression */}
      {selectedAdForDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 text-center space-y-5 border border-slate-50">
            <div className="mx-auto size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><AlertTriangle size={32} /></div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Supprimer l'annonce?</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed px-4">Êtes-vous sûr de vouloir supprimer cette annonce? Cette action est irréversible.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedAdForDelete(null)} className="flex-1 rounded-xl font-bold border-slate-200 text-slate-600">Annuler</Button>
              <Button onClick={() => handleDeleteAd(selectedAdForDelete.id)} className="flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white">Supprimer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Flèche de défilement vers le haut */}
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