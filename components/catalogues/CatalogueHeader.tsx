// app/catalogue/CatalogueHeader.tsx
"use client";

import type { UserRole } from "./types/catalogue";

interface CatalogueHeaderProps {
  userRole: UserRole;
  totalResults?: number;
  totalItems?: number;
  searchQuery?: string;
}

export default function CatalogueHeader({ 
  userRole, 
  totalResults, 
  totalItems, 
  searchQuery 
}: CatalogueHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4">
      <h1 className="text-3xl font-extrabold text-foreground mb-2">Catalogue</h1>
      <p className="text-sm text-muted-foreground">
        {userRole === "fournisseur" 
          ? "Consultez les demandes d'achat des collecteurs" 
          : "Découvrez les annonces de vente des fournisseurs"}
      </p>
    
      {!searchQuery && totalResults !== undefined && totalItems !== undefined && totalResults !== totalItems && (
        <p className="text-xs text-muted-foreground mt-2">
          {totalResults} résultat{totalResults !== 1 ? 's' : ''} sur {totalItems}
        </p>
      )}
    </div>
  );
}