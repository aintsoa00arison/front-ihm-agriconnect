"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Store, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdForm from "@/components/annonces/AddForm"; 

function CollecteurContent() {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Écoute sécurisée des changements de l'URL sans dépendance stricte à next/navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setIsCreatingNew(params.get("action") === "new");
      }
    };

    // Vérification initiale
    handleUrlChange();

    // Écouteur pour capter les changements d'historique de navigation
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/c");
      setIsCreatingNew(false);
    }
  };

  const handleSave = (data: any) => {
    console.log("Nouvelle demande enregistrée :", data);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/c");
      setIsCreatingNew(false);
    }
  };

  const triggerNewForm = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/c?action=new");
      setIsCreatingNew(true);
    }
  };

  // Simulation d'une liste de demandes ou catalogue vide
  const hasProducts = false;

  // Si l'action "nouvelle annonce" est détectée, on affiche le formulaire d'ajout
  if (isCreatingNew) {
    return (
      <div className="animate-in fade-in duration-200">
        <AdForm
          mode="demande" // Version demande d'achat pour le collecteur
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    );
  }

  // Rendu de base de l'espace collecteur (catalogue)
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="text-[#0D631B]" size={24} />
            Mon Espace Collecteur
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Visualisez vos besoins d'achat et gérez vos demandes de collectes publiées.
          </p>
        </div>
      </div>

      {hasProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Les futures cartes de demandes iront ici */}
        </div>
      ) : (
        /* État vide stylisé reprenant l'aspect de la maquette */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm min-h-[400px]">
          <div className="size-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#0D631B] mb-4">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucune demande dans votre espace</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 font-medium">
            Vous n'avez pas encore publié de besoin d'achat. Créez votre première demande pour recevoir des propositions des fournisseurs.
          </p>
          <Button 
            onClick={triggerNewForm}
            className="font-bold gap-2 shadow-sm h-11 px-6 bg-[#0D631B] hover:bg-[#094713] text-white"
          >
            <Plus size={20} strokeWidth={2.5} />
            Faire ma première demande
          </Button>
        </div>
      )}
    </div>
  );
}

// Composant principal enveloppé dans un Suspense
export default function CollecteurPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 w-full items-center justify-center text-slate-400 font-medium animate-pulse">
        Chargement de l'espace collecteur...
      </div>
    }>
      <CollecteurContent />
    </Suspense>
  );
}