// app/catalogue/Top.tsx
"use client";

import { Star } from "lucide-react";
import type { Supplier, UserRole } from "./types/catalogue";

interface TopSuppliersProps {
  suppliers: Supplier[];
  userRole: UserRole;
  onViewAll: () => void;
  onViewProfile: (name: string) => void;
}

export default function TopSuppliers({ 
  suppliers, 
  userRole, 
  onViewAll, 
  onViewProfile 
}: TopSuppliersProps) {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2.5 flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-1.5 shrink-0">
        <h3 className="text-xs font-bold text-foreground">
          {userRole === "fournisseur" ? "Top 5 collecteurs" : "Top 5 fournisseurs"}
        </h3>
        <button 
          onClick={onViewAll} 
          className="text-[11px] font-bold text-primary hover:underline"
        >
          Voir plus
        </button>
      </div>

      <div className="divide-y divide-border grow ">
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
                      <Star key={i} size={9} className={i < person.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{person.rating}.0</span>
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