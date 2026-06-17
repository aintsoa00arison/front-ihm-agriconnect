// components/VisiteAdCard.tsx
"use client";

import { useState } from "react";
import { Scale, MapPin, ChevronDown, ChevronUp, Star, Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  interestedUsers: any[];
  sender_id?: string;
}

interface VisiteAdCardProps {
  ad: AdItem;
  isExpanded: boolean;
  onToggleDescription: (id: string) => void;
  onViewProfile: (userId: string) => void;
  onViewInterested: (ad: AdItem) => void;
  userId: string;
}

export default function VisiteAdCard({
  ad,
  isExpanded,
  onToggleDescription,
  onViewProfile,
  onViewInterested,
  userId,
}: VisiteAdCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ Gestion du bouton "Je suis intéressé"
  const handleLike = async () => {
    if (!userId) {
      toast.error("Veuillez vous connecter pour manifester votre intérêt");
      return;
    }

    // Ne pas s'intéresser à sa propre annonce
    if (ad.sender_id === userId) {
      toast.info("Vous ne pouvez pas vous intéresser à votre propre annonce");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Appeler l'API pour manifester l'intérêt
      // await publicationService.expressInterest(ad.id);
      
      setIsLiked(!isLiked);
      toast.success(
        isLiked 
          ? "Vous n'êtes plus intéressé par cette annonce"
          : "Vous avez manifesté votre intérêt pour cette annonce !"
      );
    } catch (error) {
      toast.error("Erreur lors de l'expression d'intérêt");
    } finally {
      setIsLoading(false);
    }
  };

  const getShortDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <TooltipProvider>
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
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-bold px-3 py-1 rounded-full shadow-md">
            {ad.timeAgo}
          </span>
          
          {/* ⭐ Bouton J'aime avec Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLike}
                disabled={isLoading}
                className={`absolute bottom-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                    : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Je suis intéressé"
              >
                <Heart 
                  size={20} 
                  className={isLiked ? 'fill-white' : ''} 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs font-medium">
              {isLiked ? "Je ne suis plus intéressé" : "Je suis intéressé par cette annonce"}
            </TooltipContent>
          </Tooltip>
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
          {/* Partie intérêts - visible pour tout le monde */}
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
        </div>
      </div>
    </TooltipProvider>
  );
}