// components/register/FournisseurForm.tsx
"use client";

import { useState } from "react";
import { Stepper } from "@/components/ui/stepper";
import EntrepriseForm from "./utils/EntrepriseForm";
import ParticulierForm from "./utils/ParticulierForm";
import ProductionCheckboxGroup from "./utils/ProductionCheckboxGroup";
import FormNavigation from "./utils/FormNavigation";
import { UserType, FournisseurDataToSubmit, ProductionType } from "../../../services/register/types/fournisseur";

interface Props {
  type: UserType;
  initialData: any;
  onBack: () => void;
  onNext: (data: FournisseurDataToSubmit) => void;
}

const registerSteps = ["Type de profil", "Informations supplémentaires", "Finalisation du profil"];

export default function FournisseurForm({ type, initialData, onBack, onNext }: Props) {
  const isEntreprise = type === "entreprise";

  const [formData, setFormData] = useState({
    // Entreprise
    nomEntite: initialData?.structure?.nom_entite || "",
    localisationEntite: initialData?.structure?.localisation || "",
    contactExploitation: initialData?.structure?.contact_exploitation || "",
    emailContact: initialData?.structure?.email_contact || "",
    nif: initialData?.structure?.nif || "",
    stat: initialData?.structure?.stat || "",
    nomResponsable: initialData?.responsable?.nom_complet || "",
    telephoneResponsable: initialData?.responsable?.telephone_direct || "",
    cinResponsable: initialData?.responsable?.cin || "",
    // Particulier
    nomParticulier: initialData?.profil?.nom_complet || "",
    telephoneParticulier: initialData?.profil?.telephone || "",
    cinParticulier: initialData?.profil?.cin || "",
    localisationParticulier: initialData?.profil?.localisation || "",
  });

  const [selectedProductions, setSelectedProductions] = useState<ProductionType[]>(
    initialData?.productions || []
  );

  const [isEntrepriseValid, setIsEntrepriseValid] = useState(false);
  const [isParticulierValid, setIsParticulierValid] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductionChange = (prod: ProductionType, checked: boolean) => {
    setSelectedProductions((prev) =>
      checked ? [...prev, prod] : prev.filter((item) => item !== prod)
    );
  };

  const isFormValid = isEntreprise ? isEntrepriseValid : isParticulierValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const dataToSubmit: FournisseurDataToSubmit = isEntreprise
      ? {
          type: "entreprise",
          structure: {
            nom_entite: formData.nomEntite,
            localisation: formData.localisationEntite,
            contact_exploitation: formData.contactExploitation.replace(/\s/g, ""),
            email_contact: formData.emailContact,
            nif: formData.nif,
            stat: formData.stat,
          },
          responsable: {
            nom_complet: formData.nomResponsable,
            telephone_direct: formData.telephoneResponsable.replace(/\s/g, ""),
            cin: formData.cinResponsable.replace(/\s/g, ""),
          },
          productions: selectedProductions,
        }
      : {
          type: "particulier",
          profil: {
            nom_complet: formData.nomParticulier,
            telephone: formData.telephoneParticulier.replace(/\s/g, ""),
            cin: formData.cinParticulier.replace(/\s/g, ""),
            localisation: formData.localisationParticulier,
          },
          productions: selectedProductions,
        };

    onNext(dataToSubmit);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 h-fit animate-in fade-in duration-500">
      <Stepper steps={registerSteps} currentStep={2} />

      <div className="bg-white rounded-[16px] sm:rounded-[20px] shadow-sm border border-separator/10 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-base sm:text-xl font-bold text-label uppercase tracking-wider font-manrope">
            Information supplémentaire
          </h2>
          <p className="text-[10px] sm:text-[11px] text-input-element italic">
            {isEntreprise
              ? "Détails de votre exploitation ou société de production"
              : "Complétez vos informations personnelles de producteur"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {isEntreprise ? (
            <EntrepriseForm
              formData={formData}
              onInputChange={handleInputChange}
              onValidationChange={setIsEntrepriseValid}
            />
          ) : (
            <ParticulierForm
              formData={formData}
              onInputChange={handleInputChange}
              onValidationChange={setIsParticulierValid}
            />
          )}

          <ProductionCheckboxGroup
            selectedProductions={selectedProductions}
            onProductionChange={handleProductionChange}
          />

          <FormNavigation onBack={onBack} isSubmitting={!isFormValid} />
        </form>
      </div>
    </div>
  );
}