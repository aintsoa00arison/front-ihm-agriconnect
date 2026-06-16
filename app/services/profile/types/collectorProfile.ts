// types/collectorProfile.ts
export interface CompanyData {
  name: string;
  address: string;
  email: string;
  phone: string;
  nif: string;
  stat: string;
}

export interface RepresentativeData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  cin: string;
}

export type ProductionType = "Végétale" | "Élevage" | "Rente";
export type ProductionKey = "vegetale" | "elevage" | "Rente";

export interface ProductionTypesState {
  vegetale: boolean;
  elevage: boolean;
  Rente: boolean;
}

export interface CollectorProfileFormData {
  company: CompanyData;
  productionTypes: ProductionType[];
  representative: RepresentativeData;
}

export const PRODUCTION_MAPPING: Record<ProductionKey, ProductionType> = {
  vegetale: "Végétale",
  elevage: "Élevage",
  Rente: "Rente",
};

export const PRODUCTION_KEYS: ProductionKey[] = ["vegetale", "elevage", "Rente"];