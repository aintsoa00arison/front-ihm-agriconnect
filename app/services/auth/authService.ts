// services/auth/authService.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { UserLoginDTO, TokenOutput, EmailValidationDTO } from './types';

export const authService = {
  // Connexion - Attention: le champ s'appelle "passord" dans le backend
  login: async (credentials: { email: string; password: string }): Promise<TokenOutput> => {
    // Transformer password en passord (faute du backend)
    const payload: UserLoginDTO = {
      email: credentials.email,
      passord: credentials.password,  // Note: "passord" et non "password"
    };
    
    const response = await apiClient.post<TokenOutput>(API_ENDPOINTS.LOGIN, payload);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  },

  // Rafraîchir le token
  refreshToken: async (accessToken: string): Promise<TokenOutput> => {
    const response = await apiClient.post<TokenOutput>(API_ENDPOINTS.REFRESH_TOKEN, {
      access_token: accessToken,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  },

  // Envoyer email de validation

sendVerificationEmail: async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Pas de /api dans l'URL
    const response = await apiClient.post(`/auth/email/send?email=${encodeURIComponent(email)}`);
    return { success: true, message: "Un code de vérification vous a été envoyé." };
  } catch (error: any) {
    console.error("Erreur d'envoi:", error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.detail || "Erreur lors de l'envoi du code." 
    };
  }
},

verifyCode: async (data: { email: string; code: string }): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(
      `/auth/email/validate?email=${encodeURIComponent(data.email)}&code=${encodeURIComponent(data.code)}`
    );
    return { success: true, message: "Code validé avec succès !" };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.detail || "Code invalide." 
    };
  }
},

  // Déconnexion
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },
};