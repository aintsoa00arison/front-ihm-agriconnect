// app/catalogue/CataloguePage.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import AnnuairePage from "./AnnuairePage";
import CatalogueHeader from "./CatalogueHeader";
import CatalogueFilters from "./CatalogueFilters";
import TopSuppliers from "./Top";
import AdCard from "./AdCard";
import { HeaderSkeleton, Top5Skeleton, AdSkeleton } from "./CatalogueSkeletons";
import type { Ad, Supplier, UserRole } from "./types/catalogue";

interface CataloguePageProps {
  userRole: UserRole;
}

// Données factices pour les annonces de vente (Fournisseur -> annonces de vente)
const fannoncesDeVente: Ad[] = [
  {
    id: "ann_f1",
    title: "Blé de province",
    timeAgo: "Il y a 2 h",
    price: 3000,
    unit: "Kg",
    quantity: "3 tonnes",
    location: "Antananarivo, Madagascar",
    productionType: "Végétale",
    description:
      "Blé de haute qualité, récolté localement dans la région d'Analamanga. Idéal pour la boulangerie et la pâtisserie.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "John Doe",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      location: "Antananarivo",
      productionType: "Végétale",
    },
  },
  {
    id: "ann_f2",
    title: "Riz de luxe",
    timeAgo: "Il y a 5 h",
    price: 2500,
    unit: "Kg",
    quantity: "5 tonnes",
    location: "Mahajanga, Madagascar",
    productionType: "Végétale",
    description:
      "Riz blanc de première qualité, récolté dans la région de Boeny. Grain long et parfumé.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Marie Claire",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      location: "Mahajanga",
      productionType: "Végétale",
    },
  },
  {
    id: "ann_f3",
    title: "Viande bovine",
    timeAgo: "Il y a 1 j",
    price: 12000,
    unit: "Kg",
    quantity: "2 tonnes",
    location: "Antsirabe, Madagascar",
    productionType: "Élevage",
    description:
      "Viande de bœuf de qualité supérieure, issue d'élevages traditionnels. Tendre et savoureuse.",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Ferme Raso",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      location: "Antsirabe",
      productionType: "Élevage",
    },
  },
  {
    id: "ann_f4",
    title: "Litchis frais",
    timeAgo: "Il y a 3 h",
    price: 8000,
    unit: "Kg",
    quantity: "10 tonnes",
    location: "Toamasina, Madagascar",
    productionType: "Rente",
    description:
      "Litchis frais de saison, prêts pour l'exportation. Calibre extra, couleur rouge vif.",
    image:
      "https://images.unsplash.com/photo-1558530892-0f7e1d75d4b6?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Export Litchi",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      location: "Toamasina",
      productionType: "Rente",
    },
  },
  {
    id: "ann_f5",
    title: "Pommes de terre",
    timeAgo: "Il y a 8 h",
    price: 3500,
    unit: "Kg",
    quantity: "8 tonnes",
    location: "Antsirabe, Madagascar",
    productionType: "Végétale",
    description:
      "Pommes de terre variété Mona Lisa, calibre 40-60mm. Idéales pour la consommation et la transformation.",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Jane Cooper",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      location: "Antsirabe",
      productionType: "Végétale",
    },
  },
  {
    id: "ann_f6",
    title: "Vanille Bourbon",
    timeAgo: "Il y a 2 j",
    price: 250000,
    unit: "Kg",
    quantity: "500 Kg",
    location: "Sambava, Madagascar",
    productionType: "Rente",
    description:
      "Vanille noire de première qualité, label bio. Taux de vanilline élevé (>2%).",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f4f6b8d?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Vanille Sava",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      location: "Sambava",
      productionType: "Rente",
    },
  },
];

// Données factices pour les demandes d'achat (Collecteur -> demandes d'achat)
const cdemandesAchat: Ad[] = [
  {
    id: "ann_c1",
    title: "Recherche Maïs Jaune Sec",
    timeAgo: "Il y a 45 min",
    price: 1400,
    unit: "Kg",
    quantity: "10 tonnes",
    location: "Fianarantsoa, Madagascar",
    productionType: "Rente",
    description:
      "Nous recherchons activement un fournisseur capable de nous livrer 10 tonnes de maïs jaune sec.",
    image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Rova Centrale",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      location: "Fianarantsoa",
      productionType: "Grossiste",
    },
  },
  {
    id: "ann_c2",
    title: "Besoin Tomates Fraîches",
    timeAgo: "Il y a 2 h",
    price: 2000,
    unit: "Kg",
    quantity: "5 tonnes",
    location: "Antananarivo, Madagascar",
    productionType: "Végétale",
    description:
      "Recherche tomates fraîches pour transformation. Livraison hebdomadaire souhaitée.",
    image:
      "https://images.unsplash.com/photo-1546470427-1f8c5d6c8f8b?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Sosep Mena",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      location: "Antananarivo",
      productionType: "Collecteur",
    },
  },
  {
    id: "ann_c3",
    title: "Achat Œufs Bio",
    timeAgo: "Il y a 5 h",
    price: 1200,
    unit: "Boîte",
    quantity: "1000 boîtes",
    location: "Mahajanga, Madagascar",
    productionType: "Élevage",
    description:
      "Recherche producteurs d'œufs bio pour approvisionnement hebdomadaire.",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Mahajanga Market",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      location: "Mahajanga",
      productionType: "Collecteur",
    },
  },
  {
    id: "ann_c4",
    title: "Vanille Verte Recherchée",
    timeAgo: "Il y a 1 j",
    price: 180000,
    unit: "Kg",
    quantity: "1 tonne",
    location: "Sambava, Madagascar",
    productionType: "Rente",
    description:
      "Industrie agroalimentaire recherche vanille verte fraîche pour transformation.",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Agro Industries",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      location: "Sambava",
      productionType: "Industriel",
    },
  },
  {
    id: "ann_c5",
    title: "Poulets de Chair",
    timeAgo: "Il y a 8 h",
    price: 5500,
    unit: "Kg",
    quantity: "4 tonnes",
    location: "Antsirabe, Madagascar",
    productionType: "Élevage",
    description:
      "Recherche fournisseurs de poulets de chair pour approvisionnement régulier.",
    image:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Restauration Plus",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      location: "Antsirabe",
      productionType: "Collecteur",
    },
  },
  {
    id: "ann_c6",
    title: "Haricots Verts",
    timeAgo: "Il y a 12 h",
    price: 4500,
    unit: "Kg",
    quantity: "7 tonnes",
    location: "Toamasina, Madagascar",
    productionType: "Végétale",
    description:
      "Export cherche haricots verts de qualité pour marché européen.",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Export Quality",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      location: "Toamasina",
      productionType: "Exportateur",
    },
  },
];

// Données factices pour le Top 5
const topSuppliers: Supplier[] = [
  {
    name: "John Doe",
    location: "Tana",
    productionType: "Végétale",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Jane Cooper",
    location: "Antsirabe",
    productionType: "Végétale",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Jenny Wilson",
    location: "Toliara",
    productionType: "Rente",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Ferme Raso",
    location: "Antsirabe",
    productionType: "Élevage",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Vanille Sava",
    location: "Sambava",
    productionType: "Rente",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
  },
];

export default function CataloguePage({ userRole }: CataloguePageProps) {
  const [view, setView] = useState<"catalogue" | "annuaire">("catalogue");
  const [expandedAds, setExpandedAds] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Végétale",
    "Élevage",
    "Rente",
  ]);
  const [minRating, setMinRating] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allAds = userRole === "fournisseur" ? cdemandesAchat : fannoncesDeVente;

  // Simulation du chargement initial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Écouter les événements de recherche
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

  // Détecter le scroll
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
  }, [isLoading]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtrage des annonces
  const adsToDisplay = allAds.filter((ad) => {
    const matchesType = selectedTypes.includes(ad.productionType);
    const matchesRating =
      minRating === "all" || ad.author.rating >= parseInt(minRating);
    const matchesSearch =
      searchQuery === "" ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRating && matchesSearch;
  });

  const toggleExpand = (id: string) =>
    setExpandedAds((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };
  const handleViewProfile = (name: string) => {
    console.log("Voir profil:", name);
  };

  if (view === "annuaire") {
    return (
      <AnnuairePage
        type={userRole === "fournisseur" ? "collecteurs" : "fournisseurs"}
        onBack={() => setView("catalogue")}
      />
    );
  }

  return (
    <div className="w-full h-full bg-neutral flex overflow-hidden p-4 md:p-8 relative">
      <div className="max-w-7xl w-full flex justify-center gap-8 h-full overflow-hidden mx-auto">
        {/* COLONNE PRINCIPALE  */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {isLoading ? (
            <HeaderSkeleton />
          ) : (
            <CatalogueHeader
              userRole={userRole}
              totalResults={adsToDisplay.length}
              totalItems={allAds.length}
              searchQuery={searchQuery}
            />
          )}

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10 min-h-0"
          >
            {isLoading ? (
              <>
                <AdSkeleton />
                <AdSkeleton />
                <AdSkeleton />
              </>
            ) : adsToDisplay.length > 0 ? (
              adsToDisplay.map((ad) => (
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
                    : "Aucune annonce ne correspond à vos critères"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="hidden lg:flex flex-col h-full overflow-y-auto pr-3 shrink-0 space-y-6 pb-10">
          <CatalogueFilters
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            minRating={minRating}
            onRatingChange={setMinRating}
          />
          {isLoading ? (
            <Top5Skeleton />
          ) : (
            <TopSuppliers
              suppliers={topSuppliers}
              userRole={userRole}
              onViewAll={() => setView("annuaire")}
              onViewProfile={handleViewProfile}
            />
          )}
        </div>
      </div>

      {/* Bouton flottant  */}
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
