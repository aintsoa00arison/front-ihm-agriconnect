// components/AdCard.tsx
"use client";

import { useState } from "react";
import { Scale, MapPin, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Ad } from "../../app/services/publication/catalogue";
import { InviteButton } from "@/components/invitation/InviteButton";

interface AdCardProps {
  ad: Ad;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onViewProfile: (userId: string) => void;
}

export default function AdCard({ 
  ad, 
  isExpanded, 
  onToggleExpand, 
  onViewProfile 
}: AdCardProps) {
  // Raccourcir la description si trop longue
  const getShortDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative w-full h-56 md:h-64 lg:h-72 bg-slate-50">
          <img 
            src={ad.image} 
            alt={ad.title} 
            className="w-full h-full object-cover" 
          />
          <span className="absolute top-4 left-4 bg-[#2e7d32] text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            {ad.productionType}
          </span>
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-bold px-3 py-1 rounded-full shadow-md">
            {ad.timeAgo}
          </span>
          
          {/* ⭐ Bouton Inviter (cœur) */}
       <InviteButton 
  targetUserId={ad.sender_id || ad.author.id}
  targetName={ad.author.name}
  adTitle={ad.title}
  publicationId={ad.id}  // ⭐ Passer l'ID de la publication
  className="absolute bottom-4 right-4"
/>
        </div>

        <div className="p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="space-y-1.5 flex-1">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                {ad.title}
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
              <span className="text-lg md:text-xl font-extrabold text-[#ffa000]">
                {ad.price.toLocaleString()} <span className="text-xs font-bold text-muted-foreground uppercase">Mga/{ad.unit}</span>
              </span>
              {ad.description && (
                <button
                  onClick={() => onToggleExpand(ad.id)}
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
          {/* Auteur */}
          <div className="flex items-center gap-2">
            <img 
              src={ad.author.avatar} 
              className="size-9 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
              alt={ad.author.name}
              onClick={() => onViewProfile(ad.author.id)}
            />
            <div>
              <button 
                onClick={() => onViewProfile(ad.author.id)}
                className="text-xs font-bold text-foreground hover:text-primary hover:underline transition-colors text-left"
              >
                {ad.author.name}
              </button>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < Math.floor(ad.author.rating) ? "currentColor" : "none"} />
                ))}
                <span className="text-[10px] font-bold text-muted-foreground ml-1">
                  {ad.author.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => onViewProfile(ad.author.id)}
            className="h-8 text-xs font-bold text-primary border-primary/20 bg-primary/10 hover:bg-primary/20"
          >
            Profil
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}