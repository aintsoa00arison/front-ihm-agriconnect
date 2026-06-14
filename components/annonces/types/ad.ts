// types/ad.ts
export type AdFormMode = "annonce" | "demande";
export type ProductionType = "Végétale" | "Élevage" | "Rente";
export type QuantityUnit = "tonnes" | "Sacs" | "Kg" | "Unités";

export interface AdData {
  id?: string;
  productionType: ProductionType;
  productName: string;
  quantityValue?: string;
  quantityUnit?: QuantityUnit;
  quantity?: string;
  location: string;
  description: string;
  mediaUrl?: string;
}

export interface AdFormProps {
  mode: AdFormMode;
  initialData?: AdData;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export type ToastType = "success" | "error";