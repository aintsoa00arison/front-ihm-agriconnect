// types/supplierProfile.ts

export type FournisseurType = 'particulier' | 'entreprise';
export type ProductionKey = "vegetale" | "elevage" | "Rente";
export type ProductionType = "Végétale" | "Élevage" | "Rente";

// Données de l'entreprise (pour les fournisseurs de type entreprise)
export interface CompanyData {
  name: string;      // Raison sociale / Nom de l'entité
  address: string;   // Siège social / Localisation
  email: string;     // Email de contact
  phone: string;     // Téléphone de l'entreprise
  nif: string;       // NIF (10 chiffres)
  stat: string;      // STAT (minimum 5 caractères)
}

// Données du représentant légal (pour les fournisseurs de type entreprise)
export interface RepresentativeData {
  lastName: string;   // Nom
  firstName: string;  // Prénom
  email: string;      // Email professionnel
  phone: string;      // Téléphone direct
  cin: string;        // Numéro CIN (12 chiffres)
}

// Données personnelles (pour les fournisseurs de type particulier)
export interface PersonalData {
  lastName: string;    // Nom
  firstName: string;   // Prénom
  birthDate: string;   // Date de naissance
  birthPlace: string;  // Lieu de naissance
  phone: string;       // Téléphone
  email: string;       // Email
  address: string;     // Adresse physique
  cin: string;         // Numéro CIN (12 chiffres)
}

// État des types de production sélectionnés
export interface ProductionTypesState {
  vegetale: boolean;
  elevage: boolean;
  Rente: boolean;
}

// Données complètes du formulaire de profil fournisseur
export interface SupplierProfileFormData {
  type: FournisseurType;
  bio: string;
  avatarUrl: string;
  productionTypes: ProductionType[];
  company?: CompanyData;           // Présent si type === "entreprise"
  representative?: RepresentativeData; // Présent si type === "entreprise"
  personal?: PersonalData;         // Présent si type === "particulier"
}

// Mapping entre les clés internes et les valeurs d'affichage
export const PRODUCTION_MAPPING: Record<ProductionKey, ProductionType> = {
  vegetale: "Végétale",
  elevage: "Élevage",
  Rente: "Rente",
};

// Liste des clés de production
export const PRODUCTION_KEYS: ProductionKey[] = ["vegetale", "elevage", "Rente"];

// Noms d'affichage des types de production
export const PRODUCTION_LABELS: Record<ProductionKey, string> = {
  vegetale: "Végétale",
  elevage: "Élevage",
  Rente: "Rente",
};

// Validation des champs requis pour chaque type de profil
export const REQUIRED_FIELDS = {
  entreprise: [
    "company.name",
    "company.address",
    "company.email",
    "company.phone",
    "company.nif",
    "representative.lastName",
    "representative.firstName",
    "representative.email",
    "representative.phone",
    "representative.cin",
  ],
  particulier: [
    "personal.lastName",
    "personal.firstName",
    "personal.phone",
    "personal.email",
    "personal.cin",
  ],
} as const;

// Valeurs par défaut pour un nouveau profil fournisseur
export const getDefaultSupplierProfile = (type: FournisseurType): SupplierProfileFormData => {
  const base = {
    type,
    bio: "",
    avatarUrl: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=defaultSupplier",
    productionTypes: [] as ProductionType[],
  };

  if (type === "entreprise") {
    return {
      ...base,
      company: {
        name: "",
        address: "",
        email: "",
        phone: "",
        nif: "",
        stat: "",
      },
      representative: {
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        cin: "",
      },
    };
  }

  return {
    ...base,
    personal: {
      lastName: "",
      firstName: "",
      birthDate: "",
      birthPlace: "",
      phone: "",
      email: "",
      address: "",
      cin: "",
    },
  };
};