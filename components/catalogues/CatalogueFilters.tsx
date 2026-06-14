// app/catalogue/CatalogueFilters.tsx
"use client";

import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CatalogueFiltersProps {
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
  minRating: string;
  onRatingChange: (value: string) => void;
}

const PRODUCTION_TYPES = ["Végétale", "Élevage", "Rente"];

export default function CatalogueFilters({ 
  selectedTypes, 
  onTypeChange, 
  minRating, 
  onRatingChange 
}: CatalogueFiltersProps) {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border pb-1.5">
        <SlidersHorizontal size={14} /> Filtres
      </h3>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Types</label>
        <div className="grid grid-cols-3 gap-1">
          {PRODUCTION_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-1.5">
              <Checkbox 
                id={`filter-${type}`} 
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => onTypeChange(type)}
                className="size-3.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor={`filter-${type}`} className="text-[11px] font-semibold text-foreground cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Note minimale</label>
        <Select value={minRating} onValueChange={onRatingChange}>
          <SelectTrigger className="h-8 text-xs rounded-xl bg-muted/50 border-border">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les notes</SelectItem>
            <SelectItem value="5">5 étoiles +</SelectItem>
            <SelectItem value="4">4 étoiles +</SelectItem>
            <SelectItem value="3">3 étoiles +</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}