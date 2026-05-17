import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Dimensions de base et typographie
        "w-full h-11 text-base md:text-sm text-label font-manrope",
        // Couleurs de fond et bordures (Venant de ton thème inline @theme)
        "bg-bg-input border-2 border-input-border rounded-auth",
        // Remplissage (padding) : 3rem à gauche pour laisser de la place à l'icône, 1.5rem à droite
        "pl-12 pr-6 py-4",
        // États interactifs (Focus, Placeholder, Disabled)
        "outline-none transition-all duration-200",
        "focus:border-primary focus:bg-white",
        "placeholder:text-input-element/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Gestion des fichiers (si type="file")
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }