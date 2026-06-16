// app/services/publication/ad.ts

// 🔥 Importer les types depuis types.ts
import { 
  ProductionTypeBackend, 
  ProductionTypeDisplay, 
  ProductionType,
  convertToBackend,
  convertToDisplay
} from './types';

// 🔥 Ré-exporter pour compatibilité
export type { ProductionType, ProductionTypeBackend, ProductionTypeDisplay };
export { convertToBackend, convertToDisplay };

// 🔥 Types spécifiques au formulaire
export type AdFormMode = "annonce" | "demande";
export type QuantityUnit = "tonnes" | "Sacs" | "Kg" | "Unités";

export interface AdData {
  id?: string;
  productionType: ProductionType; // Valeur backend
  productionTypeDisplay?: ProductionTypeDisplay; // Pour l'affichage
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