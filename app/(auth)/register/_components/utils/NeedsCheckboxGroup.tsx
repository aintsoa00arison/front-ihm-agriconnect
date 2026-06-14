// components/register/NeedsCheckboxGroup.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { NEEDS, NeedType } from "../../types/collector";

interface NeedsCheckboxGroupProps {
  selectedNeeds: string[];
  onNeedChange: (need: string, checked: boolean) => void;
}

export default function NeedsCheckboxGroup({ selectedNeeds, onNeedChange }: NeedsCheckboxGroupProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3 sm:p-4 rounded-xl border border-separator/10">
      <span className="text-[9px] sm:text-[10px] font-bold text-label uppercase text-center sm:text-left">
        Besoin :
      </span>
      <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6">
        {NEEDS.map((item) => (
          <div key={item} className="flex items-center space-x-2 group">
            <Checkbox
              id={`need-${item}`}
              checked={selectedNeeds.includes(item)}
              onCheckedChange={(checked) => onNeedChange(item, checked as boolean)}
            />
            <label
              htmlFor={`need-${item}`}
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