"use client";

import React, { useState } from "react";
import { SlidersHorizontal, MapPin, Scale, Star, ChevronDown, ChevronUp } from "lucide-react";
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
    description: "Blé de haute qualité, récolté localement dans la région d'Analamanga.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    author: { name: "John Doe", rating: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", location: "Antananarivo", productionType: "Végétale" },
  },
];

const cdemandesAchat = [
  {
    id: "ann_c1",
    title: "Recherche Maïs Jaune Sec",
    timeAgo: "Il y a 45 min",
    price: 1400,
    unit: "Kg",
    quantity: "10 tonnes",
    location: "Fianarantsoa, Madagascar",
    productionType: "Rente",
    description: "Nous recherchons activement un fournisseur capable de nous livrer 10 tonnes.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    author: { name: "Rova Centrale", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", location: "Fianarantsoa", productionType: "Grossiste" },
  },
];

const topSuppliers = [
  { name: "John Doe", location: "Tana", productionType: "Végétale", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { name: "Jane Cooper", location: "Antsirabe", productionType: "Végétale", rating: 4, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { name: "Jenny Wilson", location: "Toliara", productionType: "Rente", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
];

export default function CataloguePage({ userRole }: CataloguePageProps) {
  const [view, setView] = useState<"catalogue" | "annuaire">("catalogue");
  const [expandedAds, setExpandedAds] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Végétale", "Élevage", "Rente"]);
  
  const adsToDisplay = userRole === "fournisseur" ? cdemandesAchat : fannoncesDeVente;
  const sidePeopleToDisplay = topSuppliers;

  const toggleExpand = (id: string) => setExpandedAds((prev) => ({ ...prev, [id]: !prev[id] }));

  if (view === "annuaire") return <AnnuairePage type={userRole === "fournisseur" ? "collecteurs" : "fournisseurs"} onBack={() => setView("catalogue")} />;

  return (
    <div className="w-full h-screen bg-slate-50 p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* MIDDLE */}
        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Catalogue</h1>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-10">
            {adsToDisplay.map((ad) => (
              <div key={ad.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="relative h-56 bg-slate-100">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-lg text-white bg-[#0D631B]">{ad.productionType}</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">{ad.title} <span className="text-xs font-semibold text-slate-400">{ad.timeAgo}</span></h2>
                      <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1">
                        <span className="flex items-center gap-1.5"><Scale size={14} /> {ad.quantity}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {ad.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#0D631B]">{ad.price} <span className="text-xs font-bold text-slate-400 uppercase">Mga/{ad.unit}</span></p>
                      <button onClick={() => toggleExpand(ad.id)} className="text-xs font-bold text-slate-900 hover:underline mt-1 flex items-center gap-1">
                        voir détails {expandedAds[ad.id] ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                      </button>
                    </div>
                  </div>
                  {expandedAds[ad.id] && <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">{ad.description}</p>}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img src={ad.author.avatar} className="size-9 rounded-full" />
                      <div>
                        <p className="text-xs font-bold">{ad.author.name}</p>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < ad.author.rating ? "currentColor" : "none"} />)}
                          <span className="text-[10px] font-bold text-slate-500 ml-1">{ad.author.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="h-8 text-xs font-bold text-[#0D631B] border-emerald-100 bg-emerald-50/50">Profil</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔒 COLONNE DROITE : TOTALEMENT FIXE, SANS SCROLL */}
        <div className="hidden lg:flex flex-col space-y-4 h-full flex-shrink-0">
          
          {/* Bloc Filtres Compact */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
              <SlidersHorizontal size={14} /> Filtres
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Types</label>
              <div className="grid grid-cols-3 gap-1">
                {["Végétale", "Élevage", "Rente"].map((type) => (
                  <div key={type} className="flex items-center space-x-1.5">
                    <Checkbox id={type} checked={selectedTypes.includes(type)} className="size-3.5 data-[state=checked]:bg-[#0D631B]" />
                    <label htmlFor={type} className="text-[11px] font-semibold text-slate-700 cursor-pointer">{type}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Note minimale</label>
              <Select>
                <SelectTrigger className="h-8 text-xs rounded-xl bg-slate-50/50">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 étoiles +</SelectItem>
                  <SelectItem value="3">3 étoiles +</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bloc Top 5 Compact */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2.5 flex-grow overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-50 pb-1.5 flex-shrink-0">
              <h3 className="text-xs font-bold text-slate-900">
                {userRole === "fournisseur" ? "Top 5 collecteurs" : "Top 5 fournisseurs"}
              </h3>
              <button 
                onClick={() => setView("annuaire")} 
                className="text-[11px] font-bold text-[#0D631B] hover:underline"
              >
                Voir plus
              </button>
            </div>

            <div className="divide-y divide-slate-50 flex-grow overflow-hidden">
              {sidePeopleToDisplay.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <img src={person.avatar} alt={person.name} className="size-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{person.name}</p>
                      <p className="text-[10px] text-slate-400">{person.location} • {person.productionType}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={9} className={i < person.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{person.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-[#0D631B] hover:underline">Profil</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}