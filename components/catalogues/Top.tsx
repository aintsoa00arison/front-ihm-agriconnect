// app/catalogue/Top.tsx
"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTopSuppliers } from "../../app/services/hooks/useTopSuppliers";
import type { UserRole } from "../../app/services/publication/catalogue";

interface TopSuppliersProps {
  userRole: UserRole;
  onViewAll: () => void;
  onViewProfile: (name: string) => void;
}

export default function TopSuppliers({ 
  userRole, 
  onViewAll, 
  onViewProfile 
}: TopSuppliersProps) {
  const router = useRouter();
  const { suppliers, isLoading } = useTopSuppliers(userRole);

  const handleViewAll = () => {
    // 🔥 Correction: Utiliser le bon chemin selon le rôle
    const isProvider = userRole === "fournisseur" ;
    const isCollector = userRole === "collecteur" ;
    
    if (isProvider) {
      router.push("/f/annuaire");
    } else if (isCollector) {
      router.push("/c/annuaire");
    } else {
      // Fallback
      router.push("/c/annuaire");
    }
  };

  // 🔥 Skeleton loader
  if (isLoading) {
    return (
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-1.5 shrink-0">
          <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
          <div className="h-3 w-16 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="divide-y divide-border grow">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-slate-200 animate-pulse rounded" />
                  <div className="h-2 w-32 bg-slate-200 animate-pulse rounded" />
                </div>
              </div>
              <div className="h-3 w-12 bg-slate-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔥 Aucun résultat
  if (suppliers.length === 0) {
    return (
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-1.5 shrink-0">
          <h3 className="text-xs font-bold text-foreground">
            {userRole === "fournisseur" ? "Top 5 collecteurs" : "Top 5 fournisseurs"}
          </h3>
          <button 
            onClick={handleViewAll} 
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Voir plus
          </button>
        </div>
        <div className="text-center py-4 text-xs text-muted-foreground">
          Aucun membre trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-1.5 shrink-0">
        <h3 className="text-xs font-bold text-foreground">
          {userRole === "fournisseur" ? "Top 5 collecteurs" : "Top 5 fournisseurs"}
        </h3>
        <button 
          onClick={handleViewAll} 
          className="text-[11px] font-bold text-primary hover:underline"
        >
          Voir plus
        </button>
      </div>

      <div className="divide-y divide-border grow">
        {suppliers.map((person, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <img src={person.avatar} alt={person.name} className="size-7 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold text-foreground">{person.name}</p>
                <p className="text-[10px] text-muted-foreground">{person.location} • {person.productionType}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={9} className={i < Math.floor(person.rating) ? "text-amber-400 fill-amber-400" : "text-border"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{person.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onViewProfile(person.name)} 
              className="text-[11px] font-bold text-primary hover:underline"
            >
              Profil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}