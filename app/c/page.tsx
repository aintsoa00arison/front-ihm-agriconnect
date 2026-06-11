"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Store, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdForm from "@/components/annonces/AddForm"; 
import CataloguePage from "@/components/catalogues/CataloguePage"; 

function CollecteurContent() {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Écoute sécurisée des changements de l'URL pour ?action=new
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setIsCreatingNew(params.get("action") === "new");
      }
    };

    handleUrlChange();

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/c");
      setIsCreatingNew(false);
    }
  };

  const handleSave = async (data: any) => {
    console.log("Nouvelle demande enregistrée :", data);
    
    if (typeof window !== "undefined") {
      // Temporisation de 2 secondes pour laisser le toast de AdForm s'afficher
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
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

  // 💡 À passer à true pour afficher le catalogue global, ou false pour tester le layout vide
  const hasProducts = true; 

  if (isCreatingNew) {
    return (
      <div className="animate-in fade-in duration-200">
        <AdForm
          mode="demande"
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <>
      {hasProducts ? (
        /* 🔄 Affiche le catalogue global adapté au rôle collecteur (offres des fournisseurs) */
        <CataloguePage userRole="collecteur" />
      ) : (
        /* 📭 État vide personnalisé si aucune annonce ou demande n'est disponible sur le marché */
        <div className="space-y-6 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Store className="text-[#0D631B]" size={24} />
                Catalogue
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Explorez les offres de récoltes et produits disponibles chez les fournisseurs.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm min-h-[400px]">
            <div className="size-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#0D631B] mb-4">
              <Package size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucune annonce ou demande disponible</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 font-medium">
              Il n'y a actuellement aucune publication sur le marché. Soyez le premier à publier un besoin pour lancer les échanges.
            </p>
            <Button 
              onClick={triggerNewForm}
              className="font-bold gap-2 shadow-sm h-11 px-6 bg-[#0D631B] hover:bg-[#094713] text-white"
            >
              <Plus size={20} strokeWidth={2.5} />
              Faire ma première demande
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default function CollecteurPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 w-full items-center justify-center text-slate-400 font-medium animate-pulse">
        Chargement de l'espace catalogue...
      </div>
    }>
      <CollecteurContent />
    </Suspense>
  );
}