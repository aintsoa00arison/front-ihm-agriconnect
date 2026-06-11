"use client";

import { useState } from "react";
import {
  MoreVertical, Edit2, Trash2, X, Star, Check, Ban, AlertTriangle, Scale, MapPin, ChevronDown, ChevronUp, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [ads, setAds] = useState<AdItem[]>([
    {
      id: "ad_1",
      productName: "Blé de province",
      productionType: "Végétale",
      quantity: "3 tonnes",
      location: "Antananarivo, Madagascar",
      description: "Cultivé sous le soleil de Midi sur des terres préservées, ce blé offre des arômes de noisette et une digestibilité optimale. Naturellement riche en minéraux et faible en gluten, il est l'allié parfait d'une cuisine saine et savoureuse.",
      mediaUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
      price: "3000 MGA/kg",
      timeAgo: "il y a 2h",
      interestedCount: 250,
      interestedUsers: [
        { id: "u_1", name: "John Doe", role: "Collecteur - Fianarantsoa", rating: 5.0, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=John" },
        { id: "u_2", name: "Jane Cooper", role: "Producteur - Elevage", rating: 4.2, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Jane" },
        { id: "u_3", name: "Jenny Wilson", role: "Grossiste - Rente", rating: 4.5, avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Jenny" },
      ]
    }
  ]);

  // --- États UI ---
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedAdForInterested, setSelectedAdForInterested] = useState<AdItem | null>(null);
  const [selectedAdForDelete, setSelectedAdForDelete] = useState<AdItem | null>(null);
  const [expandedAdIds, setExpandedAdIds] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Affichage d'un toast temporaire (sans couleur bleue)
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
      `Vous avez matché ou vous avez approuvé le profil de ${user.name} pour cette annonce. Vous pouvez commencer à discuter avec lui.`,
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

  return (
    <div className="space-y-6 relative">
      
      {/* Pop-ups / Toasts de notification (Sans aucune touche de bleu) */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none">
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

      {/* Cartes d'annonces */}
      {ads.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed">
          Aucune annonce trouvée.
        </div>
      ) : (
        ads.map((ad) => {
          const isExpanded = !!expandedAdIds[ad.id];
          return (
            <div key={ad.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div>
                {/* Image principale */}
                <div className="relative w-full h-56 md:h-72 bg-slate-50">
                  <img src={ad.mediaUrl} alt={ad.productName} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-[#2e7d32] text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    {ad.productionType}
                  </span>
                </div>

                {/* Contenu textuel */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1.5 flex-1">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        {ad.productName}
                        <span className="text-xs font-semibold text-slate-400 normal-case">{ad.timeAgo}</span>
                      </h2>
                      
                      {/* Quantité et Localisation */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Scale size={14} />
                          {ad.quantity}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {ad.location}
                        </span>
                      </div>

                      {/* Zone déroulante : Positionnée exactement en bas du bloc Quantité / Localisation */}
                      {isExpanded && (
                        <div className="pt-3 mt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            {ad.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Prix et Bouton de détails interactif (Noir -> Primary au survol) */}
                    <div className="sm:text-right flex-shrink-0 flex flex-col sm:items-end justify-between min-h-[50px]">
                      <span className="text-xl font-extrabold text-[#ffa000]">{ad.price}</span>
                      
                      <button 
                        onClick={() => toggleDescription(ad.id)}
                        className="text-xs font-bold text-slate-900 hover:text-[#2e7d32] mt-1 underline transition-colors flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            masquer détails
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            voir détails
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pied de page : Personnes intéressées et Actions */}
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
                      <button onClick={() => setSelectedAdForInterested(ad)} className="text-[#ffa000] hover:underline">
                        voir tout
                      </button>
                    </div>
                  </div>

                  {/* Menu options à trois points */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === ad.id ? null : ad.id)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <MoreVertical size={20} className="text-slate-600" />
                    </button>

                    {activeMenuId === ad.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => {
                              onEditAd(ad);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 hover:bg-green-50/50 hover:text-[#2e7d32] transition-all text-left"
                          >
                            <Edit2 size={14} className="text-[#2e7d32]" />
                            Modifier
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAdForDelete(ad);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left border-t border-slate-100"
                          >
                            <Trash2 size={14} className="text-red-500" />
                            Supprimer
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

      {/* Modal : Liste des Intéressés */}
      {selectedAdForInterested && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800">Liste des Intéressés</h3>
              <button onClick={() => setSelectedAdForInterested(null)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={18} />
              </button>
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
                      
                      {/* Bouton Matcher / Approuver */}
                      <button 
                        onClick={() => handleAcceptInterested(usr, selectedAdForInterested.productName)}
                        className="p-2 bg-emerald-50 text-[#2e7d32] rounded-xl hover:bg-[#e8f5e9]"
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>

                      {/* Bouton Rejeter (Croix / Aucune touche de bleu) */}
                      <button 
                        onClick={() => handleRejectInterested(usr)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal : Confirmation de Suppression */}
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
              <Button onClick={() => handleDeleteAd(selectedAdForDelete.id)} className="flex-1 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white">
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}