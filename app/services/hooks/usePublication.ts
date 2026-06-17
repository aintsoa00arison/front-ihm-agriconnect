// services/hooks/usePublication.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { publicationService } from '../publication/publicationService';
import { Publication, CreatePublicationData, PublicationParams, UpdatePublicationData } from '../publication/types';
import { toast } from 'sonner';
import { getUserRole, getUserId } from '../lib/auth';

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

  const loadPublicationsByRole = useCallback(async (showToast: boolean = false) => {
    const currentUserId = userId || getUserId();
    
    if (!currentUserId) {
      console.log('⚠️ Aucun userId trouvé');
      setPublications([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userRole = getUserRole();
      
      console.log(`🔵 [loadPublicationsByRole] userId: ${currentUserId}, userRole: ${userRole}`);
      
      let data: Publication[] = [];
      
      const isCollector = userRole === 'collecteur' || userRole === 'collector';
      const isProvider = userRole === 'fournisseur' || userRole === 'provider';
      
      if (isCollector) {
        console.log('🔵 Collecteur - Chargement des publications des fournisseurs');
        data = await publicationService.getProviderPublications();
        console.log(`📦 ${data.length} publications fournisseurs chargées pour collecteur`);
      } else if (isProvider) {
        console.log('🔵 Fournisseur - Chargement des publications des collecteurs');
        data = await publicationService.getCollectorPublications();
        console.log(`📦 ${data.length} publications collecteurs chargées pour fournisseur`);
      } else {
        console.warn(`⚠️ Rôle non reconnu: ${userRole}, fallback sur les fournisseurs`);
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

  const loadAllPublications = useCallback(async (showToast: boolean = false) => {
    return loadPublicationsByRole(showToast);
  }, [loadPublicationsByRole]);

  const loadUserPublications = useCallback(async (showToast: boolean = false) => {
    const currentUserId = userId || getUserId();
    
    if (!currentUserId) {
      setPublications([]);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await publicationService.getUserPublications(currentUserId);
      
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
    const currentUserId = userId || getUserId();
    
    if (!currentUserId) {
      setPublications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔵 filterPublications - userId:', currentUserId);
      console.log('🔵 filterPublications - params:', params);
      
      let category = params.category || [];
      if (typeof category === 'string') {
        category = category ? [category] : [];
      }
      if (!Array.isArray(category)) {
        category = [];
      }
      
      const data = await publicationService.filterPublications(
        currentUserId,
        {
          titre_or_description: params.titre_or_description || "",
          category: category,
        }
      );
      
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

  // 🔥 createPublication - GARDE LE TOAST (création)
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

  // 🔥 updatePublication - SUPPRIME LE TOAST (géré par le formulaire)
  const updatePublication = useCallback(async (publicationId: string, data: UpdatePublicationData) => {
    try {
      const response = await publicationService.updatePublication(publicationId, data);
      
      // ⭐ SUPPRESSION DU TOAST ICI - Il est géré par AdForm
      // On laisse juste le refresh
      if (response.success) {
        // Pas de toast ici, c'est géré par le formulaire
        setTimeout(() => {
          loadPublicationsByRole(true);
        }, 500);
        return response;
      } else {
        // ⭐ On garde les erreurs pour les cas d'échec
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

  // 🔥 deletePublication - GARDE LE TOAST (suppression)
  const deletePublication = useCallback(async (publicationId: string) => {
    const currentUserId = userId || getUserId();
    
    if (!currentUserId) {
      toast.error("Utilisateur non identifié");
      return { success: false, message: "Utilisateur non identifié" };
    }

    try {
      const response = await publicationService.deletePublication(publicationId, currentUserId);
      
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
    setIsRefreshing(true);
    try {
      await loadPublicationsByRole(true);
      toast.success("Publications actualisées");
    } catch (err: any) {
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setIsRefreshing(false);
    }
  }, [loadPublicationsByRole]);

  const resetPublications = useCallback(() => {
    setPublications([]);
    setError(null);
    setLoading(false);
    setIsInitialized(false);
    initialLoadDone.current = false;
  }, []);

  // Charger au montage et quand userId change
  useEffect(() => {
    isMounted.current = true;
    
    const currentUserId = userId || getUserId();
    
    if (currentUserId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      console.log(`🔵 [usePublications] Chargement initial pour userId: ${currentUserId}`);
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
    } else if (!currentUserId) {
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

  // Réinitialiser le flag quand userId change
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