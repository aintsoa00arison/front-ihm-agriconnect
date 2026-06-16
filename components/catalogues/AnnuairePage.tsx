"use client";

import React, { useState, useEffect } from "react";
import AnnuaireHeader from "./AnnuaireHeader";
import AnnuaireFilters from "./AnnuaireFilters";
import AnnuaireCard from "./AnnuaireCard";
import { AnnuaireCardSkeleton } from "./AnnuaireSkeletons";
import AnnuaireEmptyState from "./AnnuaireEmptyState";
import type { TargetRole, UserProfile, FilterState } from "./types/annuaire";
import { profileService } from "../../app/services/profile/profileService";
import { getUserId } from "../../app/services/lib/auth";

interface AnnuairePageProps {
  type: TargetRole;
  onBack: () => void;
}

// 🔥 Fonction pour transformer ProfileData en UserProfile
const transformProfileToUser = (profile: any): UserProfile => {
  // Déterminer le rôle
  const role = profile.role === 'collecteur' || profile.role === 'collector' 
    ? 'collecteurs' 
    : 'fournisseurs';
  
  // Déterminer le type de production (premier élément ou "Non spécifié")
  const productionType = profile.product_category && profile.product_category.length > 0
    ? profile.product_category[0]
    : "Non spécifié";
  
  return {
    id: profile.id,
    name: profile.name || "Utilisateur",
    role: role,
    location: profile.address || profile.registered_office || "Non spécifié",
    type: productionType,
    rating: profile.rating || 0,
    avatar: profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    description: profile.bio || profile.company_description || profile.description || "",
  };
};

export default function AnnuairePage({ type, onBack }: AnnuairePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    location: "all",
    type: "all",
    rating: "all",
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const currentUserId = getUserId();

  // 🔥 Charger tous les utilisateurs depuis le backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // 🔥 Récupérer tous les utilisateurs via searchUsersByName avec une chaîne vide
        // pour obtenir tous les utilisateurs
        const results = await profileService.searchUsersByName("");
        console.log('📦 Utilisateurs récupérés:', results);
        
        // 🔥 Filtrer pour exclure l'utilisateur connecté
        const filteredUsers = results.filter(user => user.id !== currentUserId);
        console.log('📦 Utilisateurs après filtrage (exclu current):', filteredUsers);
        
        // 🔥 Transformer en UserProfile
        const transformedUsers = filteredUsers.map(transformProfileToUser);
        console.log('📦 Utilisateurs transformés:', transformedUsers);
        
        setUsers(transformedUsers);
      } catch (error) {
        console.error('❌ Erreur chargement des utilisateurs:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentUserId]);

  // Écouter les événements de recherche depuis le header
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener("catalogueSearch", handleSearchEvent as EventListener);
    return () =>
      window.removeEventListener("catalogueSearch", handleSearchEvent as EventListener);
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

  // 🔥 Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    // Filtrer par rôle (type: 'fournisseurs' ou 'collecteurs')
    if (user.role !== type) return false;

    // Filtrer par recherche
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrer par localisation
    const matchesLocation =
      filters.location === "all" || user.location === filters.location;

    // Filtrer par type de production
    const matchesType =
      filters.type === "all" || user.type === filters.type;

    // Filtrer par rating
    const matchesRating =
      filters.rating === "all" || user.rating >= parseInt(filters.rating);

    return matchesSearch && matchesLocation && matchesType && matchesRating;
  });

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