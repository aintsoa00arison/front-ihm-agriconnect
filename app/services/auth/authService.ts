// services/auth/authService.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { TokenOutput } from './types';

// Fonction pour décoder le token
export const decodeToken = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Extraire le rôle du token

export const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    // Affiche TOUT le contenu du token
    console.log("===== CONTENU COMPLET DU TOKEN =====");
    console.log(decoded);
    console.log("====================================");
    
    // Essaie de trouver le rôle par différents noms possibles
    const role = decoded?.user_type || decoded?.role || decoded?.type || null;
    console.log("Rôle trouvé:", role);
    
    return role;
  } catch (error) {
    console.error("Erreur décodage token:", error);
    return null;
  }
};

export const authService = {
  
 // services/auth/authService.ts
login: async (credentials: { email: string; password: string }): Promise<TokenOutput> => {
  const response = await apiClient.post<TokenOutput>(API_ENDPOINTS.LOGIN, credentials);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.data.access_token);
    // Stocker aussi dans un cookie pour le middleware
    document.cookie = `access_token=${response.data.access_token}; path=/; max-age=3600`;
  }
  
  return response.data;
},

logout: () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; max-age=0';
  }
},
  // Rafraîchir le token (amélioré)
  refreshToken: async (): Promise<string | null> => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return null;
      
      const response = await apiClient.post<TokenOutput>(API_ENDPOINTS.REFRESH_TOKEN, {
        access_token: accessToken,
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return response.data.access_token;
    } catch (error) {
      console.error("Erreur refresh token:", error);
      return null;
    }
  },

  // Récupérer le rôle
  getUserRole: (): string | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) return getRoleFromToken(token);
    }
    return null;
  },

sendVerificationEmail: async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(`/auth/email/send?email=${encodeURIComponent(email)}`);
    return { success: true, message: "Code de vérification envoyé" };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.detail || "Erreur lors de l'envoi du code." 
    };
  }
},


// Dans authService.ts, assure-toi que verifyCode a cette signature :
verifyCode: async (userId: string, code: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/auth/email/validate', {
      user_id: userId,
      code: code
    });
    return { success: true, message: "Code validé avec succès !" };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.detail || "Code invalide." 
    };
  }
},
};