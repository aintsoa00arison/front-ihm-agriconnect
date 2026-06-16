// app/catalogue/components/AnnuaireFilters.tsx
"use client";

import { X, Filter } from "lucide-react";
import { useState } from "react";

interface AnnuaireFiltersProps {
  searchQuery: string;
  filterType: string;
  filterRating: string;
  activeFiltersCount: number;
  onTypeChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onResetFilters: () => void;
}

const PRODUCTION_TYPES = ["Végétale", "Elevage", "Rente"];
const RATINGS = [
  { label: "Toutes les notes", value: "all" },
  { label: "4 et plus", value: "4" },
  { label: "3 et plus", value: "3" },
  { label: "2 et plus", value: "2" },
  { label: "1 et plus", value: "1" },
];

export default function AnnuaireFilters({
  searchQuery,
  filterType,
  filterRating,
  activeFiltersCount,
  onTypeChange,
  onRatingChange,
  onResetFilters,
}: AnnuaireFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6 space-y-4">
      {/* En-tête des filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-700">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isExpanded ? "Réduire" : "Développer"}
        </button>
      </div>

      {/* Corps des filtres */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Type de production */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Type de production
            </label>
            <select
              value={filterType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl h-9 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D631B] focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              {PRODUCTION_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Note minimale */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Note minimale
            </label>
            <select
              value={filterRating}
              onChange={(e) => onRatingChange(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl h-9 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D631B] focus:border-transparent"
            >
              {RATINGS.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton Réinitialiser */}
          <div className="flex items-end">
            <button
              onClick={onResetFilters}
              className="w-full h-9 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <X size={14} />
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}