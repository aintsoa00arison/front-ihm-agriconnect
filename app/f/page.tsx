import React from 'react';
import { Store, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupplierDashboardPage() {
  // Simulation d'une liste de produits vide pour l'instant
  const hasProducts = false;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* En-tête de l'espace catalogue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="text-primary" size={24} />
            Mon Catalogue de Produits
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos offres, vos stocks et vos publications visibles par les collecteurs.
          </p>
        </div>
      </div>

      {/* Zone de contenu principal */}
      {hasProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tes futures cartes de produits iront ici */}
        </div>
      ) : (
        /* État vide (Empty State) propre */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm min-h-[400px]">
          <div className="size-14 bg-emerald-50 rounded-full flex items-center justify-center text-primary mb-4">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucun produit dans votre catalogue</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            Vous n'avez pas encore publié d'offres. Commencez dès maintenant à ajouter vos récoltes ou produits disponibles.
          </p>
          <Button className="font-bold gap-2 shadow-sm h-11 px-6">
            <Plus size={20} strokeWidth={2.5} />
            Ajouter mon premier produit
          </Button>
        </div>
      )}
    </div>
  );
}