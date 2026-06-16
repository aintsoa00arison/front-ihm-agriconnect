"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ArrowUp, SlidersHorizontal } from "lucide-react";
import AnnuairePage from "./AnnuairePage";
import CatalogueHeader from "./CatalogueHeader";
import CatalogueFilters from "./CatalogueFilters";
import TopSuppliers from "./Top";
import AdCard from "./AdCard";
import { HeaderSkeleton, Top5Skeleton, AdSkeleton } from "./CatalogueSkeletons";
import type { Ad, Supplier, UserRole } from "../../app/services/publication/catalogue";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { usePublications } from "../../app/services/hooks/usePublication";
import { getUserId, getUserRole } from "../../app/services/lib/auth";

interface CataloguePageProps {
  userRole: UserRole;
}

// 🔥 Mapping des types de production backend -> affichage
const PRODUCTION_TYPE_MAP: Record<string, string> = {
  'VEGETAL': 'Végétale',
  'ANIMAL': 'Élevage',
  'CEREAL': 'Rente'
};

const transformPublicationToAd = (pub: any): Ad => {
  const sender = pub.sender || {};
  
  let senderType: 'fournisseur' | 'collecteur' = 'fournisseur';
  
  if (sender.legal_name || sender.registered_office || sender.nif || 
      sender.company_description || sender.rep_first_name || sender.rep_last_name) {
    senderType = 'fournisseur';
  } else if (sender.first_name || sender.last_name || sender.cin_number) {
    senderType = 'collecteur';
  } else if (sender.role === 'collector' || sender.role === 'collecteur') {
    senderType = 'collecteur';
  } else if (sender.role === 'provider' || sender.role === 'fournisseur') {
    senderType = 'fournisseur';
  }
  
  const firstName = sender.first_name || '';
  const lastName = sender.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 
                    sender.legal_name || 
                    sender.rep_first_name || 
                    sender.rep_last_name || 
                    sender.name || 
                    "Utilisateur";
  
  const authorRating = sender.score?.value ?? sender.score ?? sender.rating ?? 0;
  const displayProductionType = PRODUCTION_TYPE_MAP[pub.category] || pub.category || "Non catégorisé";
  
  return {
    id: pub.id,
    title: pub.titre || "Sans titre",
    timeAgo: pub.createdAt ? new Date(pub.createdAt).toLocaleDateString() : "Récent",
    price: pub.prix || pub.price || 0,
    unit: "Kg",
    quantity: pub.quantity || "0",
    location: pub.localisation || "Non spécifié",
    productionType: displayProductionType,
    description: pub.description || "",
    image: pub.photo || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    sender_id: pub.sender_id || '',
    sender_type: senderType,
    author: {
      name: fullName,
      rating: authorRating,
      avatar: sender.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      location: sender.registered_office || sender.address || pub.localisation || "Non spécifié",
      productionType: pub.category || "Non catégorisé",
    },
  };
};

export default function CataloguePage({ userRole }: CataloguePageProps) {
  const [view, setView] = useState<"catalogue" | "annuaire">("catalogue");
  const [expandedAds, setExpandedAds] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Végétale",
    "Élevage",
    "Rente",
  ]);
  const [minRating, setMinRating] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);

  const userId = getUserId();
  const currentUserRole = getUserRole();
  
  const { publications, loading, isInitialized, refreshPublications, filterPublications } = usePublications(userId || undefined);

  useEffect(() => {
    console.log('🔵 currentUserRole:', currentUserRole);
    console.log('🔵 publications:', publications);
    console.log('🔵 publications.length:', publications?.length);
  }, [publications, currentUserRole]);

  // 🔥 Écouter la recherche
  useEffect(() => {
    const handleSearchEvent = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      
      const query = event.detail || "";
      setSearchQuery(query);
      setIsSearching(true);
      
      if (userId && query.trim() !== "") {
        console.log(`🔵 Recherche de publications avec: "${query}"`);
        filterPublications({
          titre_or_description: query,
          category: [],
        }).finally(() => {
          setIsSearching(false);
        });
      } else if (userId) {
        refreshPublications().finally(() => {
          setIsSearching(false);
        });
      } else {
        setIsSearching(false);
      }
    };

    window.addEventListener("catalogueSearch", handleSearchEvent);
    return () =>
      window.removeEventListener("catalogueSearch", handleSearchEvent);
  }, [userId, filterPublications, refreshPublications]);

  // 🔥 Transformer les publications en annonces
  const allAds = useMemo(() => {
    if (publications && publications.length > 0) {
      console.log(`🔵 Transformation de ${publications.length} publications en annonces`);
      return publications.map(transformPublicationToAd);
    }
    return [];
  }, [publications]);

  // 🔥 Filtrer uniquement par type et note
  const filteredAds = useMemo(() => {
    let ads = allAds;

    // 🔥 Filtrer par type de production
    if (selectedTypes.length > 0 && selectedTypes.length < 3) {
      ads = ads.filter(ad => selectedTypes.includes(ad.productionType));
    }

    // 🔥 Filtrer par note minimale
    if (minRating !== "all") {
      const min = parseInt(minRating);
      ads = ads.filter(ad => (ad.author.rating || 0) >= min);
    }

    return ads;
  }, [allAds, selectedTypes, minRating]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollButton(scrollRef.current.scrollTop > 300);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpand = (id: string) =>
    setExpandedAds((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleViewProfile = (name: string) => {
    console.log("Voir profil:", name);
  };

  if (view === "annuaire") {
    return (
      <AnnuairePage
        onBack={() => setView("catalogue")}
      />
    );
  }

  // 🔥 Afficher le skeleton SEULEMENT au chargement initial
  if (loading && !isInitialized) {
    return (
      <div className="w-full h-full bg-neutral flex overflow-hidden p-4 md:p-8 relative">
        <div className="max-w-7xl w-full flex justify-center gap-8 h-full overflow-hidden mx-auto">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <HeaderSkeleton />
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10 min-h-0">
              <AdSkeleton />
              <AdSkeleton />
              <AdSkeleton />
            </div>
          </div>
          <div className="hidden lg:flex flex-col h-full overflow-y-auto pr-3 shrink-0 space-y-6 pb-10 max-w-sm">
            <Top5Skeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-neutral flex overflow-hidden p-4 md:p-8 relative">
      <div className="max-w-7xl w-full flex justify-center gap-8 h-full overflow-hidden mx-auto">
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <CatalogueHeader
              userRole={userRole}
              totalResults={filteredAds.length}
              totalItems={allAds.length}
              searchQuery={searchQuery}
            />
            <div className="lg:hidden shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="size-4.5 text-muted-foreground ring-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-75 p-0 border-none shadow-none bg-transparent"
                >
                  <CatalogueFilters
                    selectedTypes={selectedTypes}
                    onTypeChange={handleTypeChange}
                    minRating={minRating}
                    onRatingChange={setMinRating}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10 min-h-0"
          >
            {isSearching ? (
              // 🔥 Skeleton pendant la recherche (uniquement sur les cartes)
              <div className="space-y-6">
                <AdSkeleton />
                <AdSkeleton />
                <AdSkeleton />
              </div>
            ) : filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  isExpanded={!!expandedAds[ad.id]}
                  onToggleExpand={toggleExpand}
                  onViewProfile={handleViewProfile}
                />
              ))
            ) : (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Aucune annonce ne correspond à votre recherche "${searchQuery}"`
                    : `Aucune ${currentUserRole === 'fournisseur' ? 'demande' : 'annonce'} disponible pour le moment.`}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {currentUserRole === "collecteur" || currentUserRole === "collector"
                    ? "Les fournisseurs n'ont pas encore publié d'annonces."
                    : "Les collecteurs n'ont pas encore publié de demandes."}
                </p>
                <button 
                  onClick={() => refreshPublications()}
                  className="mt-4 px-4 py-2 text-sm font-bold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  🔄 Recharger les annonces
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col h-full overflow-y-auto pr-3 shrink-0 space-y-6 pb-10 max-w-sm">
          <CatalogueFilters
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            minRating={minRating}
            onRatingChange={setMinRating}
          />
          <TopSuppliers
            userRole={userRole}
            onViewAll={() => setView("annuaire")}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 animate-in fade-in zoom-in cursor-pointer"
          aria-label="Remonter en haut"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}