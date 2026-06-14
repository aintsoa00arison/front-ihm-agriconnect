// app/catalogue/components/AnnuaireEmptyState.tsx
"use client";

import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnuaireEmptyStateProps {
  searchQuery: string;
  onResetFilters: () => void;
}

export default function AnnuaireEmptyState({ searchQuery, onResetFilters }: AnnuaireEmptyStateProps) {
  return (
    <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 bg-muted rounded-full">
          <UserCheck size={32} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {searchQuery 
            ? `Aucun professionnel ne correspond à votre recherche "${searchQuery}"`
            : "Aucun professionnel ne correspond à vos critères de recherche."}
        </p>
        <Button 
          onClick={onResetFilters}
          variant="outline"
          className="mt-2 rounded-xl text-primary border-primary/20"
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
}