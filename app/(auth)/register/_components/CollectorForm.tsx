// components/register/CollectorForm.tsx
"use client";

import { useState } from "react";
import { Stepper } from "@/components/ui/stepper";
import CollectorFormContent from "./utils/CollectorFormContent";
import FormNavigation from "./utils/FormNavigation";
import { CollectorFormData, CollectorDataToSubmit } from "../../../services/register/types/collector";

interface Props {
  initialData: any;
  onBack: () => void;
  onNext: (data: CollectorDataToSubmit) => void;
}

const registerSteps = ["Type de rôle", "Informations supplémentaires", "Finalisation du profil"];

export default function CollectorForm({ initialData, onBack, onNext }: Props) {
  const [formData, setFormData] = useState<CollectorFormData>({
    raisonSociale: initialData?.entreprise?.raison_sociale || "",
    siegeSocial: initialData?.entreprise?.siege_social || "",
    telephonePro: initialData?.entreprise?.telephone_pro || "",
    emailPro: initialData?.entreprise?.email_pro || "",
    nif: initialData?.entreprise?.nif || "",
    stat: initialData?.entreprise?.stat || "",
    nomComplet: initialData?.representant_legal?.nom_complet || "",
    telephoneDirect: initialData?.representant_legal?.telephone_direct || "",
    cin: initialData?.representant_legal?.cin || "",
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(initialData?.besoins || []);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (field: keyof CollectorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNeedChange = (need: string, checked: boolean) => {
    setSelectedNeeds((prev) =>
      checked ? [...prev, need] : prev.filter((item) => item !== need)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const dataToSubmit: CollectorDataToSubmit = {
      entreprise: {
        raison_sociale: formData.raisonSociale,
        siege_social: formData.siegeSocial,
        telephone_pro: formData.telephonePro.replace(/\s/g, ""),
        email_pro: formData.emailPro,
        nif: formData.nif,
        stat: formData.stat,
      },
      representant_legal: {
        nom_complet: formData.nomComplet,
        telephone_direct: formData.telephoneDirect.replace(/\s/g, ""),
        cin: formData.cin.replace(/\s/g, ""),
      },
      besoins: selectedNeeds,
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
            Détails professionnels de votre compte collecteur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <CollectorFormContent
            formData={formData}
            selectedNeeds={selectedNeeds}
            onInputChange={handleInputChange}
            onNeedChange={handleNeedChange}
            onValidationChange={setIsFormValid}
          />
          <FormNavigation onBack={onBack} isSubmitting={!isFormValid} />
        </form>
      </div>
    </div>
  );
}