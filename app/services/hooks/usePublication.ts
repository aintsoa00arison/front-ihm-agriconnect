// services/hooks/usePublication.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { publicationService } from '../publication/publicationService';
import { Publication, CreatePublicationData, PublicationParams, UpdatePublicationData } from '../publication/types';
import { toast } from 'sonner';

export const usePublications = (userId?: string) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 🔥 Référence pour éviter les appels multiples
  const isMounted = useRef(true);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 Fonction pour nettoyer les données
  const sanitizePublications = (data: any): Publication[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (typeof data === 'object') {
      const values = Object.values(data);
      if (values.length > 0 && Array.isArray(values[0])) {
        return values[0];
      }
    }
    return [];
  };

  // 🔥 Charger les publications de l'utilisateur
  const loadUserPublications = useCallback(async (showToast: boolean = false) => {
    if (!userId) {
      setPublications([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    // Éviter les appels multiples
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setLoading(true);
    setError(null);

    try {
      const data = await publicationService.getUserPublications(userId);
      
      if (!isMounted.current) return;
      
      const sanitized = sanitizePublications(data);
      setPublications(sanitized);
      setIsInitialized(true);
      
      if (sanitized.length === 0) {
        console.log('📭 Aucune publication trouvée pour cet utilisateur');
      } else {
        console.log(`📦 ${sanitized.length} publications chargées`);
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      
      const errorMsg = err.message || "Erreur lors du chargement de vos publications";
      setError(errorMsg);
      setPublications([]);
      setIsInitialized(true);
      console.error('❌ Erreur loadUserPublications:', err);
      
      if (showToast) {
        toast.error(errorMsg);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  // 🔥 Charger toutes les publications
  const loadAllPublications = useCallback(async (showToast: boolean = false) => {
    if (!userId) {
      setPublications([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setLoading(true);
    setError(null);

    try {
      const data = await publicationService.getAllPublications(userId);
      
      if (!isMounted.current) return;
      
      const sanitized = sanitizePublications(data);
      setPublications(sanitized);
      setIsInitialized(true);
      
      if (sanitized.length === 0) {
        console.log('📭 Aucune publication trouvée');
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      
      const errorMsg = err.message || "Erreur lors du chargement des publications";
      setError(errorMsg);
      setPublications([]);
      setIsInitialized(true);
      console.error('❌ Erreur loadAllPublications:', err);
      
      if (showToast) {
        toast.error(errorMsg);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  // 🔥 Filtrer les publications
  const filterPublications = useCallback(async (params: PublicationParams) => {
    if (!userId) {
      setPublications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await publicationService.filterPublications(userId, params);
      
      if (!isMounted.current) return;
      
      const sanitized = sanitizePublications(data);
      setPublications(sanitized);
    } catch (err: any) {
      if (!isMounted.current) return;
      
      const errorMsg = err.message || "Erreur lors du filtrage";
      setError(errorMsg);
      setPublications([]);
      console.error('❌ Erreur filterPublications:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  // 🔥 Créer une publication
  const createPublication = useCallback(async (data: CreatePublicationData) => {
    try {
      const response = await publicationService.createPublication(data);
      
      if (response.success) {
        toast.success(response.message || "Publication créée avec succès !");
        // 🔥 Recharger après un court délai
        setTimeout(() => {
          loadUserPublications(true);
        }, 500);
        return response;
      } else {
        toast.error(response.message || "Erreur lors de la création");
        return response;
      }
    } catch (err: any) {
      const errorMsg = err.message || "Une erreur est survenue";
      toast.error(errorMsg);
      console.error('❌ Erreur createPublication:', err);
      return { success: false, message: errorMsg };
    }
  }, [loadUserPublications]);

  // 🔥 Mettre à jour une publication
  const updatePublication = useCallback(async (publicationId: string, data: UpdatePublicationData) => {
    try {
      const response = await publicationService.updatePublication(publicationId, data);
      
      if (response.success) {
        toast.success(response.message || "Publication mise à jour avec succès !");
        setTimeout(() => {
          loadUserPublications(true);
        }, 500);
        return response;
      } else {
        toast.error(response.message || "Erreur lors de la mise à jour");
        return response;
      }
    } catch (err: any) {
      const errorMsg = err.message || "Une erreur est survenue";
      toast.error(errorMsg);
      console.error('❌ Erreur updatePublication:', err);
      return { success: false, message: errorMsg };
    }
  }, [loadUserPublications]);

  // 🔥 Supprimer une publication
  const deletePublication = useCallback(async (publicationId: string) => {
    if (!userId) {
      toast.error("Utilisateur non identifié");
      return { success: false, message: "Utilisateur non identifié" };
    }

    try {
      const response = await publicationService.deletePublication(publicationId, userId);
      
      if (response.success) {
        toast.success(response.message || "Publication supprimée avec succès !");
        // 🔥 Mettre à jour la liste localement
        setPublications(prev => prev.filter(p => p.id !== publicationId));
        // 🔥 Recharger pour être sûr
        setTimeout(() => {
          loadUserPublications(true);
        }, 300);
        return response;
      } else {
        toast.error(response.message || "Erreur lors de la suppression");
        return response;
      }
    } catch (err: any) {
      const errorMsg = err.message || "Une erreur est survenue";
      toast.error(errorMsg);
      console.error('❌ Erreur deletePublication:', err);
      return { success: false, message: errorMsg };
    }
  }, [userId, loadUserPublications]);

  // 🔥 Rafraîchir les publications
  const refreshPublications = useCallback(async () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    try {
      await loadUserPublications(true);
      toast.success("Publications actualisées");
    } catch (err: any) {
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setIsRefreshing(false);
    }
  }, [userId, loadUserPublications]);

  // 🔥 Réinitialiser l'état
  const resetPublications = useCallback(() => {
    setPublications([]);
    setError(null);
    setLoading(false);
    setIsInitialized(false);
  }, []);

  // 🔥 Charger au montage avec un délai pour éviter les problèmes de rendu
  useEffect(() => {
    isMounted.current = true;
    
    if (userId) {
      // 🔥 Petit délai pour éviter les problèmes de rendu
      const timer = setTimeout(() => {
        if (isMounted.current) {
          loadUserPublications();
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    } else {
      setLoading(false);
      setPublications([]);
      setIsInitialized(true);
    }
    
    return () => {
      isMounted.current = false;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [userId, loadUserPublications]);

  return {
    // 🔥 États
    publications,
    loading,
    error,
    isRefreshing,
    isInitialized,
    isEmpty: publications.length === 0 && !loading && !error && isInitialized,
    
    // 🔥 Actions
    loadAllPublications,
    loadUserPublications,
    filterPublications,
    createPublication,
    updatePublication,
    deletePublication,
    refreshPublications,
    resetPublications,
    
    // 🔥 Utilitaires
    getPublication: (id: string) => publications.find(p => p.id === id),
    getPublicationsByCategory: (category: string) => 
      publications.filter(p => p.category === category),
  };
};