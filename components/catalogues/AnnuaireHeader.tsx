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

interface AnnuaireHeaderProps {
  onBack: () => void;
}

export default function AnnuaireHeader({ onBack }: AnnuaireHeaderProps) {
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
              Liste des membres
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Description */}
      <div className="flex items-center gap-2">
        <UserCheck className="text-primary" size={24} />
        <p className="text-sm text-muted-foreground font-medium">
          Consultez tous les membres de la plateforme
        </p>
      </div>
    </div>
  );
}