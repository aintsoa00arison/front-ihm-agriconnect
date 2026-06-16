// services/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { profileService } from '../profile/profileService';
import { ProfileData } from '../profile/types/profile';
import { getUserId } from '../lib/auth';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: ProfileData | null = null;
        
        if (userId) {
          data = await profileService.getUserById(userId);
        } else {
          const currentUserId = getUserId();
          if (currentUserId) {
            data = await profileService.getMyProfile();
          }
          if (!data) {
            data = profileService.getProfileFromToken();
          }
        }
        
        setProfile(data);
      } catch (err: any) {
        console.error("Erreur chargement profil:", err);
        setError(err.message || "Erreur lors du chargement du profil");
        const fallback = profileService.getProfileFromToken();
        setProfile(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateIndividualProfile = async (data: any) => {
    const result = await profileService.updateIndividualProfile(data);
    if (result.success) {
      const updated = await profileService.getMyProfile();
      setProfile(updated);
    }
    return result;
  };

  const updateEntrepriseProfile = async (data: any) => {
    const result = await profileService.updateEntrepriseProfile(data);
    if (result.success) {
      const updated = await profileService.getMyProfile();
      setProfile(updated);
    }
    return result;
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    const result = await profileService.updateProfile(data);
    if (result.success) {
      setProfile(prev => prev ? { ...prev, ...data } : null);
    }
    return result;
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateIndividualProfile,
    updateEntrepriseProfile,
    refetch: () => {
      const currentUserId = getUserId();
      if (currentUserId) {
        profileService.getMyProfile().then(setProfile);
      }
    },
  };
};