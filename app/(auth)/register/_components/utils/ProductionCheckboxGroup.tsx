// components/register/ProductionCheckboxGroup.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Tractor } from "lucide-react";
import { PRODUCTION_TYPES, ProductionType } from "../../types/fournisseur";

interface ProductionCheckboxGroupProps {
  selectedProductions: ProductionType[];
  onProductionChange: (prod: ProductionType, checked: boolean) => void;
}

export default function ProductionCheckboxGroup({
  selectedProductions,
  onProductionChange,
}: ProductionCheckboxGroupProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3 sm:p-4 rounded-xl border border-separator/10">
      <div className="flex items-center justify-center sm:justify-start space-x-2 ml-0 sm:ml-2 select-none">
        <Tractor size={14} />
        <span className="text-[9px] sm:text-[10px] font-bold text-label uppercase">
          Type de production :
        </span>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6">
        {PRODUCTION_TYPES.map((item) => (
          <div key={item} className="flex items-center space-x-2 group">
            <Checkbox
              id={`prod-${item}`}
              checked={selectedProductions.includes(item)}
              onCheckedChange={(checked) => onProductionChange(item, checked as boolean)}
            />
            <label
              htmlFor={`prod-${item}`}
              className="text-[11px] sm:text-xs font-bold text-neutral-700 cursor-pointer group-hover:text-primary transition-colors select-none"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}