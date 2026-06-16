"use client";

import { Scale, MapPin, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Ad } from "../../app/services/publication/catalogue";

interface AdCardProps {
  ad: Ad;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onViewProfile: (authorName: string) => void;
}

export default function AdCard({ ad, isExpanded, onToggleExpand, onViewProfile }: AdCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="relative h-56 bg-muted">
        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-lg text-primary-foreground bg-primary">
          {ad.productionType}
        </span>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-1 flex-wrap">
              {ad.title} 
              <span className="text-xs font-semibold text-muted-foreground">{ad.timeAgo}</span>
            </h2>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground mt-1">
              <span className="flex items-center gap-1.5">
                <Scale size={14} /> {ad.quantity}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {ad.location}
              </span>
            </div>
          </div>
          <div className="md:text-right md:flex md:flex-col md:items-end flex justify-between w-full md:w-auto">
            <p className="text-xl font-black text-secondary">
              {ad.price.toLocaleString()} <span className="text-xs font-bold text-muted-foreground uppercase">Mga/{ad.unit}</span>
            </p>
            <button 
              onClick={() => onToggleExpand(ad.id)} 
              className="text-xs font-bold text-foreground hover:underline mt-1 flex items-center gap-1"
            >
              voir détails {isExpanded ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">{ad.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <img src={ad.author.avatar} className="size-9 rounded-full object-cover" alt={ad.author.name} />
            <div>
              <p className="text-xs font-bold text-foreground">{ad.author.name}</p>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < ad.author.rating ? "currentColor" : "none"} />
                ))}
                <span className="text-[10px] font-bold text-muted-foreground ml-1">
                  {ad.author.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onViewProfile(ad.author.name)}
            className="h-8 text-xs font-bold text-primary border-primary/20 bg-primary/10 hover:bg-primary/20"
          >
            Profil
          </Button>
        </div>
      </div>
    </div>
  );
}