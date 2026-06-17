// services/publication/publicationService.ts
"use client";

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { CreatePublicationData, UpdatePublicationData, Publication, PublicationParams, ProductionType } from './types';

const isBrowser = typeof window !== 'undefined';

export const publicationService = {
// services/publication/publicationService.ts

createPublication: async (data: CreatePublicationData): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    if (!data.sender_id || !data.titre || !data.category || !data.localisation) {
      console.error('❌ Données manquantes:', { 
        sender_id: !!data.sender_id, 
        titre: !!data.titre,  
        category: !!data.category, 
        localisation: !!data.localisation 
      });
      return {
        success: false,
        message: "Tous les champs obligatoires doivent être remplis"
      };
    }

    console.log('📤 Envoi création publication:', {
      sender_id: data.sender_id,
      titre: data.titre,
      description: data.description,
      category: data.category,
      localisation: data.localisation,
      quantity: data.quantity,
      prix: data.prix, // 🔥 Ajouter le prix dans les logs
      hasPhoto: !!data.photo
    });

    const formData = new FormData();
    formData.append('sender_id', data.sender_id);
    formData.append('titre', data.titre);
    formData.append('description', data.description || '');
    formData.append('category', data.category);
    formData.append('localisation', data.localisation);
    if (data.quantity) formData.append('quantity', data.quantity);
    
    // 🔥 Ajouter le prix si présent
    if (data.prix !== undefined && data.prix !== null && data.prix !== '') {
      formData.append('prix', String(data.prix));
      console.log('💰 Prix ajouté:', data.prix);
    }
    
    if (data.photo) formData.append('photo', data.photo);

    const response = await apiClient.post(API_ENDPOINTS.PUBLICATION_CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Publication créée avec succès:', response.data);
    
    return { 
      success: true, 
      message: response.data?.message || "Publication créée avec succès",
      data: response.data 
    };
  } catch (error: any) {
    console.error("❌ Erreur création publication:", error);
    
    if (error.response) {
      console.error('📦 Réponse serveur:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.message === 'Network Error') {
      console.error('🌐 Erreur réseau - Vérifiez que le serveur est en cours d\'exécution');
    }
    
    let errorMessage = "Erreur lors de la création";
    if (error.response?.status === 400) {
      errorMessage = error.response?.data?.detail || "Données invalides. Vérifiez tous les champs.";
    } else if (error.response?.status === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter.";
    } else if (error.response?.status === 403) {
      errorMessage = "Vous n'avez pas la permission de créer une publication.";
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.message === 'Network Error') {
      errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion.";
    }
    
    return { 
      success: false, 
      message: errorMessage
    };
  }
},

  // 🔥 Récupérer toutes les publications des fournisseurs
  getProviderPublications: async (): Promise<Publication[]> => {
    try {
      console.log('📡 Récupération des publications des fournisseurs');
      const response = await apiClient.get(API_ENDPOINTS.PUBLICATION_PROVIDER_ALL);
      console.log('📦 Réponse brute:', response.data);
      
      if (response.data === null || response.data === undefined) {
        console.warn('⚠️ Réponse null du backend');
        return [];
      }
      
      if (Array.isArray(response.data)) {
        console.log(`📦 ${response.data.length} publications fournisseurs trouvées`);
        return response.data;
      }
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log(`📦 ${response.data.data.length} publications fournisseurs trouvées dans data`);
        return response.data.data;
      }
      
      console.warn('⚠️ Format de réponse inattendu:', response.data);
      return [];
      
    } catch (error: any) {
      console.error("❌ Erreur récupération publications fournisseurs:", error);
      return [];
    }
  },

  // 🔥 Récupérer toutes les publications des collecteurs
  getCollectorPublications: async (): Promise<Publication[]> => {
    try {
      console.log('📡 Récupération des publications des collecteurs');
      const response = await apiClient.get(API_ENDPOINTS.PUBLICATION_COLLECTOR_ALL);
      console.log('📦 Réponse brute:', response.data);
      
      if (response.data === null || response.data === undefined) {
        console.warn('⚠️ Réponse null du backend');
        return [];
      }
      
      if (Array.isArray(response.data)) {
        console.log(`📦 ${response.data.length} publications collecteurs trouvées`);
        return response.data;
      }
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log(`📦 ${response.data.data.length} publications collecteurs trouvées dans data`);
        return response.data.data;
      }
      
      console.warn('⚠️ Format de réponse inattendu:', response.data);
      return [];
      
    } catch (error: any) {
      console.error("❌ Erreur récupération publications collecteurs:", error);
      return [];
    }
  },

  // Récupérer les publications d'un utilisateur
  getUserPublications: async (userId: string): Promise<Publication[]> => {
    try {
      if (!userId) {
        console.warn('⚠️ getUserPublications: userId manquant');
        return [];
      }

      const url = API_ENDPOINTS.PUBLICATION_USER.replace('{user_id}', userId);
      console.log('📡 Récupération publications utilisateur:', url);
      
      const response = await apiClient.get(url);
      return response.data || [];
    } catch (error: any) {
      console.error("❌ Erreur récupération publications utilisateur:", error);
      return [];
    }
  },


// Filtrer les publications
filterPublications: async (userId: string, params: PublicationParams): Promise<Publication[]> => {
  try {
    if (!userId) {
      console.warn('⚠️ filterPublications: userId manquant');
      return [];
    }

    const url = API_ENDPOINTS.PUBLICATION_FILTERED.replace('{user_id}', userId);
    console.log('📡 Filtrage publications:', url, params);
    
    // 🔥 Construire le payload avec category en tableau
    const payload: any = {
      titre_or_description: params.titre_or_description || "",
    };
    
    // 🔥 Si category est un tableau non vide, l'ajouter
    if (params.category && Array.isArray(params.category) && params.category.length > 0) {
      payload.category = params.category;
    }
    // Si category est une chaîne, la convertir en tableau
    else if (params.category && typeof params.category === 'string' && params.category !== '') {
      payload.category = [params.category];
    }
    
    console.log('📤 Payload envoyé:', payload);
    
    const response = await apiClient.post(url, payload);
    return response.data || [];
  } catch (error: any) {
    console.error("❌ Erreur filtrage publications:", error);
    if (error.response) {
      console.error('📦 Réponse erreur:', error.response.data);
    }
    return [];
  }
},
  // Supprimer une publication
  deletePublication: async (publicationId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!publicationId || !userId) {
        return { 
          success: false, 
          message: "ID de publication ou utilisateur manquant" 
        };
      }

      const url = API_ENDPOINTS.PUBLICATION_DELETE.replace('{publication_id}', publicationId);
      console.log('🗑️ Suppression publication:', url);
      
      const response = await apiClient.delete(url, {
        params: { user_id: userId }
      });
      
      return { 
        success: true, 
        message: response.data?.message || "Publication supprimée" 
      };
    } catch (error: any) {
      console.error("❌ Erreur suppression publication:", error);
      
      if (error.message === 'Network Error') {
        return { 
          success: false, 
          message: "Impossible de contacter le serveur. Vérifiez votre connexion." 
        };
      }
      
      if (error.response?.status === 401) {
        return { 
          success: false, 
          message: "Session expirée. Veuillez vous reconnecter." 
        };
      }
      
      if (error.response?.status === 403) {
        return { 
          success: false, 
          message: "Vous n'avez pas la permission de supprimer cette publication." 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de la suppression" 
      };
    }
  },

  // Mettre à jour une publication
// services/publication/publicationService.ts

// 🔥 Mettre à jour une publication
updatePublication: async (publicationId: string, data: UpdatePublicationData): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    if (!publicationId) {
      return { 
        success: false, 
        message: "ID de publication manquant" 
      };
    }

    console.log('📝 Mise à jour publication:', publicationId);
    console.log('📝 Données de mise à jour:', data);

    const formData = new FormData();
    formData.append('user_id', data.sender_id || '');
    if (data.titre) formData.append('titre', data.titre);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.localisation) formData.append('localisation', data.localisation);
    if (data.quantity) formData.append('quantity', data.quantity);
    if (data.prix !== undefined && data.prix !== null) {
      formData.append('prix', String(data.prix));
    }
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const url = API_ENDPOINTS.PUBLICATION_UPDATE.replace('{publication_id}', publicationId);
    const response = await apiClient.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return { 
      success: true, 
      message: response.data?.message || "Publication mise à jour avec succès",
      data: response.data 
    };
  } catch (error: any) {
    console.error("❌ Erreur mise à jour publication:", error);
    
    if (error.response) {
      console.error('📦 Réponse serveur:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    
    let errorMessage = "Erreur lors de la mise à jour";
    if (error.response?.status === 404) {
      errorMessage = "Publication non trouvée";
    } else if (error.response?.status === 403) {
      errorMessage = "Vous n'avez pas la permission de modifier cette publication";
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }
    
    return { 
      success: false, 
      message: errorMessage
    };
  }
},
};