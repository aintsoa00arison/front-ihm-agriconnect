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
      const storedRole = localStorage.getItem('user_role');
      if (storedRole) return storedRole;
      
      const token = localStorage.getItem('access_token');
      if (token) return getRoleFromToken(token);
    }
    return null;
  },

  // 🔥 CORRECTION ICI - Accepter soit email soit userId
  sendVerificationEmail: async (emailOrUserId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // 🔥 Détecter si c'est un email ou un userId
      const isEmail = emailOrUserId.includes('@') || emailOrUserId.includes('.');
      
      let url: string;
      if (isEmail) {
        // Si c'est un email, l'envoyer comme paramètre email
        url = `/auth/email/send?email=${encodeURIComponent(emailOrUserId)}`;
        console.log("📧 Envoi du code à l'email:", emailOrUserId);
      } else {
        // Si c'est un userId, l'envoyer comme paramètre user_id
        url = `/auth/email/send?user_id=${encodeURIComponent(emailOrUserId)}`;
        console.log("📧 Envoi du code à l'utilisateur:", emailOrUserId);
      }
      
      const response = await apiClient.post(url);
      return { success: true, message: "Code de vérification envoyé" };
    } catch (error: any) {
      console.error("❌ Erreur envoi email:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Erreur lors de l'envoi du code." 
      };
    }
  },


authenticateWithInvitation: async (token: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('🔑 Authentification avec token d\'invitation:', token);
    
    const response = await apiClient.get(`/auth/invitation-auth?token=${token}`);
    
    return {
      success: true,
      message: "Authentification réussie",
      data: response.data
    };
  } catch (error: any) {
    console.error("❌ Erreur authentification invitation:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Erreur d'authentification"
    };
  }
},
  verifyCode: async (userId: string, code: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("🔍 Vérification code - userId:", userId);
      console.log("🔍 Vérification code - code:", code);
      
      const response = await apiClient.post('/auth/email/validate', {
        user_id: userId,
        code: code
      });
      
      console.log("✅ Code validé avec succès:", response.data);
      return { success: true, message: "Code validé avec succès !" };
    } catch (error: any) {
      console.error("❌ Erreur validation code:", error);
      return { 
        success: false, 
        message: error.response?.data?.detail || "Code invalide." 
      };
    }
  },
};