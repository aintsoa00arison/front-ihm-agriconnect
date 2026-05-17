import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground md:text-sm",
        
        // État Actif (Focus) : Bordure affinée et halo discret
        "focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30",
        
        // État Désactivé
        "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        
        // État Invalide (Erreur)
        "aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20",
        
        // Dark mode basique
        "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        
        className
      )}
      {...props}
    />
  )
}

export { Textarea }