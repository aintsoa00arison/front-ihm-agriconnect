// components/profile/EditSupplierProfileForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, User, Mail, Phone, FileText, MapPin, Diamond, Calendar, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ProfileBreadcrumb from "./utils/ProfileBreadcrumb";
import CompanyInfoSection from "./utils/CompanyInfoSection";
import RepresentativeSection from "./utils/RepresentativeSection";
import PersonalInfoSection from "./utils/PersonalInfoSection";
import ProductionPreferencesSection from "./utils/ProductionPreferencesSection";
import AvatarSection from "./utils/AvatarSection";
import BioSection from "./utils/BioSection";
import { validateFormField } from "../../../app/utils/validation";
import type { FournisseurType, ProductionKey, ProductionTypesState } from "../../../app/services/profile/types/supplierProfile";
import { PRODUCTION_MAPPING } from "../../../app/services/profile/types/supplierProfile";

interface EditSupplierProfileFormProps {
  type: FournisseurType;
  initialData?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default function EditSupplierProfileForm({
  type,
  initialData,
  onCancel,
  onSave,
}: EditSupplierProfileFormProps) {
  const isEntreprise = type === 'entreprise';

  // États
  const [company, setCompany] = useState({
    name: initialData?.company?.name || "",
    address: initialData?.company?.address || "",
    email: initialData?.company?.email || "",
    phone: initialData?.company?.phone || "",
    nif: initialData?.company?.nif || "",
    stat: initialData?.company?.stat || "",
  });

  const [representative, setRepresentative] = useState({
    lastName: initialData?.representative?.lastName || "",
    firstName: initialData?.representative?.firstName || "",
    email: initialData?.representative?.email || "",
    phone: initialData?.representative?.phone || "",
    cin: initialData?.representative?.cin || "",
  });

  const [personal, setPersonal] = useState({
    lastName: initialData?.lastName || "",
    firstName: initialData?.firstName || "",
    birthDate: initialData?.birthDate || "",
    birthPlace: initialData?.birthPlace || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    cin: initialData?.cin || "",
  });

  const [productionTypes, setProductionTypes] = useState<ProductionTypesState>({
    vegetale: initialData?.productionTypes?.includes("Végétale") || false,
    elevage: initialData?.productionTypes?.includes("Élevage") || false,
    Rente: initialData?.productionTypes?.includes("Rente") || false,
  });

  const [bio, setBio] = useState(initialData?.bio || "");
  const [avatarSrc, setAvatarSrc] = useState(initialData?.avatarUrl || "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=defaultSupplier");

  const [touched, setTouched] = useState<{
    company?: Record<string, boolean>;
    representative?: Record<string, boolean>;
    personal?: Record<string, boolean>;
  }>({});

  const markAsTouched = (section: 'company' | 'representative' | 'personal', field: string) => {
    setTouched((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: true },
    }));
  };

  // Calcul des erreurs
  const errors = {
    company: isEntreprise ? {
      name: touched.company?.name ? validateFormField.required(company.name, "La raison sociale") : undefined,
      address: touched.company?.address ? validateFormField.required(company.address, "L'adresse") : undefined,
      email: touched.company?.email ? (validateFormField.required(company.email, "L'email") || validateFormField.email(company.email)) : undefined,
      phone: touched.company?.phone ? (validateFormField.required(company.phone, "Le téléphone") || validateFormField.phone(company.phone)) : undefined,
      nif: touched.company?.nif ? (validateFormField.required(company.nif, "Le NIF") || validateFormField.nif(company.nif)) : undefined,
      stat: touched.company?.stat ? validateFormField.required(company.stat, "Le STAT") : undefined,
    } : {},
    representative: isEntreprise ? {
      lastName: touched.representative?.lastName ? validateFormField.required(representative.lastName, "Le nom") : undefined,
      firstName: touched.representative?.firstName ? validateFormField.required(representative.firstName, "Le prénom") : undefined,
      email: touched.representative?.email ? (validateFormField.required(representative.email, "L'email") || validateFormField.email(representative.email)) : undefined,
      phone: touched.representative?.phone ? (validateFormField.required(representative.phone, "Le téléphone") || validateFormField.phone(representative.phone)) : undefined,
      cin: touched.representative?.cin ? (validateFormField.required(representative.cin, "Le CIN") || validateFormField.cin(representative.cin)) : undefined,
    } : {},
    personal: !isEntreprise ? {
      lastName: touched.personal?.lastName ? validateFormField.required(personal.lastName, "Le nom") : undefined,
      firstName: touched.personal?.firstName ? validateFormField.required(personal.firstName, "Le prénom") : undefined,
      phone: touched.personal?.phone ? (validateFormField.required(personal.phone, "Le téléphone") || validateFormField.phone(personal.phone)) : undefined,
      email: touched.personal?.email ? (validateFormField.required(personal.email, "L'email") || validateFormField.email(personal.email)) : undefined,
      cin: touched.personal?.cin ? (validateFormField.required(personal.cin, "Le CIN") || validateFormField.cin(personal.cin)) : undefined,
    } : {},
  };

  const isFormValid = () => {
    if (isEntreprise) {
      return !Object.values(errors.company).some(e => e) && 
             !Object.values(errors.representative).some(e => e) &&
             company.name && company.address && company.email && company.phone &&
             representative.lastName && representative.firstName && representative.email && representative.phone;
    } else {
      return !Object.values(errors.personal).some(e => e) &&
             personal.lastName && personal.firstName && personal.phone && personal.email;
    }
  };

  const handleProductionToggle = (key: ProductionKey) => {
    setProductionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Marquer tous les champs comme touchés
    if (isEntreprise) {
      setTouched({
        company: { name: true, address: true, email: true, phone: true, nif: true, stat: true },
        representative: { lastName: true, firstName: true, email: true, phone: true, cin: true },
      });
    } else {
      setTouched({
        personal: { lastName: true, firstName: true, phone: true, email: true, cin: true },
      });
    }

    if (!isFormValid()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    const selectedProductions = Object.entries(productionTypes)
      .filter(([, selected]) => selected)
      .map(([key]) => PRODUCTION_MAPPING[key as ProductionKey]);

    const commonData = {
      type,
      bio,
      avatarUrl: avatarSrc,
      productionTypes: selectedProductions,
    };

    const finalData = isEntreprise
      ? { ...commonData, company, representative }
      : { ...commonData, ...personal };

    onSave(finalData);
    toast.success("Profil mis à jour avec succès !");
  };

  const handleBack = () => {
    onCancel();
  };

  return (
    <div className="w-full h-full bg-neutral p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        
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
                {isEntreprise 
                  ? "Mettre à jour les informations de votre entreprise et de votre représentant légal."
                  : "Mettre à jour les informations de votre compte particulier."}
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <Button type="button" onClick={onCancel} variant="outline" className="rounded-xl font-bold border-border text-muted-foreground hover:bg-muted px-6 h-11">
                Annuler
              </Button>
              <Button type="submit" form="supplier-form" className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 transition-all">
                Enregistrer
              </Button>
            </div>
          </div>
        </div>

        {/* ZONE SCROLLABLE */}
        <div className="flex-1 overflow-y-auto pb-10">
          <form id="supplier-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* COLONNE GAUCHE */}
            <div className="lg:col-span-2 space-y-6">
              {isEntreprise ? (
                <>
                  <CompanyInfoSection 
                    data={company} 
                    onChange={(field, value) => setCompany(prev => ({ ...prev, [field]: value }))}
                    onBlur={(field) => markAsTouched('company', field)}
                    errors={errors.company}
                  />
                  <RepresentativeSection 
                    data={representative}
                    onChange={(field, value) => setRepresentative(prev => ({ ...prev, [field]: value }))}
                    onBlur={(field) => markAsTouched('representative', field)}
                    errors={errors.representative}
                  />
                </>
              ) : (
                <PersonalInfoSection 
                  data={personal}
                  onChange={(field, value) => setPersonal(prev => ({ ...prev, [field]: value }))}
                  onBlur={(field) => markAsTouched('personal', field)}
                  errors={errors.personal}
                />
              )}
              
              {!isEntreprise && (
                <ProductionPreferencesSection 
                  productionTypes={productionTypes}
                  onToggle={handleProductionToggle}
                />
              )}
            </div>

            {/* COLONNE DROITE */}
            <div className="space-y-6">
              {isEntreprise && (
                <ProductionPreferencesSection 
                  productionTypes={productionTypes}
                  onToggle={handleProductionToggle}
                  isSidebar
                />
              )}
              <BioSection bio={bio} onChange={setBio} isEntreprise={isEntreprise} />
              <AvatarSection avatarSrc={avatarSrc} onAvatarChange={setAvatarSrc} isEntreprise={isEntreprise} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}