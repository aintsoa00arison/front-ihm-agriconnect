// app/catalogue/AnnuairePage.tsx
"use client";

import React, { useState, useEffect } from "react";
import AnnuaireHeader from "./AnnuaireHeader";
import AnnuaireFilters from "./AnnuaireFilters";
import AnnuaireCard from "./AnnuaireCard";
import { AnnuaireCardSkeleton } from "./AnnuaireSkeletons";
import AnnuaireEmptyState from "./AnnuaireEmptyState";
import type { TargetRole, UserProfile, FilterState } from "./types/annuaire";

interface AnnuairePageProps {
  type: TargetRole;
  onBack: () => void;
}

// Liste complète fictive des profils
const usersDatabase: UserProfile[] = [
  {
    id: "u1",
    name: "John Doe",
    role: "fournisseurs",
    location: "Antananarivo",
    type: "Végétale",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    description:
      "Producteur spécialisé en céréales de province et cultures maraîchères.",
  },
  {
    id: "u2",
    name: "Jane Cooper",
    role: "fournisseurs",
    location: "Antsirabe",
    type: "Végétale",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    description:
      "Exploitation spécialisée en pommes de terre de table et carottes.",
  },
  {
    id: "u3",
    name: "Rova Centrale",
    role: "collecteurs",
    location: "Fianarantsoa",
    type: "Rente",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    description:
      "Centrale d'achat et approvisionnement pour grossistes régionaux.",
  },
  {
    id: "u4",
    name: "Jenny Wilson",
    role: "fournisseurs",
    location: "Toliara",
    type: "Rente",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    description: "Exportateur de maïs jaune sec et cultures de rente locales.",
  },
  {
    id: "u5",
    name: "Marie Claire",
    role: "fournisseurs",
    location: "Antananarivo",
    type: "Élevage",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    description: "Élevage de volailles et production d'œufs bio.",
  },
  {
    id: "u6",
    name: "Paul Raso",
    role: "collecteurs",
    location: "Mahajanga",
    type: "Végétale",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    description: "Collecteur de fruits et légumes pour la grande distribution.",
  },
];

export default function AnnuairePage({ type, onBack }: AnnuairePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    location: "all",
    type: "all",
    rating: "all",
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Simuler le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Écouter les événements de recherche depuis le header
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener(
      "catalogueSearch",
      handleSearchEvent as EventListener,
    );
    return () =>
      window.removeEventListener(
        "catalogueSearch",
        handleSearchEvent as EventListener,
      );
  }, []);

  // Compter les filtres actifs
  useEffect(() => {
    let count = 0;
    if (searchQuery !== "") count++;
    if (filters.location !== "all") count++;
    if (filters.type !== "all") count++;
    if (filters.rating !== "all") count++;
    setActiveFiltersCount(count);
  }, [searchQuery, filters]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ location: "all", type: "all", rating: "all" });
    window.dispatchEvent(new CustomEvent("catalogueSearch", { detail: "" }));
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredUsers = usersDatabase.filter((user) => {
    if (user.role !== type) return false;

    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      filters.location === "all" || user.location === filters.location;
    const matchesType = filters.type === "all" || user.type === filters.type;
    const matchesRating =
      filters.rating === "all" || user.rating >= parseInt(filters.rating);

    return matchesSearch && matchesLocation && matchesType && matchesRating;
  });

  // AnnuairePage.tsx
  return (
    <div className="w-full h-full overflow-y-auto bg-neutral p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête avec fil d'Ariane */}
        <AnnuaireHeader type={type} onBack={onBack} />

        {/* Filtres - toujours visibles (pas de skeleton) */}
        <AnnuaireFilters
          searchQuery={searchQuery}
          filterLocation={filters.location}
          filterType={filters.type}
          filterRating={filters.rating}
          activeFiltersCount={activeFiltersCount}
          onLocationChange={(value) => updateFilter("location", value)}
          onTypeChange={(value) => updateFilter("type", value)}
          onRatingChange={(value) => updateFilter("rating", value)}
          onResetFilters={resetFilters}
        />

        {/* Compteur de résultats */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">
                {filteredUsers.length}
              </span>{" "}
              {filteredUsers.length === 1
                ? "professionnel trouvé"
                : "professionnels trouvés"}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Grille des résultats avec skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <AnnuaireCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <AnnuaireCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <AnnuaireEmptyState
            searchQuery={searchQuery}
            onResetFilters={resetFilters}
          />
        )}
      </div>
    </div>
  );
}
