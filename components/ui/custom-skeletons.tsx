// components/ui/custom-skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Skeleton pour les cartes d'annonces
export function AdCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      <Skeleton className="w-full h-56 md:h-72 rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="sm:text-right">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-4 w-20 mt-1" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-7 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="size-8 rounded-full" />
      </div>
    </div>
  );
}

// Skeleton pour la sidebar
export function SidebarSkeleton() {
  return (
    <nav className="w-[292px] flex-shrink-0 bg-white border-r border-border shadow-sm flex flex-col pb-3 h-full overflow-y-auto">
      <div className="px-4 py-4 mb-6 border-b border-border">
        <Skeleton className="w-full h-12 rounded-lg" />
      </div>
      <div className="flex flex-col grow justify-between">
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center pl-6 pr-2 py-4">
              <Skeleton className="w-7 h-7 mr-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="p-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </nav>
  );
}

// Skeleton pour le filtre
export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="w-full p-4 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="size-4" />
      </div>
    </div>
  );
}

// Skeleton pour la page entière (dashboard)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Barre de filtre */}
      <FilterSkeleton />
      
      {/* Résultat */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
      </div>
      
      {/* Cartes */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <AdCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}