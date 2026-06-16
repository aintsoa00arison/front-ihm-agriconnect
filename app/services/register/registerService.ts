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
      const formData = new FormData();

      formData.append('email', email);
      formData.append('password', password);

      if (data.phone && Array.isArray(data.phone)) {
        data.phone.forEach(p => formData.append('phone', String(p)));
      }

      if (data.product_category && Array.isArray(data.product_category)) {
        data.product_category.forEach(cat => formData.append('product_category', cat));
      }

      if (data.legal_name) formData.append('legal_name', data.legal_name);
      if (data.registered_office) formData.append('registered_office', data.registered_office);
      if (data.nif) formData.append('nif', data.nif);
      if (data.stat) formData.append('stat', data.stat);
      if (data.rep_last_name) formData.append('rep_last_name', data.rep_last_name);
      if (data.rep_first_name) formData.append('rep_first_name', data.rep_first_name);
      if (data.rep_cin_number) formData.append('rep_cin_number', data.rep_cin_number);
      if (data.company_description) formData.append('company_description', data.company_description);

      console.log('🔵 FormData envoyé:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await apiClient.post(API_ENDPOINTS.REGISTER_COLLECTOR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ registerCollector - Succès:", response.status);
      console.log("✅ registerCollector - Réponse data:", response.data);

      const userId = response.data?.data || response.data?.user_id || response.data?.id;
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
    console.log("🔵 photo reçue:", photo ? `File: ${photo instanceof File ? photo.name : typeof photo}` : "absente");
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

      const formData = new FormData();

      formData.append('email', email);
      formData.append('password', password);

      if (data.phone && Array.isArray(data.phone)) {
        data.phone.forEach(p => formData.append('phone', String(p)));
      }

      if (data.product_category && Array.isArray(data.product_category)) {
        data.product_category.forEach(cat => formData.append('product_category', cat));
      }

      if (data.last_name) formData.append('last_name', data.last_name);
      if (data.first_name) formData.append('first_name', data.first_name);
      if (data.cin_number) formData.append('cin_number', data.cin_number);
      if (data.address) formData.append('address', data.address);
      if (bio) formData.append('description', bio);

      // 🔥 Ajouter la photo si présente (doit être un File)
      if (photo && photo instanceof File) {
        console.log("📸 Ajout de la photo au FormData:", photo.name, "type:", photo.type, "size:", photo.size);
        formData.append('photo', photo);
      } else if (photo && typeof photo === 'string') {
        // Si c'est une URL, on ne l'ajoute pas (c'est déjà dans le backend)
        console.log("ℹ️ Photo est une URL, pas de fichier à envoyer:", photo);
      } else {
        console.log("ℹ️ Aucune photo à envoyer");
      }

      console.log('🔵 FormData envoyé:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await apiClient.post(API_ENDPOINTS.REGISTER_INDIVIDUAL_PROVIDER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ registerIndividualProvider - SUCCÈS:", response.status);
      console.log("✅ Réponse data:", response.data);

      const userId = response.data?.data || response.data?.user_id || response.data?.id;
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
    console.log("🔵 photo reçue:", photo ? `File: ${photo instanceof File ? photo.name : typeof photo}` : "absente");

    try {
      const formData = new FormData();

      formData.append('email', email);
      formData.append('password', password);

      if (data.phone && Array.isArray(data.phone)) {
        data.phone.forEach(p => formData.append('phone', String(p)));
      }

      if (data.product_category && Array.isArray(data.product_category)) {
        data.product_category.forEach(cat => formData.append('product_category', cat));
      }

      if (data.legal_name) formData.append('legal_name', data.legal_name);
      if (data.registered_office) formData.append('registered_office', data.registered_office);
      if (data.nif) formData.append('nif', data.nif);
      if (data.stat) formData.append('stat', data.stat);
      if (data.rep_last_name) formData.append('rep_last_name', data.rep_last_name);
      if (data.rep_first_name) formData.append('rep_first_name', data.rep_first_name);
      if (data.rep_cin_number) formData.append('rep_cin_number', data.rep_cin_number);
      if (bio) formData.append('company_description', bio);

      // 🔥 Ajouter la photo si présente (doit être un File)
      if (photo && photo instanceof File) {
        console.log("📸 Ajout de la photo au FormData:", photo.name, "type:", photo.type, "size:", photo.size);
        formData.append('photo', photo);
      } else if (photo && typeof photo === 'string') {
        console.log("ℹ️ Photo est une URL, pas de fichier à envoyer:", photo);
      } else {
        console.log("ℹ️ Aucune photo à envoyer");
      }

      console.log('🔵 FormData envoyé:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await apiClient.post(API_ENDPOINTS.REGISTER_ENTREPRISE_PROVIDER, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ registerEntrepriseProvider - SUCCÈS:", response.status);

      const userId = response.data?.data || response.data?.user_id || response.data?.id;
      return { success: true, message: "Compte fournisseur créé avec succès !", userId };
    } catch (error: any) {
      console.error("🔴 registerEntrepriseProvider - ERREUR:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.detail || "Erreur lors de l'inscription." };
    }
  },

  prepareCollectorData: (storeData: RegisterStoreData): CollectorPayload | null => {
    console.log("🔵 prepareCollectorData - storeData reçu:", JSON.stringify(storeData, null, 2));

    if (!storeData.raisonSociale || !storeData.siegeSocial || !storeData.nom || !storeData.prenom) {
      console.error("🔴 Données collecteur manquantes:", {
        raisonSociale: storeData.raisonSociale,
        siegeSocial: storeData.siegeSocial,
        nom: storeData.nom,
        prenom: storeData.prenom
      });
      return null;
    }

    const rep_last_name = storeData.nom;
    const rep_first_name = storeData.prenom;

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

      let cleanPhone = storeData.telephoneParticulier?.replace(/\s/g, "") || "";
      if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }
      const phoneNumber = parseInt(cleanPhone, 10);
      console.log("🔵 cleanPhone final:", cleanPhone, "→ phoneNumber:", phoneNumber);

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