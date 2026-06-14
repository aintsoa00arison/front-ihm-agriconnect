// app/catalogue/components/AnnuaireHeader.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UserCheck } from "lucide-react";
import type { TargetRole } from "./types/annuaire";

interface AnnuaireHeaderProps {
  type: TargetRole;
  onBack: () => void;
}

export default function AnnuaireHeader({ type, onBack }: AnnuaireHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Fil d'Ariane avec Breadcrumb shadcn */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack} className="cursor-pointer">
              Catalogue
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              Liste des {type}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Description seulement, plus de titre en double */}
      <div className="flex items-center gap-2">
        <UserCheck className="text-primary" size={24} />
        <p className="text-sm text-muted-foreground font-medium">
          {type === "fournisseurs" 
            ? "Découvrez les producteurs partenaires près de chez vous" 
            : "Trouvez les collecteurs qui recherchent vos produits"}
        </p>
      </div>
    </div>
  );
}