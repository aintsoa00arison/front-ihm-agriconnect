"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Store, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdForm from "@/components/annonces/AddForm"; 
import CataloguePage from "@/components/catalogues/CataloguePage"; 
import { getUserRole } from "../services/lib/auth";

function CollecteurContent() {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer le rôle directement
    const role = getUserRole();
    setUserRole(role);
    setIsLoading(false);
    console.log("Rôle récupéré:", role);
    
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
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

  const hasProducts = true;

  if (isLoading) {
    return null; // Rien n'afficher pendant le chargement
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isCreatingNew ? (
        <div className="animate-in fade-in duration-200 p-6">
          <AdForm mode="demande" onCancel={handleCancel} onSave={handleSave} />
        </div>
      ) : (
        <>
          {hasProducts ? (
            <CataloguePage userRole={userRole === "collector" ? "collecteur" : "fournisseur"} />
          ) : (
            <div className="space-y-6 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Store className="text-[#0D631B]" size={24} />
                    Catalogue
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    Explorez les offres de récoltes et produits disponibles chez les fournisseurs.
                  </p>
                </div>
                <Button 
                  onClick={triggerNewForm}
                  className="font-bold gap-2 shadow-sm h-11 px-6 bg-[#0D631B] hover:bg-[#094713] text-white"
                >
                  <Plus size={20} strokeWidth={2.5} />
                  Nouvelle demande
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 shadow-sm min-h-[400px]">
                <div className="size-14 bg-emerald-50 rounded-full flex items-center justify-center text-[#0D631B] mb-4">
                  <Package size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucune annonce ou demande disponible</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 font-medium">
                  Il n'y a actuellement aucune publication sur le marché.
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
      )}
    </div>
  );
}

export default function CollecteurPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="h-8 bg-slate-100 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-4/6"></div>
          </div>
        </div>
      </div>
    }>
      <CollecteurContent />
    </Suspense>
  );
}