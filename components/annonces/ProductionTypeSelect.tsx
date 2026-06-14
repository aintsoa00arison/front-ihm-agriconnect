// components/ad/ProductionTypeSelect.tsx
"use client";

import { ProductionType } from "./types/ad";

interface ProductionTypeSelectProps {
  value: ProductionType;
  onChange: (value: ProductionType) => void;
  disabled?: boolean;
}

const PRODUCTION_TYPES: ProductionType[] = ["Végétale", "Élevage", "Rente"];

export default function ProductionTypeSelect({ value, onChange, disabled }: ProductionTypeSelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-800">Type de production</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ProductionType)}
          disabled={disabled}
          className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl h-11 px-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D631B] focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {PRODUCTION_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}