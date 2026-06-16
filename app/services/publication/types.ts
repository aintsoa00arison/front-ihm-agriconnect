// app/services/publication/types.ts

// 🔥 Types backend (ce que le serveur attend)
export type ProductionTypeBackend = 'ANIMAL' | 'VEGETAL' | 'CEREAL';

// 🔥 Types d'affichage (ce que l'utilisateur voit)
export type ProductionTypeDisplay = 'Végétale' | 'Élevage' | 'Rente';

// 🔥 Mapping entre affichage et backend
export const PRODUCTION_TYPE_MAPPING: Record<ProductionTypeDisplay, ProductionTypeBackend> = {
  'Végétale': 'VEGETAL',
  'Élevage': 'ANIMAL',
  'Rente': 'CEREAL'
};

export const PRODUCTION_TYPE_REVERSE_MAPPING: Record<ProductionTypeBackend, ProductionTypeDisplay> = {
  'VEGETAL': 'Végétale',
  'ANIMAL': 'Élevage',
  'CEREAL': 'Rente'
};

// 🔥 Pour le composant Select
export const PRODUCTION_TYPE_OPTIONS: { label: ProductionTypeDisplay; value: ProductionTypeBackend }[] = [
  { label: 'Végétale', value: 'VEGETAL' },
  { label: 'Élevage', value: 'ANIMAL' },
  { label: 'Rente', value: 'CEREAL' },
];

// 🔥 Pour le formulaire, on utilise la valeur backend
export type ProductionType = ProductionTypeBackend;
// services/publication/types.ts

export interface Publication {
  id: string;
  sender_id: string;
  sender?: string; // Nom du sender
  titre: string;
  description: string;
  category: ProductionTypeBackend;
  localisation: string;
  quantity: string | null;
  photo: string | null;
  price?: number | null;
  createdAt?: string;
  
  sender_type?: 'fournisseur' | 'collecteur';
}

// services/publication/types.ts

export interface CreatePublicationData {
  sender_id: string;
  titre: string;
  description: string;
  category: ProductionTypeBackend;
  localisation: string;
  quantity?: string;
  prix?: string | number; // 🔥 Ajouter prix (string ou number)
  photo?: File | null;
}

export interface UpdatePublicationData {
  titre?: string;
  description?: string;
  category?: ProductionTypeBackend;
  localisation?: string;
  quantity?: string;
  price?: number; // 🔥 NOUVEAU: Prix en nombre
  photo?: File | null;
}

export interface PublicationParams {
  titre_or_description?: string;
  category?: string[] | string; // 🔥 Accepter soit un tableau soit une chaîne

  price_min?: number; // 🔥 NOUVEAU: Filtre prix min
  price_max?: number; // 🔥 NOUVEAU: Filtre prix max
}

// 🔥 Utilitaires de conversion
export const convertToBackend = (displayValue: ProductionTypeDisplay): ProductionTypeBackend => {
  return PRODUCTION_TYPE_MAPPING[displayValue] || 'VEGETAL';
};

export const convertToDisplay = (backendValue: ProductionTypeBackend): ProductionTypeDisplay => {
  return PRODUCTION_TYPE_REVERSE_MAPPING[backendValue] || 'Végétale';
};

// 🔥 Fonction utilitaire pour formater le prix
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined || price === 0) return 'Gratuit';
  return `${price.toLocaleString()} Ar`;
};