// components/register/utils/FormNavigation.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  onBack: () => void;
  isSubmitting: boolean;
  backText?: string;
  nextText?: string;
}

export default function FormNavigation({
  onBack,
  isSubmitting,
  backText = "Précédent",
  nextText = "Suivant",
}: FormNavigationProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-separator/10">
      <button
        type="button"
        onClick={onBack}
        className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-xl border border-separator/30 text-sm font-bold text-label hover:bg-neutral-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
      >
        <ChevronLeft size={16} />
        <span>{backText}</span>
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full sm:w-auto px-6 sm:px-10 py-2.5 text-xs sm:text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>{nextText}</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}