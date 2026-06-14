// components/ad/DescriptionTextarea.tsx
"use client";

import { Textarea } from "@/components/ui/textarea";

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DescriptionTextarea({ value, onChange, disabled }: DescriptionTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-800">Description</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A propos du produit..."
        disabled={disabled}
        className="w-full min-h-[140px] bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-[#0D631B] p-4 text-sm font-medium resize-none"
        required
      />
    </div>
  );
}