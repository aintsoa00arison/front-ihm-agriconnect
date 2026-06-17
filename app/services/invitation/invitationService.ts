// services/invitation/invitationService.ts

"use client";

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Invitation, InvitationCreateInput, InvitationOutput } from './types';

export const invitationService = {
  /**
   * Créer une invitation
   */
 // services/invitation/invitationService.ts
// services/invitation/invitationService.ts
// services/invitation/invitationService.ts

createInvitation: async (data: InvitationCreateInput): Promise<{ 
  success: boolean; 
  message: string; 
  data?: any; 
  status?: number  // ⭐ AJOUTER CE CHAMP
}> => {
  try {
    console.log('📤 Envoi d\'invitation:', data);
    
    const payload = {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      publication_id: data.publication_id || null,
      message: data.message || null
    };
    
    const response = await apiClient.post(API_ENDPOINTS.INVITATION_CREATE, payload);
    
    return {
      success: true,
      message: response.data?.message || "Invitation envoyée avec succès",
      data: response.data,
      status: response.status
    };
  } catch (error: any) {
    console.error("❌ Erreur création invitation:", error);
    
    // ⭐ Gérer spécifiquement le 409
    if (error.response?.status === 409) {
      return {
        success: false,
        message: "Une invitation existe déjà",
        status: 409
      };
    }
    
    let errorMessage = "Erreur lors de l'envoi de l'invitation";
    if (error.response?.status === 400) {
      errorMessage = error.response?.data?.detail || "Données invalides";
    } else if (error.response?.status === 404) {
      errorMessage = "Utilisateur non trouvé";
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }
    
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status
    };
  }
},
  /**
   * Accepter une invitation
   */
  acceptInvitation: async (userId: string, invitationId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const url = API_ENDPOINTS.INVITATION_ACCEPT.replace('{user_id}', userId);
      console.log('✅ Acceptation invitation:', url);
      
      const response = await apiClient.post(`${url}?invitation_id=${invitationId}`);
      
      return {
        success: true,
        message: response.data?.message || "Invitation acceptée avec succès"
      };
    } catch (error: any) {
      console.error("❌ Erreur acceptation invitation:", error);
      
      return {
        success: false,
        message: error.response?.data?.detail || "Erreur lors de l'acceptation"
      };
    }
  },

  /**
   * Refuser une invitation
   */
  refuseInvitation: async (userId: string, invitationId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const url = API_ENDPOINTS.INVITATION_REFUSE.replace('{user_id}', userId);
      console.log('❌ Refus invitation:', url);
      
      const response = await apiClient.post(`${url}?invitation_id=${invitationId}`);
      
      return {
        success: true,
        message: response.data?.message || "Invitation refusée"
      };
    } catch (error: any) {
      console.error("❌ Erreur refus invitation:", error);
      
      return {
        success: false,
        message: error.response?.data?.detail || "Erreur lors du refus"
      };
    }
  },

  /**
   * Récupérer les invitations reçues
   */
  getInvitations: async (userId: string): Promise<Invitation[]> => {
    try {
      const url = API_ENDPOINTS.INVITATION_LIST.replace('{user_id}', userId);
      console.log('📡 Récupération des invitations:', url);
      
      const response = await apiClient.get(url);
      return response.data || [];
    } catch (error: any) {
      console.error("❌ Erreur récupération invitations:", error);
      return [];
    }
  },

  /**
   * Récupérer les invitations en attente
   */
  getPendingInvitations: async (userId: string): Promise<Invitation[]> => {
    try {
      const invitations = await invitationService.getInvitations(userId);
      return invitations.filter(inv => inv.status === 'pending' || inv.status === 'PENDING');
    } catch (error) {
      console.error("❌ Erreur récupération invitations en attente:", error);
      return [];
    }
  },

  /**
   * Récupérer les invitations acceptées
   */
  getAcceptedInvitations: async (userId: string): Promise<Invitation[]> => {
    try {
      const invitations = await invitationService.getInvitations(userId);
      return invitations.filter(inv => inv.status === 'accepted' || inv.status === 'ACCEPTED');
    } catch (error) {
      console.error("❌ Erreur récupération invitations acceptées:", error);
      return [];
    }
  },

  /**
   * ⭐ Récupérer une invitation par son token
   */
  getInvitationByToken: async (token: string): Promise<Invitation | null> => {
    try {
      console.log('📡 Récupération invitation par token:', token);
      // Si tu as un endpoint pour ça, sinon tu peux le faire via le service
      // Pour l'instant, on retourne null car on utilise les redirects du backend
      return null;
    } catch (error) {
      console.error("❌ Erreur récupération invitation par token:", error);
      return null;
    }
  }
};