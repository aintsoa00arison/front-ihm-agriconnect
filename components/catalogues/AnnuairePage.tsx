// app/catalogue/AnnuairePage.tsx
"use client";

import React, { useState, useEffect } from "react";
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

// 🔥 Fonction pour transformer ProfileData en UserProfile
const transformProfileToUser = (profile: any): UserProfile => {
  const role = profile.role === 'collecteur' || profile.role === 'collector' 
    ? 'collecteurs' 
    : 'fournisseurs';
  
  // 🔥 Convertir la valeur backend en valeur d'affichage
  const rawType = profile.product_category && profile.product_category.length > 0
    ? profile.product_category[0]
    : "Non spécifié";
  
  const displayType = PRODUCTION_TYPE_MAP[rawType] || rawType;
  
  return {
    id: profile.id,
    name: profile.name || "Utilisateur",
    role: role,
    location: profile.address || profile.registered_office || "Non spécifié",
    type: displayType, // 🔥 Utiliser la valeur d'affichage
   
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
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const results = await profileService.getAllUsers();
        console.log('📦 Utilisateurs récupérés:', results.length);
        console.log('📦 Premier utilisateur:', results[0]);
        
        const filteredUsers = results.filter(user => user.id !== currentUserId);
        const transformedUsers = filteredUsers.map(transformProfileToUser);
        
        console.log('📦 Utilisateurs transformés:', transformedUsers.length);
        console.log('📦 Types de production:', transformedUsers.map(u => u.type));
        
        setAllUsers(transformedUsers);
        setUsers(transformedUsers);
      } catch (error) {
        console.error('❌ Erreur chargement des utilisateurs:', error);
        setAllUsers([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentUserId]);

  // 🔥 Appliquer les filtres sur la liste complète
  useEffect(() => {
    let filtered = [...allUsers];

    console.log('🔍 Filtres appliqués:', filters);
    console.log('🔍 Nombre d\'utilisateurs avant filtrage:', filtered.length);

    // 🔥 Filtrer par type de production
    if (filters.type !== "all") {
      filtered = filtered.filter(user => {
        const match = user.type === filters.type;
        console.log(`🔍 User ${user.name} type=${user.type}, filtre=${filters.type}, match=${match}`);
        return match;
      });
    }

    // 🔥 Filtrer par rating
    if (filters.rating !== "all") {
      const minRating = parseInt(filters.rating);
      filtered = filtered.filter(user => user.rating >= minRating);
    }

    // 🔥 Filtrer par recherche
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log('🔍 Nombre d\'utilisateurs après filtrage:', filtered.length);
    setUsers(filtered);
  }, [allUsers, filters, searchQuery]);

  // 🔥 Recherche depuis le header
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
    if (filters.type !== "all") count++;
    if (filters.rating !== "all") count++;
    setActiveFiltersCount(count);
  }, [searchQuery, filters]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ location: "all", type: "all", rating: "all" });
    window.dispatchEvent(new CustomEvent("catalogueSearch", { detail: "" }));
    setUsers(allUsers);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
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