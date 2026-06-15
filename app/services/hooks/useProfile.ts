// services/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { profileService, ProfileData } from '../profile/profileService';

export const useProfile = (slug?: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        
        if (slug && slug !== 'me') {
          // Récupérer un profil par slug (public)
          data = await profileService.getProfileBySlug(slug);
        } else {
          // Récupérer le profil de l'utilisateur connecté
          data = profileService.getProfileFromToken();
        }
        
        setProfile(data);
      } catch (err: any) {
        console.error("Erreur chargement profil:", err);
        setError(err.message || "Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    const result = await profileService.updateProfile(data);
    if (result.success) {
      // Mettre à jour le profil localement
      setProfile(prev => prev ? { ...prev, ...data } : null);
    }
    return result;
  };

  const updateCollectorProfile = async (data: any) => {
    const result = await profileService.updateCollectorProfile(data);
    if (result.success) {
      // Recharger le profil
      const updatedProfile = profileService.getProfileFromToken();
      setProfile(updatedProfile);
    }
    return result;
  };

  const updateFournisseurProfile = async (data: any) => {
    const result = await profileService.updateFournisseurProfile(data);
    if (result.success) {
      const updatedProfile = profileService.getProfileFromToken();
      setProfile(updatedProfile);
    }
    return result;
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateCollectorProfile,
    updateFournisseurProfile,
    refetch: () => {
      const data = profileService.getProfileFromToken();
      setProfile(data);
    },
  };
};