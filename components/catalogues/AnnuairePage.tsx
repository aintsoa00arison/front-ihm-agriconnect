// app/catalogue/AnnuairePage.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import AnnuaireHeader from "./AnnuaireHeader";
import AnnuaireFilters from "./AnnuaireFilters";
import AnnuaireCard from "./AnnuaireCard";
import { AnnuaireCardSkeleton } from "./AnnuaireSkeletons";
import AnnuaireEmptyState from "./AnnuaireEmptyState";
import type { UserProfile, FilterState } from "./types/annuaire";
import { profileService } from "../../app/services/profile/profileService";
import { getUserId } from "../../app/services/lib/auth";

interface AnnuairePageProps {
  onBack: () => void;
}

// 🔥 Mapping des types de production backend -> affichage
const PRODUCTION_TYPE_MAP: Record<string, string> = {
  'VEGETAL': 'Végétale',
  'ANIMAL': 'Elevage',
  'CEREAL': 'Rente'
};

const transformProfileToUser = (profile: any): UserProfile => {
  const role = profile.role === 'collecteur' || profile.role === 'collector' 
    ? 'collecteurs' 
    : 'fournisseurs';
  
  const rawType = profile.product_category && profile.product_category.length > 0
    ? profile.product_category[0]
    : "Non spécifié";
  
  const displayType = PRODUCTION_TYPE_MAP[rawType] || rawType;
  
  return {
    id: profile.id,
    name: profile.name || "Utilisateur",
    role: role,
    location: profile.address || profile.registered_office || "Non spécifié",
    type: displayType,
    
    rating: profile.rating || 0,
    avatar: profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    description: profile.bio || profile.company_description || profile.description || "",
  };
};

export default function AnnuairePage({ onBack }: AnnuairePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    location: "all",
    type: "all",
    rating: "all",
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const currentUserId = getUserId();

  // 🔥 Charger tous les utilisateurs depuis le backend
  const loadAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('📦 Chargement de tous les utilisateurs...');
      const results = await profileService.getAllUsers();
      console.log('📦 Utilisateurs récupérés:', results.length);
      
      const filteredUsers = results.filter(user => user.id !== currentUserId);
      const transformedUsers = filteredUsers.map(transformProfileToUser);
      
      setAllUsers(transformedUsers);
      setUsers(transformedUsers);
      console.log('📦 Utilisateurs transformés:', transformedUsers.length);
    } catch (error) {
      console.error('❌ Erreur chargement des utilisateurs:', error);
      setAllUsers([]);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  // 🔥 Rechercher des utilisateurs par nom via le backend
  const searchUsersByName = useCallback(async (name: string) => {
    console.log('🔍 searchUsersByName appelé avec:', name);
    
    if (!name.trim()) {
      console.log('📦 Recherche vide, retour à la liste complète');
      await loadAllUsers();
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🔍 Recherche d'utilisateurs avec le nom: "${name}"`);
      const results = await profileService.searchUsersByName(name);
      console.log('📦 Résultats de recherche (brut):', results.length);
      
      // Exclure l'utilisateur connecté
      const filteredResults = results.filter(user => user.id !== currentUserId);
      console.log('📦 Après exclusion current user:', filteredResults.length);
      
      const transformedUsers = filteredResults.map(transformProfileToUser);
      console.log('📦 Utilisateurs transformés:', transformedUsers.length);
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('❌ Erreur recherche utilisateurs:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, loadAllUsers]);

  // 🔥 Charger tous les utilisateurs au montage
  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  // 🔥 Écouter l'événement de recherche spécifique à l'annuaire
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      const query = event.detail || "";
      console.log('🔍 Événement annuaireSearch reçu:', query);
      setSearchQuery(query);
      searchUsersByName(query);
    };

    window.addEventListener("annuaireSearch", handleSearchEvent as EventListener);
    console.log('✅ Écouteur annuaireSearch ajouté');
    
    return () => {
      window.removeEventListener("annuaireSearch", handleSearchEvent as EventListener);
      console.log('❌ Écouteur annuaireSearch retiré');
    };
  }, [searchUsersByName]);

  // 🔥 Appliquer les filtres (type et rating) sur la liste actuelle
  useEffect(() => {
    if (users.length === 0) return;

    let filtered = [...users];

    // Filtrer par type de production
    if (filters.type !== "all") {
      filtered = filtered.filter(user => user.type === filters.type);
    }

    // Filtrer par rating
    if (filters.rating !== "all") {
      const minRating = parseInt(filters.rating);
      filtered = filtered.filter(user => user.rating >= minRating);
    }

    setUsers(filtered);
  }, [filters]);

  // Compter les filtres actifs
  useEffect(() => {
    let count = 0;
    if (searchQuery !== "") count++;
    if (filters.type !== "all") count++;
    if (filters.rating !== "all") count++;
    setActiveFiltersCount(count);
  }, [searchQuery, filters]);

  const resetFilters = () => {
    console.log('🔄 Réinitialisation des filtres');
    setSearchQuery("");
    setFilters({ location: "all", type: "all", rating: "all" });
    window.dispatchEvent(new CustomEvent("annuaireSearch", { detail: "" }));
    loadAllUsers();
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    console.log(`🔍 Filtre ${key} mis à jour:`, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-neutral p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        <AnnuaireHeader onBack={onBack} />

        <AnnuaireFilters
          searchQuery={searchQuery}
          filterType={filters.type}
          filterRating={filters.rating}
          activeFiltersCount={activeFiltersCount}
          onTypeChange={(value) => updateFilter("type", value)}
          onRatingChange={(value) => updateFilter("rating", value)}
          onResetFilters={resetFilters}
        />

        {!isLoading && users.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">
                {users.length}
              </span>{" "}
              {users.length === 1
                ? "membre trouvé"
                : "membres trouvés"}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <AnnuaireCardSkeleton key={index} />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
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