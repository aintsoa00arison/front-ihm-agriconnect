"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Tractor,
  AlertTriangle,
} from "lucide-react";
import {
  validateEmail,
  validatePhone,
  validateNif,
  validateCin,
  validateStat,
  formatPhone,
  formatCin,
} from "../../../utils/validation";

// Importations des composants racines Shadcn
import { Stepper } from "@/components/ui/stepper";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  type: "particulier" | "entreprise";
  initialData: any;
  onBack: () => void;
  onNext: (data: any) => void;
}

export default function FournisseurForm({
  type,
  initialData,
  onBack,
  onNext,
}: Props) {
  const isEntreprise = type === "entreprise";

  const [formData, setFormData] = useState({
    // Champs Entreprise
    nomEntite:
      initialData?.type === "entreprise"
        ? initialData.structure?.nom_entite || ""
        : "",
    localisationEntite:
      initialData?.type === "entreprise"
        ? initialData.structure?.localisation || ""
        : "",
    contactExploitation:
      initialData?.type === "entreprise"
        ? initialData.structure?.contact_exploitation || ""
        : "",
    emailContact:
      initialData?.type === "entreprise"
        ? initialData.structure?.email_contact || ""
        : "",
    nif:
      initialData?.type === "entreprise"
        ? initialData.structure?.nif || ""
        : "",
    stat:
      initialData?.type === "entreprise"
        ? initialData.structure?.stat || ""
        : "",
    nomResponsable:
      initialData?.type === "entreprise"
        ? initialData.responsable?.nom_complet || ""
        : "",
    telephoneResponsable:
      initialData?.type === "entreprise"
        ? initialData.responsable?.telephone_direct || ""
        : "",
    cinResponsable:
      initialData?.type === "entreprise"
        ? initialData.responsable?.cin || ""
        : "",

    // Champs Particulier
    nomParticulier:
      initialData?.type === "particulier"
        ? initialData.profil?.nom_complet || ""
        : "",
    telephoneParticulier:
      initialData?.type === "particulier"
        ? initialData.profil?.telephone || ""
        : "",
    cinParticulier:
      initialData?.type === "particulier" ? initialData.profil?.cin || "" : "",
    localisationParticulier:
      initialData?.type === "particulier"
        ? initialData.profil?.localisation || ""
        : "",
  });

  const [selectedProductions, setSelectedProductions] = useState<string[]>(
    initialData?.productions || [],
  );

  const registerSteps = [
    "Type de profil",
    "Informations supplémentaires",
    "Finalisation du profil",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (prod: string, checked: boolean) => {
    setSelectedProductions((prev) =>
      checked ? [...prev, prod] : prev.filter((item) => item !== prod),
    );
  };

  // Validations en temps réel
  const isEmailContactValid = formData.emailContact
    ? validateEmail(formData.emailContact)
    : true;
  const isContactExploitationValid = formData.contactExploitation
    ? validatePhone(formData.contactExploitation)
    : true;
  const isTelephoneResponsableValid = formData.telephoneResponsable
    ? validatePhone(formData.telephoneResponsable)
    : true;
  const isNifValid = formData.nif ? validateNif(formData.nif) : true;
  const isCinResponsableValid = formData.cinResponsable
    ? validateCin(formData.cinResponsable)
    : true;
  const isStatValid = formData.stat ? validateStat(formData.stat) : true;

  const isTelephoneParticulierValid = formData.telephoneParticulier
    ? validatePhone(formData.telephoneParticulier)
    : true;
  const isCinParticulierValid = formData.cinParticulier
    ? validateCin(formData.cinParticulier)
    : true;

  // Calcul global des erreurs
  let hasErrors = false;
  if (isEntreprise) {
    hasErrors =
      !isEmailContactValid ||
      !isContactExploitationValid ||
      !isTelephoneResponsableValid ||
      !isNifValid ||
      !isCinResponsableValid ||
      !isStatValid ||
      !formData.nomEntite ||
      !formData.localisationEntite ||
      !formData.nomResponsable;
  } else {
    hasErrors =
      !isTelephoneParticulierValid ||
      !isCinParticulierValid ||
      !formData.nomParticulier ||
      !formData.localisationParticulier;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors) return;

    const dataToSubmit = isEntreprise
      ? {
          type: "entreprise",
          structure: {
            nom_entite: formData.nomEntite,
            localisation: formData.localisationEntite,
            contact_exploitation: formData.contactExploitation.replace(
              /\s/g,
              "",
            ),
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
      {/* Stepper positionné sur l'étape 2 */}
      <Stepper steps={registerSteps} currentStep={2} />

      <div className="bg-white rounded-[16px] sm:rounded-[20px] shadow-sm border border-separator/10 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        {/* Titre dynamique centré */}
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
          {/* --- VUE ENTREPRISE --- */}
          {isEntreprise && (
            <div className="space-y-5 sm:space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <h3 className="text-[9px] sm:text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">
                  Structure de production
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Nom Entité */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      Nom de l'entité <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Building2
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="Ex: Ferme du Sud"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        value={formData.nomEntite}
                        onChange={(e) =>
                          handleInputChange("nomEntite", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Localisation Entité */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      Localisation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <MapPin
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="Commune, Région"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        value={formData.localisationEntite}
                        onChange={(e) =>
                          handleInputChange(
                            "localisationEntite",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Exploitation */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      Contact exploitation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="034 xx xxx xx"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        aria-invalid={!isContactExploitationValid}
                        maxLength={13}
                        value={formData.contactExploitation}
                        onChange={(e) =>
                          handleInputChange(
                            "contactExploitation",
                            formatPhone(e.target.value),
                          )
                        }
                        required
                      />
                    </div>
                    {!isContactExploitationValid && (
                      <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={10} /> Requis : 10 chiffres.
                      </p>
                    )}
                  </div>

                  {/* Email Contact */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      E-mail contact <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="email"
                        placeholder="ferme@exemple.mg"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        aria-invalid={!isEmailContactValid}
                        value={formData.emailContact}
                        onChange={(e) =>
                          handleInputChange("emailContact", e.target.value)
                        }
                        required
                      />
                    </div>
                    {!isEmailContactValid && (
                      <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={10} /> E-mail invalide.
                      </p>
                    )}
                  </div>

                  {/* NIF */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      NIF <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <FileText
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="10 chiffres"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        aria-invalid={!isNifValid}
                        maxLength={10}
                        value={formData.nif}
                        onChange={(e) =>
                          handleInputChange("nif", e.target.value)
                        }
                        required
                      />
                    </div>
                    {!isNifValid && (
                      <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={10} /> Requis : 10 chiffres.
                      </p>
                    )}
                  </div>

                  {/* STAT */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      STAT <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <FileText
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="Stats ID"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        aria-invalid={!isStatValid}
                        value={formData.stat}
                        onChange={(e) =>
                          handleInputChange("stat", e.target.value)
                        }
                        required
                      />
                    </div>
                    {!isStatValid && (
                      <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={10} /> Identifiant trop court (min. 5).
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION RESPONSABLE ENTREPRISE */}
              <div className="space-y-3">
                <h3 className="text-[9px] sm:text-[10px] font-bold text-label uppercase tracking-widest border-b border-separator/10 pb-1">
                  Responsable
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Nom complet responsable */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="Gérant"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        value={formData.nomResponsable}
                        onChange={(e) =>
                          handleInputChange("nomResponsable", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Téléphone direct responsable */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      Téléphone direct <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="03x xx xxx xx"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        aria-invalid={!isTelephoneResponsableValid}
                        maxLength={13}
                        value={formData.telephoneResponsable}
                        onChange={(e) =>
                          handleInputChange(
                            "telephoneResponsable",
                            formatPhone(e.target.value),
                          )
                        }
                        required
                      />
                    </div>
                    {!isTelephoneResponsableValid && (
                      <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={10} /> Requis : 10 chiffres.
                      </p>
                    )}
                  </div>

                  {/* CIN responsable */}
                  <div className="flex flex-col">
                    <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                      Numéro CIN <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <CreditCard
                        className="absolute left-3 text-input-element/60 pointer-events-none"
                        size={16}
                      />
                      <Input
                        type="text"
                        placeholder="101 000 000 000"
                        className="pl-9 h-10 sm:h-11 text-sm"
                        aria-invalid={!isCinResponsableValid}
                        maxLength={15}
                        value={formData.cinResponsable}
                        onChange={(e) =>
                          handleInputChange(
                            "cinResponsable",
                            formatCin(e.target.value),
                          )
                        }
                        required
                      />
                    </div>
                    {!isCinResponsableValid && (
                      <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                        <AlertTriangle size={10} /> Requis : 12 chiffres.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VUE PARTICULIER --- */}
          {!isEntreprise && (
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              {/* Nom complet particulier */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Nom et prénom(s) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Votre nom complet"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    value={formData.nomParticulier}
                    onChange={(e) =>
                      handleInputChange("nomParticulier", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Téléphone particulier */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone
                      className="absolute left-3 text-input-element/60 pointer-events-none"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="03x xx xxx xx"
                      className="pl-9 h-10 sm:h-11 text-sm"
                      aria-invalid={!isTelephoneParticulierValid}
                      maxLength={13}
                      value={formData.telephoneParticulier}
                      onChange={(e) =>
                        handleInputChange(
                          "telephoneParticulier",
                          formatPhone(e.target.value),
                        )
                      }
                      required
                    />
                  </div>
                  {!isTelephoneParticulierValid && (
                    <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                      <AlertTriangle size={10} /> Requis : 10 chiffres.
                    </p>
                  )}
                </div>

                {/* CIN particulier */}
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                    Numéro CIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <CreditCard
                      className="absolute left-3 text-input-element/60 pointer-events-none"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="101 000 000 000"
                      className="pl-9 h-10 sm:h-11 text-sm"
                      aria-invalid={!isCinParticulierValid}
                      maxLength={15}
                      value={formData.cinParticulier}
                      onChange={(e) =>
                        handleInputChange(
                          "cinParticulier",
                          formatCin(e.target.value),
                        )
                      }
                      required
                    />
                  </div>
                  {!isCinParticulierValid && (
                    <p className="text-red-500 text-[8px] sm:text-[9px] font-semibold mt-1 ml-1 flex items-center gap-1 animate-in fade-in">
                      <AlertTriangle size={10} /> Requis : 12 chiffres.
                    </p>
                  )}
                </div>
              </div>

              {/* Localisation particulier */}
              <div className="flex flex-col">
                <label className="text-[10px] sm:text-[11px] font-bold text-label ml-1 mb-1.5">
                  Adresse postale / Localisation <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin
                    className="absolute left-3 text-input-element/60 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Ville, Quartier, Lot"
                    className="pl-9 h-10 sm:h-11 text-sm"
                    value={formData.localisationParticulier}
                    onChange={(e) =>
                      handleInputChange(
                        "localisationParticulier",
                        e.target.value,
                      )
                    }
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION PRODUCTION - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3 sm:p-4 rounded-xl border border-separator/10">
            <div className="flex items-center justify-center sm:justify-start space-x-2 ml-0 sm:ml-2 select-none">
              <Tractor size={14} />
              <span className="text-[9px] sm:text-[10px] font-bold text-label uppercase">
                Type de production :
              </span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-6">
              {["Végétale", "Elevage", "Rente"].map((item) => (
                <div key={item} className="flex items-center space-x-2 group">
                  <Checkbox
                    id={`prod-${item}`}
                    checked={selectedProductions.includes(item)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`prod-${item}`}
                    className="text-[11px] sm:text-xs font-bold text-neutral-700 cursor-pointer group-hover:text-primary transition-colors select-none"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* NAVIGATION - Responsive */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-separator/10">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-xl border border-separator/30 text-sm font-bold text-label hover:bg-neutral-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Précédent</span>
            </button>
            <button
              type="submit"
              disabled={hasErrors}
              className="btn-primary w-full sm:w-auto px-6 sm:px-10 py-2.5 text-xs sm:text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Suivant</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}