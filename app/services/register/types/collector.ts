// services/register/types/collector.ts
export interface CollectorFormData {
  raisonSociale: string;
  siegeSocial: string;
  telephonePro: string;
  emailPro: string;
  nif: string;
  stat: string;
  nom: string;
  prenom: string;
  telephoneDirect: string;
  cin: string;
  description?: string;
}

export interface CollectorDataToSubmit {
  entreprise: {
    raison_sociale: string;
    siege_social: string;
    telephone_pro: string;
    email_pro: string;
    nif: string;
    stat: string;
    description: string;
  };
  representant_legal: {
    nom: string;
    prenom: string;
    telephone_direct: string;
    cin: string;
  };
  besoins: string[];
}

export type NeedType = "Végétale" | "Elevage" | "Rente";
export const NEEDS: NeedType[] = ["Végétale", "Elevage", "Rente"];