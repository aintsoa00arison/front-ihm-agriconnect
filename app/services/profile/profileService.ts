// services/profile/profileService.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { getUserFromToken, getUserRole, getUserId } from '../lib/auth';
import { 
  ProfileData, 
  UserResponse, 
  transformUserResponse 
} from './types/profile';

export const profileService = {
  getUserById: async (userId: string): Promise<ProfileData | null> => {
    try {
      console.log('🔍 getUserById - userId:', userId);
      
      const url = API_ENDPOINTS.USER_GET.replace('{user_id}', userId);
      console.log('🔍 getUserById - URL:', url);
      
      const response = await apiClient.get<UserResponse>(url);
      
      console.log('📦 getUserById - Réponse brute du backend:', JSON.stringify(response.data, null, 2));
      
      const transformed = transformUserResponse(response.data);
      
      console.log('🔄 getUserById - Données transformées:', JSON.stringify(transformed, null, 2));
      console.log('⭐ getUserById - Rating après transformation:', transformed?.rating);
      
      return transformed;
    } catch (error: any) {
      console.error("❌ Erreur récupération profil:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return null;
    }
  },

  getMyProfile: async (): Promise<ProfileData | null> => {
    console.log('🔍 getMyProfile - Début');
    const userId = getUserId();
    console.log('🔍 getMyProfile - userId:', userId);
    
    if (!userId) {
      console.log('⚠️ getMyProfile - Pas de userId trouvé');
      return null;
    }
    
    const result = await profileService.getUserById(userId);
    console.log('🔍 getMyProfile - Résultat:', result);
    return result;
  },

  // 🔥 Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<ProfileData[]> => {
    try {
      console.log('🔍 getAllUsers - Récupération de tous les utilisateurs');
      
      const response = await apiClient.get<UserResponse[]>(API_ENDPOINTS.USER_ALL);
      console.log('📦 getAllUsers - Réponse brute:', JSON.stringify(response.data, null, 2));
      console.log('📦 getAllUsers - Type de réponse:', typeof response.data);
      console.log('📦 getAllUsers - Est un tableau?', Array.isArray(response.data));
      console.log('📦 getAllUsers - Nombre d\'éléments:', response.data?.length || 0);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('⚠️ getAllUsers - La réponse n\'est pas un tableau');
        return [];
      }
      
      const results = response.data
        .map(user => {
          console.log('🔄 Transformation user:', user);
          const transformed = transformUserResponse(user);
          console.log('🔄 Transformé:', transformed);
          return transformed;
        })
        .filter(Boolean) as ProfileData[];
      
      console.log(`🔄 getAllUsers - ${results.length} utilisateurs récupérés`);
      return results;
    } catch (error: any) {
      console.error("❌ Erreur récupération tous les utilisateurs:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return [];
    }
  },

  // 🔥 NOUVELLE MÉTHODE : Récupérer le Top 5 des fournisseurs
  getTopProviders: async (limit: number = 5): Promise<ProfileData[]> => {
    try {
      console.log('🔍 getTopProviders - Récupération du Top 5 des fournisseurs');
      const response = await apiClient.get<UserResponse[]>(`${API_ENDPOINTS.USER_TOP_PROVIDERS}?limit=${limit}`);
      console.log('📦 getTopProviders - Réponse brute:', JSON.stringify(response.data, null, 2));
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('⚠️ getTopProviders - La réponse n\'est pas un tableau');
        return [];
      }
      
      const results = response.data
        .map(user => transformUserResponse(user))
        .filter(Boolean) as ProfileData[];
      
      console.log(`🔄 getTopProviders - ${results.length} fournisseurs récupérés`);
      return results;
    } catch (error: any) {
      console.error("❌ Erreur récupération Top 5 fournisseurs:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return [];
    }
  },

  // 🔥 NOUVELLE MÉTHODE : Récupérer le Top 5 des collecteurs
  getTopCollectors: async (limit: number = 5): Promise<ProfileData[]> => {
    try {
      console.log('🔍 getTopCollectors - Récupération du Top 5 des collecteurs');
      const response = await apiClient.get<UserResponse[]>(`${API_ENDPOINTS.USER_TOP_COLLECTORS}?limit=${limit}`);
      console.log('📦 getTopCollectors - Réponse brute:', JSON.stringify(response.data, null, 2));
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('⚠️ getTopCollectors - La réponse n\'est pas un tableau');
        return [];
      }
      
      const results = response.data
        .map(user => transformUserResponse(user))
        .filter(Boolean) as ProfileData[];
      
      console.log(`🔄 getTopCollectors - ${results.length} collecteurs récupérés`);
      return results;
    } catch (error: any) {
      console.error("❌ Erreur récupération Top 5 collecteurs:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return [];
    }
  },

  updateIndividualProfile: async (data: {
    id: string;
    password?: string;
    phone?: string[];
    product_category?: string[];
    last_name?: string;
    first_name?: string;
    address?: string;
    description?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔍 updateIndividualProfile - Données:', data);
      const response = await apiClient.patch(API_ENDPOINTS.USER_UPDATE_INDIVIDUAL, data);
      console.log('✅ updateIndividualProfile - Succès:', response.data);
      return { 
        success: true, 
        message: response.data?.message || "Profil mis à jour avec succès" 
      };
    } catch (error: any) {
      console.error("❌ Erreur mise à jour profil individuel:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de la mise à jour" 
      };
    }
  },

  updateEntrepriseProfile: async (data: {
    id: string;
    password?: string;
    phone?: string[];
    product_category?: string[];
    legal_name?: string;
    registered_office?: string;
    rep_last_name?: string;
    rep_first_name?: string;
    rep_cin_number?: string;
    company_description?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔍 updateEntrepriseProfile - Données:', data);
      const response = await apiClient.patch(API_ENDPOINTS.USER_UPDATE_ENTREPRISE, data);
      console.log('✅ updateEntrepriseProfile - Succès:', response.data);
      return { 
        success: true, 
        message: response.data?.message || "Profil mis à jour avec succès" 
      };
    } catch (error: any) {
      console.error("❌ Erreur mise à jour profil entreprise:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de la mise à jour" 
      };
    }
  },

  searchUsersByName: async (name: string): Promise<ProfileData[]> => {
    try {
      console.log('🔍 searchUsersByName - name:', name);
      
      const url = API_ENDPOINTS.USER_SEARCH.replace('{name}', encodeURIComponent(name));
      console.log('🔍 searchUsersByName - URL:', url);
      
      const response = await apiClient.get<UserResponse[]>(url);
      console.log('📦 searchUsersByName - Réponse:', response.data);
      
      const results = response.data.map(user => transformUserResponse(user)).filter(Boolean) as ProfileData[];
      console.log('🔄 searchUsersByName - Résultats transformés:', results.length);
      
      return results;
    } catch (error: any) {
      console.error("❌ Erreur recherche utilisateurs:", error);
      if (error.response) {
        console.error('📦 Réponse erreur:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return [];
    }
  },

  getProfileFromToken: (): ProfileData | null => {
    console.log('🔍 getProfileFromToken - Début');
    
    const user = getUserFromToken();
    const role = getUserRole();
    const userId = getUserId();
    
    console.log('🔍 getProfileFromToken - Token info:', { user, role, userId });
    
    if (!user || !userId) {
      console.log('⚠️ getProfileFromToken - Pas d\'utilisateur ou userId');
      return null;
    }
    
    const savedName = localStorage.getItem('profile_name');
    const savedBio = localStorage.getItem('profile_bio');
    const savedAvatar = localStorage.getItem('profile_avatar');
    const savedType = localStorage.getItem('profile_type') as 'particulier' | 'entreprise' | null;
    
    console.log('🔍 getProfileFromToken - Saved data:', { savedName, savedBio, savedAvatar, savedType });
    
    const userRole = role === 'collector' ? 'collecteur' : 'fournisseur';
    
    const profileData: ProfileData = {
      id: userId,
      name: savedName || (userRole === 'collecteur' ? 'Collecteur' : 'Fournisseur'),
      role: userRole,
      rating: 4.5,
      bio: savedBio || 'Aucune description pour le moment',
      avatarUrl: savedAvatar || '/images/default-avatar.png',
      bannerUrl: '/images/auth/champ.jpeg',
      email: user.email || '',
      phone: [],
      reviews: [],
      isOwner: true,
      type: savedType || 'particulier',
    };
    
    console.log('🔍 getProfileFromToken - ProfileData créé:', profileData);
    return profileData;
  },

  updateProfile: async (data: Partial<ProfileData>): Promise<{ success: boolean; message: string }> => {
    console.log('🔍 updateProfile - Données reçues:', data);
    
    if (data.name) {
      localStorage.setItem('profile_name', data.name);
      console.log('💾 updateProfile - Nom sauvegardé:', data.name);
    }
    if (data.bio) {
      localStorage.setItem('profile_bio', data.bio);
      console.log('💾 updateProfile - Bio sauvegardée:', data.bio);
    }
    if (data.avatarUrl) {
      localStorage.setItem('profile_avatar', data.avatarUrl);
      console.log('💾 updateProfile - Avatar sauvegardé:', data.avatarUrl);
    }
    if (data.type) {
      localStorage.setItem('profile_type', data.type);
      console.log('💾 updateProfile - Type sauvegardé:', data.type);
    }
    
    console.log('✅ updateProfile - Profil mis à jour avec succès');
    return { success: true, message: 'Profil mis à jour avec succès' };
  },
};