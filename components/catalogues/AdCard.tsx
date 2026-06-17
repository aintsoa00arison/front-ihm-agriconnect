"use client";

import { useState } from "react";
import { Scale, MapPin, ChevronDown, ChevronUp, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { Ad } from "../../app/services/publication/catalogue";

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
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ Gestion du bouton "Je suis intéressé"
  const handleInterest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Si l'utilisateur n'est pas connecté
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      toast.error("Veuillez vous connecter pour manifester votre intérêt");
      return;
    }

    // Ne pas s'intéresser à sa propre annonce
    if (userId === ad.sender_id) {
      toast.info("Vous ne pouvez pas vous intéresser à votre propre annonce");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Appeler l'API pour manifester l'intérêt
      // await publicationService.expressInterest(ad.id);
      
      setIsInterested(!isInterested);
      toast.success(
        isInterested 
          ? "Vous n'êtes plus intéressé par cette annonce"
          : "Vous avez manifesté votre intérêt pour cette annonce !"
      );
    } catch (error) {
      toast.error("Erreur lors de l'expression d'intérêt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="relative h-56 bg-muted">
          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-lg text-primary-foreground bg-primary">
            {ad.productionType}
          </span>
          
          {/* ⭐ Bouton J'aime avec Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleInterest}
                disabled={isLoading}
                className={`absolute bottom-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
                  isInterested 
                    ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                    : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Je suis intéressé"
              >
                <Heart 
                  size={20} 
                  className={isInterested ? 'fill-white' : ''} 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs font-medium">
              {isInterested ? "Je ne suis plus intéressé" : "Je suis intéressé par cette annonce"}
            </TooltipContent>
          </Tooltip>
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
      </div>
    </TooltipProvider>
  );
}