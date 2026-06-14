"use client";

import React, { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, MapPin, Scale, Star, ChevronDown, ChevronUp, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnnuairePage from "./AnnuairePage";

type UserRole = "fournisseur" | "collecteur";

interface CataloguePageProps {
  userRole: UserRole;
}

const fannoncesDeVente = [

  {
    id: "ann_f1",
    title: "Blé de province",
    timeAgo: "Il y a 2 h",
    price: 3000,
    unit: "Kg",
    quantity: "3 tonnes",
    location: "Antananarivo, Madagascar",
    productionType: "Végétale",
    description: "Blé de haute qualité, récolté localement dans la région d'Analamanga. Idéal pour la boulangerie et la pâtisserie.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    author: { name: "John Doe", rating: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", location: "Antananarivo", productionType: "Végétale" },
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
    description: "Riz blanc de première qualité, récolté dans la région de Boeny. Grain long et parfumé.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    author: { name: "Marie Claire", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", location: "Mahajanga", productionType: "Végétale" },
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
    description: "Viande de bœuf de qualité supérieure, issue d'élevages traditionnels. Tendre et savoureuse.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    author: { name: "Ferme Raso", rating: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", location: "Antsirabe", productionType: "Élevage" },
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
    description: "Litchis frais de saison, prêts pour l'exportation. Calibre extra, couleur rouge vif.",
    image: "https://images.unsplash.com/photo-1558530892-0f7e1d75d4b6?auto=format&fit=crop&w=800&q=80",
    author: { name: "Export Litchi", rating: 5, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", location: "Toamasina", productionType: "Rente" },
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
    description: "Pommes de terre variété Mona Lisa, calibre 40-60mm. Idéales pour la consommation et la transformation.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    author: { name: "Jane Cooper", rating: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", location: "Antsirabe", productionType: "Végétale" },
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
    description: "Vanille noire de première qualité, label bio. Taux de vanilline élevé (>2%).",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f4f6b8d?auto=format&fit=crop&w=800&q=80",
    author: { name: "Vanille Sava", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", location: "Sambava", productionType: "Rente" },
  },
];

const cdemandesAchat = [
  // ... (tes données existantes)
  {
    id: "ann_c1",
    title: "Recherche Maïs Jaune Sec",
    timeAgo: "Il y a 45 min",
    price: 1400,
    unit: "Kg",
    quantity: "10 tonnes",
    location: "Fianarantsoa, Madagascar",
    productionType: "Rente",
    description: "Nous recherchons activement un fournisseur capable de nous livrer 10 tonnes de maïs jaune sec.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    author: { name: "Rova Centrale", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", location: "Fianarantsoa", productionType: "Grossiste" },
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
    description: "Recherche tomates fraîches pour transformation. Livraison hebdomadaire souhaitée.",
    image: "https://images.unsplash.com/photo-1546470427-1f8c5d6c8f8b?auto=format&fit=crop&w=800&q=80",
    author: { name: "Sosep Mena", rating: 4, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", location: "Antananarivo", productionType: "Collecteur" },
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
    description: "Recherche producteurs d'œufs bio pour approvisionnement hebdomadaire.",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
    author: { name: "Mahajanga Market", rating: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", location: "Mahajanga", productionType: "Collecteur" },
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
    description: "Industrie agroalimentaire recherche vanille verte fraîche pour transformation.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    author: { name: "Agro Industries", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", location: "Sambava", productionType: "Industriel" },
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
    description: "Recherche fournisseurs de poulets de chair pour approvisionnement régulier.",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80",
    author: { name: "Restauration Plus", rating: 4, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", location: "Antsirabe", productionType: "Collecteur" },
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
    description: "Export cherche haricots verts de qualité pour marché européen.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    author: { name: "Export Quality", rating: 5, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", location: "Toamasina", productionType: "Exportateur" },
  },
];

const topSuppliers = [
  { name: "John Doe", location: "Tana", productionType: "Végétale", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { name: "Jane Cooper", location: "Antsirabe", productionType: "Végétale", rating: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { name: "Jenny Wilson", location: "Toliara", productionType: "Rente", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
  { name: "Ferme Raso", location: "Antsirabe", productionType: "Élevage", rating: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
  { name: "Vanille Sava", location: "Sambava", productionType: "Rente", rating: 5, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
];

// Composant Skeleton pour le header
const HeaderSkeleton = () => (
  <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4 animate-pulse">
    <div className="h-8 bg-muted rounded w-48 mb-2"></div>
    <div className="h-4 bg-muted rounded w-96"></div>
  </div>
);

// Composant Skeleton pour les filtres
const FilterSkeleton = () => (
  <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-3 animate-pulse">
    <div className="flex items-center gap-1.5 border-b border-border pb-1.5">
      <div className="h-3 bg-muted rounded w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-muted rounded w-12"></div>
      <div className="grid grid-cols-3 gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-1.5">
            <div className="size-3.5 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-1">
      <div className="h-2 bg-muted rounded w-20"></div>
      <div className="h-8 bg-muted rounded-xl"></div>
    </div>
  </div>
);

// Composant Skeleton pour les annonces
const AdSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-pulse">
    <div className="relative h-56 bg-muted"></div>
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-muted rounded w-28 mb-2"></div>
          <div className="h-3 bg-muted rounded w-20"></div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-muted"></div>
          <div>
            <div className="h-3 bg-muted rounded w-24 mb-1"></div>
            <div className="h-2 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="h-8 bg-muted rounded-xl w-20"></div>
      </div>
    </div>
  </div>
);

// Composant Skeleton pour le top 5
const Top5Skeleton = () => (
  <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 animate-pulse">
    <div className="flex items-center justify-between border-b border-border pb-1.5">
      <div className="h-3 bg-muted rounded w-32"></div>
      <div className="h-3 bg-muted rounded w-16"></div>
    </div>
    <div className="divide-y divide-border">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-full bg-muted"></div>
            <div>
              <div className="h-3 bg-muted rounded w-20 mb-1"></div>
              <div className="h-2 bg-muted rounded w-24"></div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function CataloguePage({ userRole }: CataloguePageProps) {
  const [view, setView] = useState<"catalogue" | "annuaire">("catalogue");
  const [expandedAds, setExpandedAds] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Végétale", "Élevage", "Rente"]);
  const [minRating, setMinRating] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const allAds = userRole === "fournisseur" ? cdemandesAchat : fannoncesDeVente;
  
  // Simulation du chargement initial
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
  
  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScrollButton(scrollRef.current.scrollTop > 300);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading]);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Filtrage des annonces avec recherche
  const adsToDisplay = allAds.filter((ad) => {
    const matchesType = selectedTypes.includes(ad.productionType);
    const matchesRating = minRating === "all" || ad.author.rating >= parseInt(minRating);
    const matchesSearch = searchQuery === "" || 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRating && matchesSearch;
  });

  const toggleExpand = (id: string) => setExpandedAds((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  if (view === "annuaire") return <AnnuairePage type={userRole === "fournisseur" ? "collecteurs" : "fournisseurs"} onBack={() => setView("catalogue")} />;

  return (
    <div className="w-full h-screen bg-neutral p-4 md:p-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* MIDDLE */}
        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          {/* HEADER STICKY AVEC SKELETON */}
          {isLoading ? (
            <HeaderSkeleton />
          ) : (
            <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">Catalogue</h1>
              <p className="text-sm text-muted-foreground">
                {userRole === "fournisseur" 
                  ? "Consultez les demandes d'achat des collecteurs" 
                  : "Découvrez les annonces de vente des fournisseurs"}
              </p>
            
              {!searchQuery && adsToDisplay.length !== allAds.length && (
                <p className="text-xs text-muted-foreground mt-2">
                  {adsToDisplay.length} résultat{adsToDisplay.length !== 1 ? 's' : ''} sur {allAds.length}
                </p>
              )}
            </div>
          )}
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10">
            {isLoading ? (
              <>
                <AdSkeleton />
                <AdSkeleton />
                <AdSkeleton />
              </>
            ) : adsToDisplay.length > 0 ? (
              adsToDisplay.map((ad) => (
                <div key={ad.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="relative h-56 bg-muted">
                    <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-lg text-primary-foreground bg-primary">{ad.productionType}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">{ad.title} <span className="text-xs font-semibold text-muted-foreground">{ad.timeAgo}</span></h2>
                        <div className="flex gap-4 text-xs font-bold text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5"><Scale size={14} /> {ad.quantity}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} /> {ad.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-secondary">{ad.price.toLocaleString()} <span className="text-xs font-bold text-muted-foreground uppercase">Mga/{ad.unit}</span></p>
                        <button onClick={() => toggleExpand(ad.id)} className="text-xs font-bold text-foreground hover:underline mt-1 flex items-center gap-1">
                          voir détails {expandedAds[ad.id] ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                        </button>
                      </div>
                    </div>
                    {expandedAds[ad.id] && <p className="text-xs text-muted-foreground pt-2 border-t border-border">{ad.description}</p>}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <img src={ad.author.avatar} className="size-9 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{ad.author.name}</p>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < ad.author.rating ? "currentColor" : "none"} />)}
                            <span className="text-[10px] font-bold text-muted-foreground ml-1">{ad.author.rating}.0</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="h-8 text-xs font-bold text-primary border-primary/20 bg-primary/10 hover:bg-primary/20">Profil</Button>
                    </div>
                  </div>
                </div>
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
        <div className="hidden lg:flex flex-col space-y-4 h-full flex-shrink-0">
          
          {/* Bloc Filtres Compact avec Skeleton */}
          {isLoading ? (
            <FilterSkeleton />
          ) : (
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border pb-1.5">
                <SlidersHorizontal size={14} /> Filtres
              </h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Types</label>
                <div className="grid grid-cols-3 gap-1">
                  {["Végétale", "Élevage", "Rente"].map((type) => (
                    <div key={type} className="flex items-center space-x-1.5">
                      <Checkbox 
                        id={type} 
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeChange(type)}
                        className="size-3.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={type} className="text-[11px] font-semibold text-foreground cursor-pointer">{type}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Note minimale</label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="h-8 text-xs rounded-xl bg-muted/50 border-border">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="5">5 étoiles +</SelectItem>
                    <SelectItem value="4">4 étoiles +</SelectItem>
                    <SelectItem value="3">3 étoiles +</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Bloc Top 5 Compact avec Skeleton */}
          {isLoading ? (
            <Top5Skeleton />
          ) : (
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 flex-grow overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-1.5 flex-shrink-0">
                <h3 className="text-xs font-bold text-foreground">
                  {userRole === "fournisseur" ? "Top 5 collecteurs" : "Top 5 fournisseurs"}
                </h3>
                <button 
                  onClick={() => setView("annuaire")} 
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  Voir plus
                </button>
              </div>

              <div className="divide-y divide-border flex-grow overflow-hidden">
                {topSuppliers.map((person, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <img src={person.avatar} alt={person.name} className="size-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{person.name}</p>
                        <p className="text-[10px] text-muted-foreground">{person.location} • {person.productionType}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={9} className={i < person.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">{person.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[11px] font-bold text-primary hover:underline">Profil</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
      
      {/* Bouton flottant pour remonter en haut */}
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