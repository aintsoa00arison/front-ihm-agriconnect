// components/profile/utils/ProductionPreferencesSection.tsx
"use client";

import { Diamond } from "lucide-react";
import { ProductionTypesState, ProductionKey, PRODUCTION_KEYS, PRODUCTION_LABELS } from "../../../../app/services/profile/types/supplierProfile";

interface ProductionPreferencesSectionProps {
  productionTypes: ProductionTypesState;
  onToggle: (key: ProductionKey) => void;
  isSidebar?: boolean; // Ajout de la propriété optionnelle
}

export default function ProductionPreferencesSection({ 
  productionTypes, 
  onToggle, 
  isSidebar = false 
}: ProductionPreferencesSectionProps) {
  if (isSidebar) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-foreground font-bold text-base">
          <Diamond size={18} className="text-primary" />
          <h3>Type de production</h3>
        </div>
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Sélectionnez tous les types de productions gérés par l'entreprise
        </p>
        <div className="flex flex-col gap-2">
          {PRODUCTION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                productionTypes[key]
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted/20 border-border text-muted-foreground"
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                productionTypes[key]
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border"
              }`}>
                {productionTypes[key] && "✓"}
              </div>
              <span className="capitalize">{PRODUCTION_LABELS[key]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-foreground font-bold text-base">
        <Diamond size={18} className="text-primary" />
        <h3>Préférences de produits</h3>
      </div>
      <span className="text-xs font-bold text-muted-foreground block">Type de production recherchés</span>
      <div className="flex flex-wrap gap-3">
        {PRODUCTION_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              productionTypes[key]
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/20 border-border text-muted-foreground"
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
              productionTypes[key]
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-card border-border"
            }`}>
              {productionTypes[key] && "✓"}
            </div>
            <span className="capitalize">{PRODUCTION_LABELS[key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}