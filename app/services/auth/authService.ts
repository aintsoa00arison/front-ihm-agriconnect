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
    
    console.log("===== CONTENU COMPLET DU TOKEN =====");
    console.log(decoded);
    console.log("====================================");
    
    // 🔥 Le rôle est dans 'user_type'
    const role = decoded?.user_type || decoded?.role || decoded?.type || null;
    console.log("Rôle trouvé:", role);
    
    return role;
  } catch (error) {
    console.error("Erreur décodage token:", error);
    return null;
  }
};

// Extraire l'ID utilisateur du token
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = decodeToken(token);
    return decoded?.sub || null;
  } catch {
    return null;
  }
};

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<TokenOutput> => {
    const response = await apiClient.post<TokenOutput>(API_ENDPOINTS.LOGIN, credentials);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access_token);
      document.cookie = `access_token=${response.data.access_token}; path=/; max-age=3600`;
      
      // 🔥 Stocker le rôle dans localStorage pour un accès rapide
      const role = getRoleFromToken(response.data.access_token);
      if (role) {
        localStorage.setItem('user_role', role);
      }
    }
    
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      document.cookie = 'access_token=; path=/; max-age=0';
    }
  },

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

  getUserRole: (): string | null => {
    if (typeof window !== 'undefined') {
      // 🔥 D'abord essayer de récupérer du localStorage (plus rapide)
      const storedRole = localStorage.getItem('user_role');
      if (storedRole) return storedRole;
      
      // Sinon, extraire du token
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