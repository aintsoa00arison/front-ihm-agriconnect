"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Star, SlidersHorizontal, Tag, UserCheck, ArrowLeft, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type TargetRole = "fournisseurs" | "collecteurs";

interface AnnuairePageProps {
  type: TargetRole;
  onBack: () => void;
}

// Liste complète fictive des profils
const usersDatabase = [
  { id: "u1", name: "John Doe", role: "fournisseurs", location: "Antananarivo", type: "Végétale", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", description: "Producteur spécialisé en céréales de province et cultures maraîchères." },
  { id: "u2", name: "Jane Cooper", role: "fournisseurs", location: "Antsirabe", type: "Végétale", rating: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", description: "Exploitation spécialisée en pommes de terre de table et carottes." },
  { id: "u3", name: "Rova Centrale", role: "collecteurs", location: "Fianarantsoa", type: "Rente", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", description: "Centrale d'achat et approvisionnement pour grossistes régionaux." },
  { id: "u4", name: "Jenny Wilson", role: "fournisseurs", location: "Toliara", type: "Rente", rating: 4, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", description: "Exportateur de maïs jaune sec et cultures de rente locales." },
  { id: "u5", name: "Marie Claire", role: "fournisseurs", location: "Antananarivo", type: "Élevage", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", description: "Élevage de volailles et production d'œufs bio." },
  { id: "u6", name: "Paul Raso", role: "collecteurs", location: "Mahajanga", type: "Végétale", rating: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", description: "Collecteur de fruits et légumes pour la grande distribution." },
];

export default function AnnuairePage({ type, onBack }: AnnuairePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Simuler le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Écouter les événements de recherche depuis le header
  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener("catalogueSearch", handleSearchEvent as EventListener);
    
    return () => {
      window.removeEventListener("catalogueSearch", handleSearchEvent as EventListener);
    };
  }, []);

  // Compter les filtres actifs
  useEffect(() => {
    let count = 0;
    if (searchQuery !== "") count++;
    if (filterLocation !== "all") count++;
    if (filterType !== "all") count++;
    if (filterRating !== "all") count++;
    setActiveFiltersCount(count);
  }, [searchQuery, filterLocation, filterType, filterRating]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterLocation("all");
    setFilterType("all");
    setFilterRating("all");
    // Également vider la recherche dans le header
    window.dispatchEvent(new CustomEvent("catalogueSearch", { detail: "" }));
  };

  const filteredUsers = usersDatabase.filter((user) => {
    if (user.role !== type) return false;
    
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = filterLocation === "all" || user.location === filterLocation;
    const matchesType = filterType === "all" || user.type === filterType;
    const matchesRating = filterRating === "all" || user.rating >= parseInt(filterRating);

    return matchesSearch && matchesLocation && matchesType && matchesRating;
  });

  // Composant Skeleton pour la carte
  const CardSkeleton = () => (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="flex gap-3">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
          <div className="h-5 bg-muted rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 mt-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="size-3 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-8 bg-muted rounded-xl w-32"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-neutral p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête avec bouton de retour */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground capitalize flex items-center gap-2">
              <UserCheck className="text-primary" />
              Liste des {type}
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {type === "fournisseurs" 
                ? "Découvrez les producteurs partenaires près de chez vous" 
                : "Trouvez les collecteurs qui recherchent vos produits"}
            </p>
          </div>
        </div>

        {/* --- BARRE DE FILTRES --- */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Filtres</h3>
              {activeFiltersCount > 0 && (
                <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button 
                onClick={resetFilters}
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <X size={12} />
                Réinitialiser
              </button>
            )}
          </div>
          
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Filtre Localisation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <MapPin size={12} />
                Localisation
              </label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="h-10 border-border rounded-xl text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"> Toutes les villes</SelectItem>
                  <SelectItem value="Antananarivo"> Antananarivo</SelectItem>
                  <SelectItem value="Antsirabe"> Antsirabe</SelectItem>
                  <SelectItem value="Fianarantsoa"> Fianarantsoa</SelectItem>
                  <SelectItem value="Toliara"> Toliara</SelectItem>
                  <SelectItem value="Mahajanga"> Mahajanga</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Type de production */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Tag size={12} />
                Type de production
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-10 border-border rounded-xl text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Végétale"> Végétale</SelectItem>
                  <SelectItem value="Élevage">Élevage</SelectItem>
                  <SelectItem value="Rente"> Rente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Note minimale */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Star size={12} className="text-amber-400" />
                Note minimale
              </label>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="h-10 border-border rounded-xl text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Toutes les notes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"> Toutes les notes</SelectItem>
                  <SelectItem value="5"> 5 étoiles</SelectItem>
                  <SelectItem value="4"> 4+ étoiles</SelectItem>
                  <SelectItem value="3"> 3+ étoiles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* --- COMPTEUR DE RÉSULTATS --- */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filteredUsers.length}</span> {filteredUsers.length === 1 ? "professionnel trouvé" : "professionnels trouvés"}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* --- GRILLE DES RÉSULTATS AVEC SKELETON --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <img src={user.avatar} alt={user.name} className="size-12 rounded-full object-cover ring-2 ring-muted group-hover:ring-primary/20 transition-all" />
                      <div>
                        <h3 className="text-base font-bold text-foreground">{user.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold mt-0.5">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                          <span className="flex items-center gap-1"><Tag size={12} /> {user.type}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md text-primary-foreground bg-primary uppercase tracking-wider">
                      {user.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{user.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 mt-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className={i < user.rating ? "text-amber-400 fill-amber-400" : "text-muted"} />
                    ))}
                  </div>
                  <Button variant="outline" className="h-8 rounded-xl font-bold text-xs border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-all">
                    Consulter le Profil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                onClick={resetFilters}
                variant="outline"
                className="mt-2 rounded-xl text-primary border-primary/20"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}