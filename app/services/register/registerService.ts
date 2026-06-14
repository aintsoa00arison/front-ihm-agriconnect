// services/register/registerService.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { RegisterStoreData } from './store/registerStore';
import { CollectorDataToSubmit } from './types/collector';
import { FournisseurDataToSubmit } from './types/fournisseur';

export const registerService = {
  // Inscription collecteur
  registerCollector: async (data: CollectorDataToSubmit, email: string, password: string, code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const payload = {
        email,
        password,
        code,
        entreprise: data.entreprise,
        representant_legal: data.representant_legal,
        besoins: data.besoins,
      };
      
      await apiClient.post(API_ENDPOINTS.REGISTER_COLLECTOR, payload);
      return { success: true, message: "Compte collecteur créé avec succès !" };
    } catch (error: any) {
      console.error("Erreur inscription collecteur:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de l'inscription." 
      };
    }
  },

  // Inscription fournisseur particulier
  registerIndividualProvider: async (
    data: FournisseurDataToSubmit, 
    email: string, 
    password: string, 
    code: string,
    bio?: string,
    photo?: File | string | null
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const payload: any = {
        email,
        password,
        code,
        profil: data.profil,
        productions: data.productions,
      };
      
      if (bio) payload.bio = bio;
      if (photo) payload.photo = photo;
      
      await apiClient.post(API_ENDPOINTS.REGISTER_INDIVIDUAL_PROVIDER, payload);
      return { success: true, message: "Compte fournisseur créé avec succès !" };
    } catch (error: any) {
      console.error("Erreur inscription fournisseur particulier:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de l'inscription." 
      };
    }
  },

  // Inscription fournisseur entreprise
  registerEntrepriseProvider: async (
    data: FournisseurDataToSubmit, 
    email: string, 
    password: string, 
    code: string,
    bio?: string,
    photo?: File | string | null
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const payload: any = {
        email,
        password,
        code,
        structure: data.structure,
        responsable: data.responsable,
        productions: data.productions,
      };
      
      if (bio) payload.bio = bio;
      if (photo) payload.photo = photo;
      
      await apiClient.post(API_ENDPOINTS.REGISTER_ENTREPRISE_PROVIDER, payload);
      return { success: true, message: "Compte fournisseur créé avec succès !" };
    } catch (error: any) {
      console.error("Erreur inscription fournisseur entreprise:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de l'inscription." 
      };
    }
  },

  // Préparer les données à partir du store
  prepareCollectorData: (storeData: RegisterStoreData): CollectorDataToSubmit | null => {
    if (!storeData.raisonSociale || !storeData.siegeSocial || !storeData.nomComplet) {
      return null;
    }
    
    return {
      entreprise: {
        raison_sociale: storeData.raisonSociale,
        siege_social: storeData.siegeSocial,
        telephone_pro: storeData.telephonePro || "",
        email_pro: storeData.emailPro || "",
        nif: storeData.nif || "",
        stat: storeData.stat || "",
      },
      representant_legal: {
        nom_complet: storeData.nomComplet,
        telephone_direct: storeData.telephoneDirect || "",
        cin: storeData.cin || "",
      },
      besoins: storeData.besoins || [],
    };
  },

  prepareFournisseurData: (storeData: RegisterStoreData): FournisseurDataToSubmit | null => {
    if (storeData.type === "entreprise") {
      if (!storeData.nomEntite || !storeData.localisationEntite || !storeData.nomResponsable) {
        return null;
      }
      return {
        type: "entreprise",
        structure: {
          nom_entite: storeData.nomEntite,
          localisation: storeData.localisationEntite,
          contact_exploitation: storeData.contactExploitation || "",
          email_contact: storeData.emailContact || "",
          nif: storeData.nif || "",
          stat: storeData.stat || "",
        },
        responsable: {
          nom_complet: storeData.nomResponsable,
          telephone_direct: storeData.telephoneResponsable || "",
          cin: storeData.cinResponsable || "",
        },
        productions: (storeData.productions as any) || [],
      };
    } else {
      if (!storeData.nomParticulier || !storeData.localisationParticulier) {
        return null;
      }
      return {
        type: "particulier",
        profil: {
          nom_complet: storeData.nomParticulier,
          telephone: storeData.telephoneParticulier || "",
          cin: storeData.cinParticulier || "",
          localisation: storeData.localisationParticulier,
        },
        productions: (storeData.productions as any) || [],
      };
    }
  },
};