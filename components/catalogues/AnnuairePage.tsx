"use client";

import React, { useState } from "react";
import { Search, MapPin, Star, SlidersHorizontal, Tag, UserCheck, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type TargetRole = "fournisseurs" | "collecteurs";

interface AnnuairePageProps {
  type: TargetRole;
  onBack: () => void; // Ajout du paramètre onBack
}

// Liste complète fictive des profils
const usersDatabase = [
  { id: "u1", name: "John Doe", role: "fournisseurs", location: "Antananarivo", type: "Végétale", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", description: "Producteur spécialisé en céréales de province et cultures maraîchères." },
  { id: "u2", name: "Jane Cooper", role: "fournisseurs", location: "Antsirabe", type: "Végétale", rating: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", description: "Exploitation spécialisée en pommes de terre de table et carottes." },
  { id: "u3", name: "Rova Centrale", role: "collecteurs", location: "Fianarantsoa", type: "Rente", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", description: "Centrale d'achat et approvisionnement pour grossistes régionaux." },
  { id: "u4", name: "Jenny Wilson", role: "fournisseurs", location: "Toliara", type: "Rente", rating: 4, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", description: "Exportateur de maïs jaune sec et cultures de rente locales." },
];

export default function AnnuairePage({ type, onBack }: AnnuairePageProps) {
  const [searchName, setSearchName] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterRating, setFilterRating] = useState("all");

  const filteredUsers = usersDatabase.filter((user) => {
    if (user.role !== type) return false;
    
    const matchesName = user.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesLocation = filterLocation === "all" || user.location === filterLocation;
    const matchesType = filterType === "all" || user.type === filterType;
    const matchesRating = filterRating === "all" || user.rating >= parseInt(filterRating);

    return matchesName && matchesLocation && matchesType && matchesRating;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* En-tête avec bouton de retour */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full hover:bg-slate-200"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 capitalize flex items-center gap-2">
              <UserCheck className="text-[#0D631B]" />
              Liste des {type}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Recherchez et filtrez l'intégralité des professionnels inscrits sur la plateforme.
            </p>
          </div>
        </div>

        {/* --- BARRE DE FILTRES --- */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
            <Input
              placeholder="Rechercher par nom..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10 h-10 border-slate-200 rounded-xl text-sm"
            />
          </div>

          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="h-10 border-slate-200 rounded-xl text-sm bg-slate-50/30">
              <SelectValue placeholder="Localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem value="Antananarivo">Antananarivo</SelectItem>
              <SelectItem value="Antsirabe">Antsirabe</SelectItem>
              <SelectItem value="Fianarantsoa">Fianarantsoa</SelectItem>
              <SelectItem value="Toliara">Toliara</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-10 border-slate-200 rounded-xl text-sm bg-slate-50/30">
              <SelectValue placeholder="Type de production" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Végétale">Végétale</SelectItem>
              <SelectItem value="Élevage">Élevage</SelectItem>
              <SelectItem value="Rente">Rente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="h-10 border-slate-200 rounded-xl text-sm bg-slate-50/30">
              <SelectValue placeholder="Note minimale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="5">5 étoiles uniquement</SelectItem>
              <SelectItem value="4">4 étoiles et plus</SelectItem>
              <SelectItem value="3">3 étoiles et plus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* --- GRILLE DES RÉSULTATS --- */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <img src={user.avatar} alt={user.name} className="size-12 rounded-full object-cover ring-2 ring-slate-100" />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-0.5">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                          <span className="flex items-center gap-1"><Tag size={12} /> {user.type}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md text-white bg-[#0D631B] uppercase tracking-wider">
                      {user.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{user.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className={i < user.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <Button variant="outline" className="h-8 rounded-xl font-bold text-xs border-emerald-100 text-[#0D631B] bg-emerald-50/30 hover:bg-emerald-50">
                    Consulter le Profil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm font-medium text-slate-400">
            Aucun professionnel ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
    </div>
  );
}