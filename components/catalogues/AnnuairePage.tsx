// app/catalogue/AnnuairePage.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AnnuaireHeader from "./AnnuaireHeader";
import AnnuaireFilters from "./AnnuaireFilters";
import AnnuaireCard from "./AnnuaireCard";
import { AnnuaireCardSkeleton } from "./AnnuaireSkeletons";
import AnnuaireEmptyState from "./AnnuaireEmptyState";
import type { UserProfile, FilterState } from "./types/annuaire";
import { profileService } from "../../app/services/profile/profileService";
import { getUserId, getUserRole } from "../../app/services/lib/auth";

interface AnnuairePageProps {
  onBack: () => void;
  onViewProfile?: (userId: string) => void;
}

// Mapping des types de production backend -> affichage
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
    rating: typeof profile.rating === 'number' ? profile.rating : 0,
    avatar: profile.photo || profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    description: profile.bio || profile.company_description || profile.description || "",
  };
};

export default function AnnuairePage({ onBack, onViewProfile }: AnnuairePageProps) {
  const router = useRouter();
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

  // Fonction pour rediriger vers le profil avec l'ID
  const handleViewProfile = (userId: string) => {
    if (onViewProfile) {
      onViewProfile(userId);
    } else {
      const userRole = getUserRole();
      const basePath = userRole === 'fournisseur' || userRole === 'provider' ? '/f' : '/c';
      router.push(`${basePath}/profile/${userId}`);
    }
  };

  // Charger les utilisateurs via Top Providers + Top Collectors
  const loadAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('📦 Chargement des utilisateurs via Top Providers + Top Collectors...');
      
      let results:any = [];
      
      try {
        // ⭐ Essayer avec limit=20
        const [providers, collectors] = await Promise.all([
          profileService.getTopProviders(20),
          profileService.getTopCollectors(20)
        ]);
        results = [...providers, ...collectors];
        console.log('📦 Récupéré avec limit=20:', results.length);
      } catch (error) {
        console.warn('⚠️ Erreur avec limit=20, essai avec limit=5');
        try {
          // ⭐ Fallback avec limit=5
          const [providers, collectors] = await Promise.all([
            profileService.getTopProviders(5),
            profileService.getTopCollectors(5)
          ]);
          results = [...providers, ...collectors];
          console.log('📦 Récupéré avec limit=5:', results.length);
        } catch (err) {
          console.error('❌ Erreur même avec limit=5:', err);
          results = [];
        }
      }
      
      console.log('📦 Utilisateurs récupérés au total:', results.length);
      
      if (!results || results.length === 0) {
        console.warn('⚠️ Aucun utilisateur trouvé');
        setUsers([]);
        setAllUsers([]);
        setIsLoading(false);
        return;
      }
      
      // Filtrer l'utilisateur connecté
      const filteredUsers = results.filter((user: any) => user.id !== currentUserId);
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

  // Rechercher des utilisateurs par nom
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
      const filteredResults = results.filter((user: any) => user.id !== currentUserId);
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

  // Charger tous les utilisateurs au montage
  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  // Écouter l'événement de recherche
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

  // Appliquer les filtres (type et rating) sur la liste actuelle
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
              <AnnuaireCard 
                key={user.id} 
                user={user} 
                onViewProfile={() => handleViewProfile(user.id)}
              />
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