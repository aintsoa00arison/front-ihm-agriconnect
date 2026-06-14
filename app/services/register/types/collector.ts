// types/collector.ts
export interface CollectorFormData {
  raisonSociale: string;
  siegeSocial: string;
  telephonePro: string;
  emailPro: string;
  nif: string;
  stat: string;
  nomComplet: string;
  telephoneDirect: string;
  cin: string;
}

export interface CollectorDataToSubmit {
  entreprise: {
    raison_sociale: string;
    siege_social: string;
    telephone_pro: string;
    email_pro: string;
    nif: string;
    stat: string;
  };
  representant_legal: {
    nom_complet: string;
    telephone_direct: string;
    cin: string;
  };
  besoins: string[];
}

export type NeedType = "Végétale" | "Elevage" | "Rente";
export const NEEDS: NeedType[] = ["Végétale", "Elevage", "Rente"];