// services/hooks/usePublication.ts
import { useState, useEffect } from 'react';
import { publicationService } from '../publication/publicationService';
import { Publication, CreatePublicationData, PublicationParams, UpdatePublicationData } from '../publication/types';
import { toast } from 'sonner';

export const usePublications = (userId?: string) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllPublications = async () => {
    if (!userId) {
      setPublications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await publicationService.getAllPublications(userId);
      // 🔥 S'assurer que c'est un tableau
      setPublications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPublications = async () => {
    if (!userId) {
      setPublications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await publicationService.getUserPublications(userId);
      setPublications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPublications = async (params: PublicationParams) => {
    if (!userId) {
      setPublications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await publicationService.filterPublications(userId, params);
      setPublications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du filtrage");
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const createPublication = async (data: CreatePublicationData) => {
    const response = await publicationService.createPublication(data);
    if (response.success) {
      toast.success(response.message);
      await loadUserPublications();
    } else {
      toast.error(response.message);
    }
    return response;
  };

  const updatePublication = async (publicationId: string, data: UpdatePublicationData) => {
    const response = await publicationService.updatePublication(publicationId, data);
    if (response.success) {
      toast.success(response.message);
      await loadUserPublications();
    } else {
      toast.error(response.message);
    }
    return response;
  };

  const deletePublication = async (publicationId: string) => {
    if (!userId) return { success: false, message: "Utilisateur non identifié" };
    const response = await publicationService.deletePublication(publicationId, userId);
    if (response.success) {
      toast.success(response.message);
      setPublications(prev => prev.filter(p => p.id !== publicationId));
    } else {
      toast.error(response.message);
    }
    return response;
  };

  // Charger au montage
  useEffect(() => {
    if (userId) {
      loadAllPublications();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    publications,
    loading,
    error,
    loadAllPublications,
    loadUserPublications,
    filterPublications,
    createPublication,
    updatePublication,
    deletePublication,
  };
};