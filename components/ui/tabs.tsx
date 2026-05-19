"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
     { ...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // On calque ton ancienne structure : flex, pleine largeur, fond transparent, bordure basse fine
        "flex w-full bg-transparent border-b border-separator/20 h-auto p-0 rounded-none items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Typographie, transitions et comportement flex
        "flex-1 pb-3 pt-2 text-base font-bold text-center whitespace-nowrap transition-all outline-none cursor-pointer select-none",
        // Comportement des bordures : pas de bordures latérales/hautes, bordure basse par défaut transparente
        "border-t-0 border-x-0 border-b-2 border-transparent",
        
        // --- ÉTAT ACTIF / SÉLECTIONNÉ ---
        // Écrit en vert primary, bordure basse en vert primary, et fond léger light-bg/20
        "data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-light-bg/50",
        
        // --- ÉTAT INACTIF ---
        // Couleur grisée de tes éléments d'input, pas de fond
        "data-[state=inactive]:text-input-element/40 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent",
        
        // États système (Focus propre & Désactivé)
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }