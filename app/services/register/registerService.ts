// services/register/registerService.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { RegisterStoreData } from './store/registerStore';
import { CollectorPayload, IndividualProviderPayload, EntrepriseProviderPayload } from './types/payloads';

export const registerService = {
  registerCollector: async (
    data: CollectorPayload, 
    email: string, 
    password: string
  ): Promise<{ success: boolean; message: string; userId?: string }> => {
    console.log("🔵 registerCollector - Début");
    console.log("🔵 registerCollector - email:", email);
    console.log("🔵 registerCollector - data reçu:", JSON.stringify(data, null, 2));
    
    try {
      const payload: CollectorPayload = {
        email: email,
        phone: data.phone,
        password: password,
        product_category: data.product_category,
        legal_name: data.legal_name,
        registered_office: data.registered_office,
        nif: data.nif,
        stat: data.stat,
        rep_last_name: data.rep_last_name,
        rep_first_name: data.rep_first_name,
        rep_cin_number: data.rep_cin_number,
        company_description: data.company_description,
      };
      
      console.log("🔵 registerCollector - payload final:", JSON.stringify(payload, null, 2));
      
      const response = await apiClient.post(API_ENDPOINTS.REGISTER_COLLECTOR, payload);
      console.log("✅ registerCollector - Succès:", response.status);
      console.log("✅ registerCollector - Réponse data:", response.data);
      
      const userId = response.data?.id || response.data?.user_id;
      return { success: true, message: "Compte collecteur créé avec succès !", userId };
    } catch (error: any) {
      console.error("🔴 registerCollector - Erreur:", error.response?.data || error.message);
      let errorMessage = "Erreur lors de l'inscription.";
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          errorMessage = detail[0]?.msg || "Erreur de validation";
        } else if (typeof detail === "string") {
          errorMessage = detail;
        }
      }
      return { success: false, message: errorMessage };
    }
  },

  registerIndividualProvider: async (
    data: IndividualProviderPayload,
    email: string,
    password: string,
    bio?: string,
    photo?: File | string | null
  ): Promise<{ success: boolean; message: string; userId?: string }> => {
    console.log("🔵 registerIndividualProvider - === DÉBUT ===");
    console.log("🔵 email reçu:", email);
    console.log("🔵 password reçu:", password ? "***" : "MANQUANT");
    console.log("🔵 bio reçue:", bio);
    console.log("🔵 photo reçue:", photo ? "présente" : "absente");
    console.log("🔵 data reçu:", JSON.stringify(data, null, 2));
    
    try {
      // 🔥 Vérifier et nettoyer le téléphone
      let phoneValue = 0;
      if (Array.isArray(data.phone) && data.phone.length > 0) {
        phoneValue = Number(data.phone[0]);
        if (isNaN(phoneValue)) {
          const phoneStr = String(data.phone[0]).replace(/\D/g, "");
          const cleanPhone = phoneStr.slice(-10);
          phoneValue = parseInt(cleanPhone, 10);
          console.log("🔵 Téléphone converti:", phoneStr, "→", cleanPhone, "→", phoneValue);
        }
      }
      
      const payload: IndividualProviderPayload = {
        email,
        phone: [phoneValue],
        password,
        product_category: data.product_category,
        last_name: data.last_name,
        first_name: data.first_name,
        cin_number: data.cin_number,
        address: data.address,
        description: bio || data.description,
      };
      
      console.log("🔵 payload FINAL - téléphone:", payload.phone);
      console.log("🔵 payload FINAL complet:", JSON.stringify(payload, null, 2));
      
      // Vérifier les champs requis
      const requiredFields = ['email', 'phone', 'password', 'product_category', 'last_name', 'first_name', 'cin_number', 'address'];
      const missingFields = requiredFields.filter(field => !payload[field as keyof IndividualProviderPayload]);
      if (missingFields.length > 0) {
        console.error("🔴 Champs manquants dans le payload:", missingFields);
      }
      
      if (photo) (payload as any).photo = photo;
      
      const response = await apiClient.post(API_ENDPOINTS.REGISTER_INDIVIDUAL_PROVIDER, payload);
      console.log("✅ registerIndividualProvider - SUCCÈS:", response.status);
      console.log("✅ Réponse data:", response.data);
      
      const userId = response.data?.id || response.data?.user_id;
      return { success: true, message: "Compte fournisseur créé avec succès !", userId };
    } catch (error: any) {
      console.error("🔴 registerIndividualProvider - ERREUR:", error.response?.data || error.message);
      console.error("🔴 Status:", error.response?.status);
      console.error("🔴 Response data complet:", error.response?.data);
      return { success: false, message: error.response?.data?.detail || "Erreur lors de l'inscription." };
    }
  },

  registerEntrepriseProvider: async (
    data: EntrepriseProviderPayload,
    email: string,
    password: string,
    bio?: string,
    photo?: File | string | null
  ): Promise<{ success: boolean; message: string; userId?: string }> => {
    console.log("🔵 registerEntrepriseProvider - Début");
    console.log("🔵 email:", email);
    console.log("🔵 data:", JSON.stringify(data, null, 2));
    
    try {
      const payload: EntrepriseProviderPayload = {
        email,
        phone: data.phone,
        password,
        product_category: data.product_category,
        legal_name: data.legal_name,
        registered_office: data.registered_office,
        nif: data.nif,
        stat: data.stat,
        rep_last_name: data.rep_last_name,
        rep_first_name: data.rep_first_name,
        rep_cin_number: data.rep_cin_number,
        company_description: bio || data.company_description,
      };
      
      console.log("🔵 payload FINAL:", JSON.stringify(payload, null, 2));
      
      if (photo) (payload as any).photo = photo;
      
      const response = await apiClient.post(API_ENDPOINTS.REGISTER_ENTREPRISE_PROVIDER, payload);
      console.log("✅ registerEntrepriseProvider - SUCCÈS:", response.status);
      
      const userId = response.data?.id || response.data?.user_id;
      return { success: true, message: "Compte fournisseur créé avec succès !", userId };
    } catch (error: any) {
      console.error("🔴 registerEntrepriseProvider - ERREUR:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.detail || "Erreur lors de l'inscription." };
    }
  },

  prepareCollectorData: (storeData: RegisterStoreData): CollectorPayload | null => {
    console.log("🔵 prepareCollectorData - storeData reçu:", JSON.stringify(storeData, null, 2));
    
    if (!storeData.raisonSociale || !storeData.siegeSocial || !storeData.nomComplet) {
      console.error("🔴 Données collecteur manquantes");
      return null;
    }
    
    const nameParts = storeData.nomComplet.trim().split(" ");
    const rep_last_name = nameParts[0] || "";
    const rep_first_name = nameParts.slice(1).join(" ") || "";
    
    const product_category = (storeData.besoins || []).map(b => {
      const cat = b.toLowerCase();
      if (cat === "végétale") return "VEGETAL";
      if (cat === "elevage") return "ANIMAL";
      return "CEREAL";
    });
    
    const cleanPhone = storeData.telephonePro?.replace(/\s/g, "") || "0340000000";
    const phoneNumber = parseInt(cleanPhone, 10);
    const validStat = "12345678901234567";
    const validNif = storeData.nif?.replace(/\D/g, "") || "1234567890";
    const validCin = storeData.cin?.replace(/\D/g, "") || "101123456789";
    
    const payload = {
      email: storeData.email || "",
      phone: [phoneNumber],
      password: storeData.password || "",
      product_category: product_category,
      legal_name: storeData.raisonSociale,
      registered_office: storeData.siegeSocial,
      nif: validNif.slice(0, 10),
      stat: storeData.stat || validStat,
      rep_last_name: rep_last_name,
      rep_first_name: rep_first_name,
      rep_cin_number: validCin.slice(0, 12),
      company_description: storeData.description || storeData.bio || "Description",
    };
    
    console.log("🔵 prepareCollectorData - payload généré:", JSON.stringify(payload, null, 2));
    return payload;
  },

  prepareFournisseurData: (storeData: RegisterStoreData): IndividualProviderPayload | EntrepriseProviderPayload | null => {
    console.log("🔵 prepareFournisseurData - storeData reçu:", JSON.stringify(storeData, null, 2));
    
    if (storeData.type === "entreprise") {
      console.log("🔵 prepareFournisseurData - Mode ENTREPRISE");
      
      if (!storeData.nomEntite || !storeData.localisationEntite || !storeData.nomResponsable) {
        console.error("🔴 Données entreprise manquantes");
        return null;
      }
      
      const cleanPhone = storeData.contactExploitation?.replace(/\s/g, "") || "0340000000";
      const phoneNumber = parseInt(cleanPhone, 10);
      
      const nameParts = storeData.nomResponsable.trim().split(" ");
      const rep_last_name = nameParts[0] || "";
      const rep_first_name = nameParts.slice(1).join(" ") || "";
      
      const product_category = (storeData.productions || []).map(p => {
        if (p === "Végétale") return "VEGETAL";
        if (p === "Elevage") return "ANIMAL";
        return "CEREAL";
      });
      
      const validStat = "12345678901234567";
      
      const payload: EntrepriseProviderPayload = {
        email: storeData.email || "",
        phone: [phoneNumber],
        password: storeData.password || "",
        product_category: product_category,
        legal_name: storeData.nomEntite,
        registered_office: storeData.localisationEntite,
        nif: storeData.nif || "1234567890",
        stat: storeData.stat || validStat,
        rep_last_name: rep_last_name,
        rep_first_name: rep_first_name,
        rep_cin_number: storeData.cinResponsable?.replace(/\s/g, "") || "101123456789",
        company_description: storeData.bio || "",
      };
      
      console.log("🔵 prepareFournisseurData - payload entreprise généré:", JSON.stringify(payload, null, 2));
      return payload;
      
    } else {
      console.log("🔵 prepareFournisseurData - Mode PARTICULIER");
      
      if (!storeData.nom || !storeData.prenom || !storeData.localisationParticulier) {
        console.error("🔴 Données particulier manquantes:", {
          nom: storeData.nom,
          prenom: storeData.prenom,
          localisationParticulier: storeData.localisationParticulier
        });
        return null;
      }
      
      // 🔥 Gestion du téléphone - prendre les 10 derniers chiffres
      let cleanPhone = storeData.telephoneParticulier?.replace(/\s/g, "") || "";
      if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }
      const phoneNumber = parseInt(cleanPhone, 10);
      console.log("🔵 cleanPhone final:", cleanPhone, "→ phoneNumber:", phoneNumber);
      
      // Vérifier que le numéro est valide (10 chiffres)
      if (isNaN(phoneNumber) || cleanPhone.length !== 10) {
        console.error("🔴 Numéro de téléphone invalide:", cleanPhone);
        return null;
      }
      
      console.log("🔵 nom:", storeData.nom, "prenom:", storeData.prenom);
      
      const product_category = (storeData.productions || []).map(p => {
        if (p === "Végétale") return "VEGETAL";
        if (p === "Elevage") return "ANIMAL";
        return "CEREAL";
      });
      console.log("🔵 productions:", storeData.productions, "→ product_category:", product_category);
      
      const cin_clean = storeData.cinParticulier?.replace(/\s/g, "") || "101123456789";
      console.log("🔵 cin original:", storeData.cinParticulier, "→ nettoyé:", cin_clean);
      
      const payload: IndividualProviderPayload = {
        email: storeData.email || "",
        phone: [phoneNumber],
        password: storeData.password || "",
        product_category: product_category,
        last_name: storeData.nom,
        first_name: storeData.prenom,
        cin_number: cin_clean,
        address: storeData.localisationParticulier,
        description: storeData.bio || "",
      };
      
      console.log("🔵 prepareFournisseurData - payload particulier généré:", JSON.stringify(payload, null, 2));
      return payload;
    }
  },
};