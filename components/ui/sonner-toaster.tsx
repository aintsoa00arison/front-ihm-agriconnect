// components/ui/sonner-toaster.tsx
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      duration={6000}
      toastOptions={{
        style: {
          padding: "1rem",
          borderRadius: "1rem",
          fontSize: "0.75rem",
          fontWeight: "600",
        },
        className: "!pr-10",
        classNames: {
          toast: "border shadow-xl relative",
          success: "bg-[#e8f5e9] border-[#2e7d32]/30 text-[#1b5e20]",
          error: "bg-red-50 border-red-200 text-red-900",
          info: "bg-amber-50 border-amber-200 text-amber-900",
        },
      }}
    />
  );
}