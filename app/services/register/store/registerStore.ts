// store/registerStore.ts
import { create } from 'zustand';

export type RoleType = 'fournisseur' | 'collecteur';
export type ProductionType = 'Végétale' | 'Elevage' | 'Rente';
export type FournisseurType = 'particulier' | 'entreprise';

export interface RegisterStoreData {
  // --- Étape 1 : AuthForm ---
  email?: string;
  password?: string;
  code?: string;

  // --- Étape 2 : Choix du Rôle & Formulaires ---
  role?: RoleType;
  type?: FournisseurType;

  // Collecteur (CollectorForm)
  raisonSociale?: string;
  siegeSocial?: string;
  telephonePro?: string;
  emailPro?: string;
  nif?: string;
  stat?: string;
  nomComplet?: string;
  telephoneDirect?: string;
  cin?: string;
  besoins?: string[];
  description?: string;

  // Fournisseur - Entreprise
  nomEntite?: string;
  localisationEntite?: string;
  contactExploitation?: string;
  emailContact?: string;
  nomResponsable?: string;
  telephoneResponsable?: string;
  cinResponsable?: string;

  // Fournisseur - Particulier
  nom?: string;                    // ← AJOUTER (last_name)
  prenom?: string;                 // ← AJOUTER (first_name)
  telephoneParticulier?: string;
  cinParticulier?: string;
  localisationParticulier?: string;

  productions?: string[];

  // --- Étape 3 : Finition ---
  bio?: string;
  photo?: File | string | null;
}

interface RegisterState {
  registerDraft: RegisterStoreData;
  setRegisterDraft: (fields: Partial<RegisterStoreData>) => void;
  resetRegisterDraft: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  registerDraft: {},
  setRegisterDraft: (fields) => set((state) => ({
    registerDraft: { ...state.registerDraft, ...fields }
  })),
  resetRegisterDraft: () => set({ registerDraft: {} })
}));

export const PRODUCTION_TYPES: ProductionType[] = ["Végétale", "Elevage", "Rente"];