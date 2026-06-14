// types/fournisseur.ts
export type UserType = "particulier" | "entreprise";
export type ProductionType = "Végétale" | "Elevage" | "Rente";

export interface FournisseurFormData {
  // Entreprise
  nomEntite: string;
  localisationEntite: string;
  contactExploitation: string;
  emailContact: string;
  nif: string;
  stat: string;
  nomResponsable: string;
  telephoneResponsable: string;
  cinResponsable: string;
  // Particulier
  nomParticulier: string;
  telephoneParticulier: string;
  cinParticulier: string;
  localisationParticulier: string;
}

export interface FournisseurDataToSubmit {
  type: UserType;
  structure?: {
    nom_entite: string;
    localisation: string;
    contact_exploitation: string;
    email_contact: string;
    nif: string;
    stat: string;
  };
  responsable?: {
    nom_complet: string;
    telephone_direct: string;
    cin: string;
  };
  profil?: {
    nom_complet: string;
    telephone: string;
    cin: string;
    localisation: string;
  };
  productions: ProductionType[];
}

export const PRODUCTION_TYPES: ProductionType[] = ["Végétale", "Elevage", "Rente"];