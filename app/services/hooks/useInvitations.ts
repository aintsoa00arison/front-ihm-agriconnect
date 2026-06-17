// services/hooks/useInvitations.ts

"use client";

import { useState, useEffect, useCallback } from 'react';
import { invitationService } from '../invitation/invitationService';
import { Invitation, InvitationCreateInput } from '../invitation/types';
import { toast } from 'sonner';

export const useInvitations = (userId?: string, autoLoad: boolean = true) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadInvitations = useCallback(async (showToast: boolean = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`📡 Chargement des invitations pour l'utilisateur: ${userId}`);
      const data = await invitationService.getInvitations(userId);
      
      setInvitations(data);
      
      const pending = data.filter(inv => inv.status === 'pending' || inv.status === 'PENDING');
      setPendingInvitations(pending);
      
      console.log(`📦 ${data.length} invitations récupérées (${pending.length} en attente)`);
    } catch (err: any) {
      // ⭐ NE PAS AFFICHER D'ERREUR SI 404
      if (err?.response?.status !== 404) {
        const errorMsg = err.message || "Erreur lors du chargement des invitations";
        setError(errorMsg);
        console.error('❌ Erreur loadInvitations:', err);
        if (showToast) {
          toast.error(errorMsg);
        }
      } else {
        console.log('📭 Aucune invitation trouvée (404)');
        setInvitations([]);
        setPendingInvitations([]);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createInvitation = useCallback(async (data: InvitationCreateInput) => {
    try {
      console.log('📤 Création invitation avec:', data);
      
      const response = await invitationService.createInvitation({
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        publication_id: data.publication_id,
        message: data.message
      });
      
      if (response.success) {
        toast.success(response.message || "Invitation envoyée avec succès !");
        return response;
      }
      
      if (response.status === 409) {
        return response;
      }
      
      toast.error(response.message || "Erreur lors de l'envoi");
      return response;
      
    } catch (err: any) {
      const errorMsg = err.message || "Une erreur est survenue";
      toast.error(errorMsg);
      console.error('❌ Erreur createInvitation:', err);
      return { 
        success: false, 
        message: errorMsg,
        status: err?.response?.status || 500
      };
    }
  }, []);

  const acceptInvitation = useCallback(async (invitationId: string) => {
    if (!userId) {
      toast.error("Utilisateur non identifié");
      return { success: false, message: "Utilisateur non identifié" };
    }

    try {
      const response = await invitationService.acceptInvitation(userId, invitationId);
      
      if (response.success) {
        toast.success(response.message || "Invitation acceptée ! 🎉");
        await loadInvitations(true);
        return response;
      } else {
        toast.error(response.message || "Erreur lors de l'acceptation");
        return response;
      }
    } catch (err: any) {
      const errorMsg = err.message || "Une erreur est survenue";
      toast.error(errorMsg);
      console.error('❌ Erreur acceptInvitation:', err);
      return { success: false, message: errorMsg };
    }
  }, [userId, loadInvitations]);

  const refuseInvitation = useCallback(async (invitationId: string) => {
    if (!userId) {
      toast.error("Utilisateur non identifié");
      return { success: false, message: "Utilisateur non identifié" };
    }

    try {
      const response = await invitationService.refuseInvitation(userId, invitationId);
      
      if (response.success) {
        toast.success(response.message || "Invitation refusée");
        await loadInvitations(true);
        return response;
      } else {
        toast.error(response.message || "Erreur lors du refus");
        return response;
      }
    } catch (err: any) {
      const errorMsg = err.message || "Une erreur est survenue";
      toast.error(errorMsg);
      console.error('❌ Erreur refuseInvitation:', err);
      return { success: false, message: errorMsg };
    }
  }, [userId, loadInvitations]);

  const refreshInvitations = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadInvitations(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadInvitations]);

  // ⭐ Chargement initial SEULEMENT si autoLoad est true
  useEffect(() => {
    if (userId && autoLoad) {
      loadInvitations();
    } else if (userId && !autoLoad) {
      setLoading(false);
    }
  }, [userId, autoLoad, loadInvitations]);

  return {
    invitations,
    pendingInvitations,
    loading,
    error,
    isRefreshing,
    createInvitation,
    acceptInvitation,
    refuseInvitation,
    refreshInvitations,
    loadInvitations,
    hasPendingInvitations: pendingInvitations.length > 0,
    pendingCount: pendingInvitations.length,
  };
};