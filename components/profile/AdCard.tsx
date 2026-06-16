"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2, Scale, MapPin, ChevronDown, ChevronUp } from "lucide-react";

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

interface AdCardProps {
  ad: AdItem;
  isExpanded: boolean;
  onToggleDescription: (id: string) => void;
  onEdit: (ad: AdItem) => void;
  onDelete: (ad: AdItem) => void;
  onViewInterested: (ad: AdItem) => void;
}

export default function AdCard({
  ad,
  isExpanded,
  onToggleDescription,
  onEdit,
  onDelete,
  onViewInterested,
}: AdCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // 🔥 Raccourcir la description si trop longue
  const getShortDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative w-full h-56 md:h-64 lg:h-72 bg-slate-50">
        <img 
          src={ad.mediaUrl} 
          alt={ad.productName} 
          className="w-full h-full object-cover" 
        />
        <span className="absolute top-4 left-4 bg-[#2e7d32] text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
          {ad.productionType}
        </span>
        {/* Badge "Annonce" */}
        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-bold px-3 py-1 rounded-full shadow-md">
          {ad.timeAgo}
        </span>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="space-y-1.5 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              {ad.productName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Scale size={14} /> {ad.quantity}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {ad.location}
              </span>
            </div>
            {isExpanded && (
              <div className="pt-3 mt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <p className="text-xs font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>
            )}
            {!isExpanded && ad.description && (
              <p className="text-xs font-medium text-slate-400 leading-relaxed mt-1">
                {getShortDescription(ad.description)}
              </p>
            )}
          </div>
          <div className="sm:text-right flex-shrink-0 flex flex-col sm:items-end justify-between">
            <span className="text-lg md:text-xl font-extrabold text-[#ffa000]">{ad.price}</span>
            {ad.description && (
              <button
                onClick={() => onToggleDescription(ad.id)}
                className="text-xs font-bold text-slate-500 hover:text-[#2e7d32] mt-1 transition-colors flex items-center gap-1"
              >
                {isExpanded ? (
                  <>Masquer <ChevronUp size={14} /></>
                ) : (
                  <>Détails <ChevronDown size={14} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4 bg-slate-50/50 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5 overflow-hidden">
            {ad.interestedUsers.slice(0, 3).map((usr) => (
              <div
                key={usr.id}
                className="relative size-7 rounded-full border-2 border-white overflow-hidden bg-slate-100 flex-shrink-0"
              >
                <img src={usr.avatar} alt={usr.name} className="object-cover size-full" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-xs font-bold">
            <span className="text-slate-700">
              {ad.interestedCount > 0 
                ? `${ad.interestedCount} personne${ad.interestedCount > 1 ? 's' : ''} intéressée${ad.interestedCount > 1 ? 's' : ''}`
                : "Aucun intéressé pour l'instant"}
            </span>
            {ad.interestedCount > 0 && (
              <button
                onClick={() => onViewInterested(ad)}
                className="text-[#ffa000] hover:underline text-xs font-bold"
              >
                Voir tout
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Menu"
          >
            <MoreVertical size={20} className="text-slate-500" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onEdit(ad);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 hover:bg-green-50/50 hover:text-[#2e7d32] transition-all text-left"
                >
                  <Edit2 size={14} className="text-[#2e7d32]" /> Modifier
                </button>
                <button
                  onClick={() => {
                    onDelete(ad);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left border-t border-slate-100"
                >
                  <Trash2 size={14} className="text-red-500" /> Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}