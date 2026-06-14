// components/profile/EditCollectorProfileForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProfileBreadcrumb from "./utils/ProfileBreadcrumb";
import CompanyInfoSection from "./utils/CompanyInfoSection";
import ProductionPreferencesSection from "./utils/ProductionPreferencesSection";
import RepresentativeSection from "./utils/RepresentativeSection";
import { validateFormField } from "../../../app/utils/validation";
import type { 
  CompanyData, 
  RepresentativeData, 
  ProductionTypesState, 
  ProductionKey,
  CollectorProfileFormData 
} from "../types/collectorProfile";
import { PRODUCTION_MAPPING } from "../types/collectorProfile";

interface EditCollectorProfileFormProps {
  initialData?: any;
  onCancel: () => void;
  onSave: (data: CollectorProfileFormData) => void;
}

export default function EditCollectorProfileForm({
  initialData,
  onCancel,
  onSave,
}: EditCollectorProfileFormProps) {
  const [company, setCompany] = useState<CompanyData>({
    name: initialData?.company?.name || "",
    address: initialData?.company?.address || "",
    email: initialData?.company?.email || "",
    phone: initialData?.company?.phone || "",
    nif: initialData?.company?.nif || "",
    stat: initialData?.company?.stat || "",
  });

  const [productionTypes, setProductionTypes] = useState<ProductionTypesState>({
    vegetale: initialData?.productionTypes?.includes("Végétale") || false,
    elevage: initialData?.productionTypes?.includes("Élevage") || false,
    Rente: initialData?.productionTypes?.includes("Rente") || false,
  });

  const [representative, setRepresentative] = useState<RepresentativeData>({
    lastName: initialData?.representative?.lastName || "",
    firstName: initialData?.representative?.firstName || "",
    email: initialData?.representative?.email || "",
    phone: initialData?.representative?.phone || "",
    cin: initialData?.representative?.cin || "",
  });

  const [touched, setTouched] = useState<{
    company?: Partial<Record<keyof CompanyData, boolean>>;
    representative?: Partial<Record<keyof RepresentativeData, boolean>>;
  }>({});

  const markAsTouched = (section: 'company' | 'representative', field: string) => {
    setTouched((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: true },
    }));
  };

  // Calcul des erreurs en temps réel
  const errors = {
    company: {
      name: touched.company?.name ? validateFormField.required(company.name, "La raison sociale") : undefined,
      address: touched.company?.address ? validateFormField.required(company.address, "L'adresse") : undefined,
      email: touched.company?.email ? (validateFormField.required(company.email, "L'email") || validateFormField.email(company.email)) : undefined,
      phone: touched.company?.phone ? (validateFormField.required(company.phone, "Le téléphone") || validateFormField.phone(company.phone)) : undefined,
      nif: touched.company?.nif ? (validateFormField.required(company.nif, "Le NIF") || validateFormField.nif(company.nif)) : undefined,
      stat: touched.company?.stat ? validateFormField.required(company.stat, "Le STAT") : undefined,
    },
    representative: {
      lastName: touched.representative?.lastName ? validateFormField.required(representative.lastName, "Le nom") : undefined,
      firstName: touched.representative?.firstName ? validateFormField.required(representative.firstName, "Le prénom") : undefined,
      email: touched.representative?.email ? (validateFormField.required(representative.email, "L'email") || validateFormField.email(representative.email)) : undefined,
      phone: touched.representative?.phone ? (validateFormField.required(representative.phone, "Le téléphone") || validateFormField.phone(representative.phone)) : undefined,
      cin: touched.representative?.cin ? (validateFormField.required(representative.cin, "Le CIN") || validateFormField.cin(representative.cin)) : undefined,
    },
  };

  const isFormValid = () => {
    return !Object.values(errors.company).some(e => e) && 
           !Object.values(errors.representative).some(e => e) &&
           company.name && company.address && company.email && company.phone && company.nif &&
           representative.lastName && representative.firstName && representative.email && representative.phone && representative.cin;
  };

  const handleCompanyChange = (field: keyof CompanyData, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleRepresentativeChange = (field: keyof RepresentativeData, value: string) => {
    setRepresentative((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductionToggle = (key: ProductionKey) => {
    setProductionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marquer tous les champs comme touchés avant validation
    setTouched({
      company: {
        name: true,
        address: true,
        email: true,
        phone: true,
        nif: true,
        stat: true,
      },
      representative: {
        lastName: true,
        firstName: true,
        email: true,
        phone: true,
        cin: true,
      },
    });

    if (!isFormValid()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const selectedProductions = Object.entries(productionTypes)
      .filter(([, selected]) => selected)
      .map(([key]) => PRODUCTION_MAPPING[key as ProductionKey]);

    const formData: CollectorProfileFormData = {
      company,
      productionTypes: selectedProductions,
      representative,
    };

    onSave(formData);
    toast.success("Profil mis à jour avec succès !");
  };

  const handleBack = () => {
    onCancel();
  };

  return (
    <div className="w-full h-full bg-neutral p-4 md:p-8 overflow-hidden">
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        
        {/* Fil d'Ariane */}
        <div className="mb-4">
          <ProfileBreadcrumb onBack={handleBack} />
        </div>

        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-neutral/95 backdrop-blur-sm pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Modifier le profil</h1>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Mettre à jour les informations de votre entreprise et de votre représentant légal.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="rounded-xl font-bold border-border text-muted-foreground hover:bg-muted px-6 h-11"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="profile-form"
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 transition-all"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>

        {/* ZONE SCROLLABLE */}
        <div className="flex-1 overflow-y-auto pb-10">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <CompanyInfoSection 
              data={company} 
              onChange={handleCompanyChange}
              onBlur={(field) => markAsTouched('company', field)}
              errors={errors.company}
            />
            <ProductionPreferencesSection 
              productionTypes={productionTypes}
              onToggle={handleProductionToggle}
            />
            <RepresentativeSection 
              data={representative}
              onChange={handleRepresentativeChange}
              onBlur={(field) => markAsTouched('representative', field)}
              errors={errors.representative}
            />
          </form>
        </div>
      </div>
    </div>
  );
}