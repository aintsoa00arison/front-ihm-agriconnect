"use client";

import { ChevronDown, SlidersHorizontal, X, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFiltersProps {
  filterType: string;
  filterDate: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  onFilterTypeChange: (value: string) => void;
  onFilterDateChange: (value: string) => void;
  onResetFilters: () => void;
}

export default function ProfileFilters({
  filterType,
  filterDate,
  showFilters,
  onToggleFilters,
  onFilterTypeChange,
  onFilterDateChange,
  onResetFilters,
}: ProfileFiltersProps) {
  const hasActiveFilters = filterType !== "all" || filterDate !== "all";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggleFilters}
        className="w-full p-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#2e7d32]" />
          <span className="text-sm font-bold text-slate-700">Filtres</span>
          {hasActiveFilters && (
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Type de production
              </label>
              <Select value={filterType} onValueChange={onFilterTypeChange}>
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
              <Select value={filterDate} onValueChange={onFilterDateChange}>
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
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={onResetFilters}
                className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1"
              >
                <X size={12} /> Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}