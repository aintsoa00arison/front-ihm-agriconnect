// app/catalogue/components/AnnuaireFilters.tsx
"use client";

import { SlidersHorizontal, MapPin, Tag, Star, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnnuaireFiltersProps {
  searchQuery: string;
  filterLocation: string;
  filterType: string;
  filterRating: string;
  activeFiltersCount: number;
  onLocationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onResetFilters: () => void;
}

const LOCATIONS = ["Antananarivo", "Antsirabe", "Fianarantsoa", "Toliara", "Mahajanga"];
const PRODUCTION_TYPES = ["Végétale", "Élevage", "Rente"];

export default function AnnuaireFilters({
  filterLocation,
  filterType,
  filterRating,
  activeFiltersCount,
  onLocationChange,
  onTypeChange,
  onRatingChange,
  onResetFilters,
}: AnnuaireFiltersProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Filtres</h3>
          {activeFiltersCount > 0 && (
            <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button 
            onClick={onResetFilters}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Réinitialiser
          </button>
        )}
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Filtre Localisation */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <MapPin size={12} />
            Localisation
          </label>
          <Select value={filterLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="h-10 border-border rounded-xl text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Type de production */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Tag size={12} />
            Type de production
          </label>
          <Select value={filterType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-10 border-border rounded-xl text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {PRODUCTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Note minimale */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Star size={12} className="text-amber-400" />
            Note minimale
          </label>
          <Select value={filterRating} onValueChange={onRatingChange}>
            <SelectTrigger className="h-10 border-border rounded-xl text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
              <SelectValue placeholder="Toutes les notes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="5">5 étoiles</SelectItem>
              <SelectItem value="4">4+ étoiles</SelectItem>
              <SelectItem value="3">3+ étoiles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}