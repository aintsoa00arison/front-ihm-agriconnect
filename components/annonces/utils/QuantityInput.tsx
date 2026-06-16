// components/ad/QuantityInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { QuantityUnit } from "../../../app/services/publication/ad";

interface QuantityInputProps {
  value: string;
  unit: QuantityUnit;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: QuantityUnit) => void;
  disabled?: boolean;
}

const UNITS: QuantityUnit[] = ["tonnes", "Sacs", "Kg", "Unités"];

export default function QuantityInput({ value, unit, onValueChange, onUnitChange, disabled }: QuantityInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-800">Quantité</label>
      <div className="flex gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Ex: 3"
          disabled={disabled}
          className="bg-slate-50/50 border-slate-200/80 rounded-xl h-11 text-sm font-medium focus-visible:ring-[#0D631B] flex-1"
          required
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as QuantityUnit)}
          disabled={disabled}
          className="bg-slate-50/50 border border-slate-200/80 rounded-xl h-11 px-3 text-xs font-bold text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0D631B] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}