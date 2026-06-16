// services/hooks/usePublication.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { publicationService } from '../publication/publicationService';
import { Publication, CreatePublicationData, PublicationParams, UpdatePublicationData } from '../publication/types';
import { toast } from 'sonner';
import { getUserRole } from '../lib/auth';

export const usePublications = (userId?: string) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isMounted = useRef(true);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadDone = useRef(false);

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

  // 🔥 Charger les publications selon le rôle de l'utilisateur
  const loadPublicationsByRole = useCallback(async (showToast: boolean = false) => {
    if (!userId) {
      setPublications([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userRole = getUserRole();
      let data: Publication[] = [];
      
      console.log(`🔵 Chargement des publications pour le rôle: ${userRole}`);
      
      // 🔥 Selon le rôle, appeler la bonne route
      if (userRole === 'collecteur' || userRole === 'collector') {
        // Collecteur voit les publications des fournisseurs
        data = await publicationService.getProviderPublications();
        console.log(`📦 ${data.length} publications fournisseurs chargées`);
      } else if (userRole === 'fournisseur' || userRole === 'provider') {
        // Fournisseur voit les publications des collecteurs
        data = await publicationService.getCollectorPublications();
        console.log(`📦 ${data.length} publications collecteurs chargées`);
      } else {
        // Fallback: charger toutes les publications
        data = await publicationService.getProviderPublications();
        console.log(`📦 ${data.length} publications chargées (fallback)`);
      }
      
      if (!isMounted.current) return;
      
      const sanitized = sanitizePublications(data);
      setPublications(sanitized);
      setIsInitialized(true);
      
      if (sanitized.length === 0) {
        console.log(`📭 Aucune publication trouvée pour le rôle ${userRole}`);
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      
      const errorMsg = err.message || "Erreur lors du chargement des publications";
      setError(errorMsg);
      setPublications([]);
      setIsInitialized(true);
      console.error('❌ Erreur loadPublicationsByRole:', err);
      
      if (showToast) {
        toast.error(errorMsg);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  // 🔥 Charger toutes les publications (pour compatibilité)
  const loadAllPublications = useCallback(async (showToast: boolean = false) => {
    return loadPublicationsByRole(showToast);
  }, [loadPublicationsByRole]);

  // 🔥 Charger les publications de l'utilisateur
  const loadUserPublications = useCallback(async (showToast: boolean = false) => {
    if (!userId) {
      setPublications([]);
      setLoading(false);
      setIsInitialized(true);
      return;
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

  const createPublication = useCallback(async (data: CreatePublicationData) => {
    try {
      const response = await publicationService.createPublication(data);
      
      if (response.success) {
        toast.success(response.message || "Publication créée avec succès !");
        setTimeout(() => {
          loadPublicationsByRole(true);
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
  }, [loadPublicationsByRole]);

  const updatePublication = useCallback(async (publicationId: string, data: UpdatePublicationData) => {
    try {
      const response = await publicationService.updatePublication(publicationId, data);
      
      if (response.success) {
        toast.success(response.message || "Publication mise à jour avec succès !");
        setTimeout(() => {
          loadPublicationsByRole(true);
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
  }, [loadPublicationsByRole]);

  const deletePublication = useCallback(async (publicationId: string) => {
    if (!userId) {
      toast.error("Utilisateur non identifié");
      return { success: false, message: "Utilisateur non identifié" };
    }

    try {
      const response = await publicationService.deletePublication(publicationId, userId);
      
      if (response.success) {
        toast.success(response.message || "Publication supprimée avec succès !");
        setPublications(prev => prev.filter(p => p.id !== publicationId));
        setTimeout(() => {
          loadPublicationsByRole(true);
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
  }, [userId, loadPublicationsByRole]);

  const refreshPublications = useCallback(async () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    try {
      await loadPublicationsByRole(true);
      toast.success("Publications actualisées");
    } catch (err: any) {
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setIsRefreshing(false);
    }
  }, [userId, loadPublicationsByRole]);

  const resetPublications = useCallback(() => {
    setPublications([]);
    setError(null);
    setLoading(false);
    setIsInitialized(false);
    initialLoadDone.current = false;
  }, []);

  // 🔥 Charger au montage
  useEffect(() => {
    isMounted.current = true;
    
    if (userId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadPublicationsByRole();
      
      const forceTimeout = setTimeout(() => {
        if (isMounted.current && loading) {
          console.warn('⚠️ Chargement forcé après timeout');
          setLoading(false);
          setIsInitialized(true);
        }
      }, 5000);
      
      return () => {
        clearTimeout(forceTimeout);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    } else if (!userId) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // 🔥 Réinitialiser le flag quand userId change
  useEffect(() => {
    initialLoadDone.current = false;
  }, [userId]);

  return {
    publications,
    loading,
    error,
    isRefreshing,
    isInitialized,
    isEmpty: publications.length === 0 && !loading && !error && isInitialized,
    
    loadAllPublications,
    loadUserPublications,
    loadPublicationsByRole,
    filterPublications,
    createPublication,
    updatePublication,
    deletePublication,
    refreshPublications,
    resetPublications,
    
    getPublication: (id: string) => publications.find(p => p.id === id),
    getPublicationsByCategory: (category: string) => 
      publications.filter(p => p.category === category),
  };
};