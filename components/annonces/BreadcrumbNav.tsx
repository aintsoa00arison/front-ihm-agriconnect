// components/ad/BreadcrumbNav.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdFormMode } from "../../app/services/publication/ad";

interface BreadcrumbNavProps {
  mode: AdFormMode;
  isEditMode: boolean;
  onBack: () => void;
}

export default function BreadcrumbNav({ mode, isEditMode, onBack }: BreadcrumbNavProps) {
  const getBreadcrumbText = () => {
    if (isEditMode) {
      return mode === "annonce" ? "Modification d'annonce" : "Modification de demande";
    }
    return mode === "annonce" ? "Ajout de formulaire" : "Ajout de demande";
  };

  const getParentText = () => {
    if (isEditMode) {
      return "Mon profil";
    }
    return "Catalogue";
  };

  const getParentHref = () => {
    if (isEditMode) {
      return "/profile?tab=annonces";
    }
    return "/catalogue";
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={onBack} 
            className="cursor-pointer hover:text-primary transition-colors"
          >
            {getParentText()}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">
            {getBreadcrumbText()}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}