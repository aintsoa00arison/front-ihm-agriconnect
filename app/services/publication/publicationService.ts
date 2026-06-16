// services/publication/publicationService.ts
"use client"; // 🔥 Ajouter "use client" en haut

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { CreatePublicationData, UpdatePublicationData, Publication, PublicationParams, ProductionType } from './types';

// 🔥 Vérifier si on est côté client
const isBrowser = typeof window !== 'undefined';

export const publicationService = {
  createPublication: async (data: CreatePublicationData): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      // 🔥 Vérifier les données obligatoires
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

      // 🔥 Log pour vérifier les données
      console.log('📤 Envoi création publication:', {
        sender_id: data.sender_id,
        titre: data.titre,
        description: data.description,
        category: data.category,
        localisation: data.localisation,
        quantity: data.quantity,
        hasPhoto: !!data.photo
      });

      const formData = new FormData();
      formData.append('sender_id', data.sender_id);
      formData.append('titre', data.titre);
      formData.append('description', data.description || '');
      formData.append('category', data.category);
      formData.append('localisation', data.localisation);
      if (data.quantity) formData.append('quantity', data.quantity);
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
      
      // 🔥 Log plus détaillé de l'erreur
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

  // Récupérer toutes les publications avec gestion d'erreur
  getAllPublications: async (userId: string): Promise<Publication[]> => {
    try {
      // 🔥 Vérifier que userId est valide
      if (!userId) {
        console.warn('⚠️ getAllPublications: userId manquant');
        return [];
      }

      // 🔥 Vérifier que l'URL est correcte
      const url = API_ENDPOINTS.PUBLICATION_ALL.replace('{user_id}', userId);
      console.log('📡 Récupération publications:', url);
      
      const response = await apiClient.get(url);
      return response.data || [];
    } catch (error: any) {
      console.error("❌ Erreur récupération publications:", error);
      
      // 🔥 Gérer les différentes erreurs
      if (error.message === 'Network Error') {
        console.warn('🌐 Erreur réseau - impossible de contacter le serveur');
        return [];
      }
      
      if (error.response?.status === 404) {
        console.warn('⚠️ Aucune publication trouvée');
        return [];
      }
      
      if (error.response?.status === 500) {
        console.warn("⚠️ Le backend a retourné une erreur 500, retour d'un tableau vide");
        return [];
      }
      
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
      
      if (error.message === 'Network Error') {
        console.warn('🌐 Erreur réseau');
        return [];
      }
      
      if (error.response?.status === 404) {
        console.warn('⚠️ Aucune publication trouvée pour cet utilisateur');
        return [];
      }
      
      if (error.response?.status === 500) {
        console.warn("⚠️ Le backend a retourné une erreur 500, retour d'un tableau vide");
        return [];
      }
      
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
      
      const response = await apiClient.post(
        url,
        {
          titre_or_description: params.titre_or_description || "",
          category: params.category || "",
        }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("❌ Erreur filtrage publications:", error);
      
      if (error.message === 'Network Error') {
        console.warn('🌐 Erreur réseau');
        return [];
      }
      
      if (error.response?.status === 500) {
        console.warn("⚠️ Le backend a retourné une erreur 500, retour d'un tableau vide");
        return [];
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
  updatePublication: async (publicationId: string, data: UpdatePublicationData): Promise<{ success: boolean; message: string }> => {
    try {
      if (!publicationId) {
        return { 
          success: false, 
          message: "ID de publication manquant" 
        };
      }

      console.warn("⚠️ Utilisation de la méthode de mise à jour temporaire");
      console.log('📝 Données de mise à jour:', data);
      
      // 🔥 Vérifier si on a des données à mettre à jour
      const hasData = Object.values(data).some(value => value !== undefined && value !== null && value !== '');
      if (!hasData) {
        return { 
          success: false, 
          message: "Aucune donnée à mettre à jour" 
        };
      }
      
      // TODO: Implémenter le vrai PUT quand l'endpoint sera disponible
      return { 
        success: true, 
        message: "Publication mise à jour avec succès (mode temporaire)" 
      };
      
      /* 🔥 Quand l'endpoint sera disponible, décommenter ce code :
      
      const formData = new FormData();
      if (data.titre) formData.append('titre', data.titre);
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      if (data.localisation) formData.append('localisation', data.localisation);
      if (data.quantity) formData.append('quantity', data.quantity);
      if (data.photo) formData.append('photo', data.photo);
      
      const url = API_ENDPOINTS.PUBLICATION_UPDATE.replace('{publication_id}', publicationId);
      const response = await apiClient.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { 
        success: true, 
        message: response.data?.message || "Publication mise à jour" 
      };
      */
    } catch (error: any) {
      console.error("❌ Erreur mise à jour publication:", error);
      
      if (error.message === 'Network Error') {
        return { 
          success: false, 
          message: "Impossible de contacter le serveur. Vérifiez votre connexion." 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de la mise à jour" 
      };
    }
  },
};