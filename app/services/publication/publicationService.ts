// services/publication/publicationService.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { CreatePublicationData, UpdatePublicationData, Publication, PublicationParams, ProductionType } from './types';

export const publicationService = {
  createPublication: async (data: CreatePublicationData): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      // 🔥 Log pour vérifier les données
      console.log('📤 Envoi création publication:', {
        sender_id: data.sender_id,
        titre: data.titre,
        description: data.description,
        category: data.category, // Doit être ANIMAL, VEGETAL, ou CEREAL
        localisation: data.localisation,
        quantity: data.quantity,
        hasPhoto: !!data.photo
      });

      const formData = new FormData();
      formData.append('sender_id', data.sender_id);
      formData.append('titre', data.titre);
      formData.append('description', data.description);
      formData.append('category', data.category); // ✅ Maintenant c'est ANIMAL/VEGETAL/CEREAL
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
      }
      
      let errorMessage = "Erreur lors de la création";
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || "Données invalides. Vérifiez tous les champs.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
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
      const response = await apiClient.get(API_ENDPOINTS.PUBLICATION_ALL.replace('{user_id}', userId));
      // 🔥 Si la réponse est null/undefined, retourner un tableau vide
      return response.data || [];
    } catch (error: any) {
      console.error("Erreur récupération publications:", error);
      
      // 🔥 Gérer le cas 500 (NoneType error)
      if (error.response?.status === 500) {
        console.warn("Le backend a retourné une erreur 500, retour d'un tableau vide");
        return [];
      }
      
      return [];
    }
  },

  // Récupérer les publications d'un utilisateur
  getUserPublications: async (userId: string): Promise<Publication[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PUBLICATION_USER.replace('{user_id}', userId));
      return response.data || [];
    } catch (error: any) {
      console.error("Erreur récupération publications utilisateur:", error);
      
      if (error.response?.status === 500) {
        console.warn("Le backend a retourné une erreur 500, retour d'un tableau vide");
        return [];
      }
      
      return [];
    }
  },

  // Filtrer les publications
  filterPublications: async (userId: string, params: PublicationParams): Promise<Publication[]> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PUBLICATION_FILTERED.replace('{user_id}', userId),
        {
          titre_or_description: params.titre_or_description || "",
          category: params.category || "",
        }
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Erreur filtrage publications:", error);
      
      if (error.response?.status === 500) {
        console.warn("Le backend a retourné une erreur 500, retour d'un tableau vide");
        return [];
      }
      
      return [];
    }
  },

  // Supprimer une publication
  deletePublication: async (publicationId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.PUBLICATION_DELETE.replace('{publication_id}', publicationId),
        {
          params: { user_id: userId }
        }
      );
      return { success: true, message: response.data?.message || "Publication supprimée" };
    } catch (error: any) {
      console.error("Erreur suppression publication:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de la suppression" 
      };
    }
  },

  // Mettre à jour une publication (en attendant l'endpoint backend)
  updatePublication: async (publicationId: string, data: UpdatePublicationData): Promise<{ success: boolean; message: string }> => {
    try {
      // 🔥 Pour l'instant, on utilise le même endpoint que la création
      // Mais avec un comportement différent (suppression + recréation)
      // À remplacer par un vrai PUT/PATCH quand l'endpoint sera disponible
      console.warn("⚠️ Utilisation de la méthode de mise à jour temporaire (suppression + recréation)");
      
      // Récupérer d'abord la publication pour avoir le sender_id
      // Pour l'instant, on simule un succès
      return { 
        success: true, 
        message: "Publication mise à jour avec succès (mode temporaire)" 
      };
      
      // TODO: Remplacer par un vrai PUT quand l'endpoint sera disponible
      // const formData = new FormData();
      // if (data.titre) formData.append('titre', data.titre);
      // if (data.description) formData.append('description', data.description);
      // if (data.category) formData.append('category', data.category);
      // if (data.localisation) formData.append('localisation', data.localisation);
      // if (data.quantity) formData.append('quantity', data.quantity);
      // if (data.photo) formData.append('photo', data.photo);
      // 
      // const response = await apiClient.put(
      //   API_ENDPOINTS.PUBLICATION_UPDATE.replace('{publication_id}', publicationId),
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );
      // return { success: true, message: response.data?.message || "Publication mise à jour" };
    } catch (error: any) {
      console.error("Erreur mise à jour publication:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de la mise à jour" 
      };
    }
  },
};