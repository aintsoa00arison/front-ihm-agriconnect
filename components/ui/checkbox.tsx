"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Style de base : Fond blanc forcé, bordure standard, coins arrondis à 4px
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-separator/40 bg-white text-white transition-all outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // État COCHÉ (data-[state=checked]) : Fond et bordure primary
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white",
        
        // Gestion des erreurs (aria-invalid)
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 stroke-[3px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }