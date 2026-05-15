// store/authStore.ts
import { create } from 'zustand';
import { RegisterDraft } from '../types/auth';

interface AuthState {
  // Le brouillon d'inscription stocké temporairement en RAM
  registerDraft: RegisterDraft | null;
  
  // Actions pour modifier le store
  setRegisterDraft: (data: Partial<RegisterDraft>) => void;
  clearDraft: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  registerDraft: null,

  // Permet de fusionner les données étape par étape (Étape 1: email/pass -> Étape 2: code)
  setRegisterDraft: (data) =>
    set((state) => ({
      registerDraft: state.registerDraft 
        ? { ...state.registerDraft, ...data } 
        : { email: '', ...data },
    })),

  // Nettoyage complet de la mémoire vive après inscription ou annulation
  clearDraft: () => set({ registerDraft: null }),
}));