// services/register/types/payloads.ts
export interface CollectorPayload {
  email: string;
  phone: number[];
  password: string;
  product_category: string[];
  legal_name: string;
  registered_office: string;
  nif: string;
  stat: string;
  rep_last_name: string;
  rep_first_name: string;
  rep_cin_number: string;
  company_description: string;
}

export interface IndividualProviderPayload {
  email: string;
  phone: number[];
  password: string;
  product_category: string[];
  last_name: string;
  first_name: string;
  cin_number: string;
  address: string;
  description: string;
}

export interface EntrepriseProviderPayload {
  email: string;
  phone: number[];
  password: string;
  product_category: string[];
  legal_name: string;
  registered_office: string;
  nif: string;
  stat: string;
  rep_last_name: string;
  rep_first_name: string;
  rep_cin_number: string;
  company_description: string;
}