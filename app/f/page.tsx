"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Store, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdForm from "@/components/annonces/AddForm"; // Chemin relatif corrigé pour la compilation

function FournisseurDashboardContent() {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Écoute sécurisée de l'URL pour capter ?action=new
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
      window.history.pushState({}, "", "/f");
      setIsCreatingNew(false);
    }
  };

  const handleSave = (data: any) => {
    console.log("Nouvelle annonce enregistrée :", data);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/f");
      setIsCreatingNew(false);
    }
  };

  const triggerNewForm = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/f?action=new");
      setIsCreatingNew(true);
    }
  };

  // Simulation d'une liste de produits vide pour l'instant
  const hasProducts = false;

  // Si l'action "nouvelle annonce" est détectée, on affiche le formulaire d'ajout
  if (isCreatingNew) {
    return (
      <div className="animate-in fade-in duration-200">
        <AdForm
          mode="annonce" // Version annonce de vente pour le fournisseur
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* En-tête de l'espace catalogue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="text-[#0D631B]" size={24} />
            Mon Catalogue de Produits
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Gérez vos offres, vos stocks et vos publications visibles par les collecteurs.
          </p>
        </div>
      </div>

      {/* Zone de contenu principal */}
      {hasProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Les cartes de produits s'afficheront ici */}
        </div>
      ) : (
        /* État vide (Empty State) propre */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm min-h-[400px]">
          <div className="size-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#0D631B] mb-4">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucun produit dans votre catalogue</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 font-medium">
            Vous n'avez pas encore publié d'offres. Commencez dès maintenant à ajouter vos récoltes ou produits disponibles.
          </p>
          <Button 
            onClick={triggerNewForm}
            className="font-bold gap-2 shadow-sm h-11 px-6 bg-[#0D631B] hover:bg-[#094713] text-white"
          >
            <Plus size={20} strokeWidth={2.5} />
            Ajouter mon premier produit
          </Button>
        </div>
      )}
    </div>
  );
}

// Composant principal enveloppé dans un Suspense pour éviter toute erreur au rendu Next.js
export default function SupplierDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 w-full items-center justify-center text-slate-400 font-medium animate-pulse">
        Chargement du catalogue fournisseur...
      </div>
    }>
      <FournisseurDashboardContent />
    </Suspense>
  );
}