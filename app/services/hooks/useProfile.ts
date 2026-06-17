// services/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../profile/profileService';
import { ProfileData } from '../profile/types/profile';
import { getUserId } from '../lib/auth';

// ⭐ Fonction de transformation pour ajouter le champ photo
const transformProfileData = (data: any): ProfileData => {
  if (!data) return data;
  
  // ⭐ Extraire la photo de différentes sources possibles
  let photoUrl = data.photo || data.avatarUrl || null;
  
  // Si photo est un objet avec .value (comme dans le backend)
  if (data.photo && typeof data.photo === 'object' && data.photo.value) {
    photoUrl = data.photo.value;
  }
  
  // Si photo est un objet avec .url
  if (data.photo && typeof data.photo === 'object' && data.photo.url) {
    photoUrl = data.photo.url;
  }
  
  // Si photo est une chaîne directe
  if (typeof data.photo === 'string') {
    photoUrl = data.photo;
  }
  
  // ⭐ Extraire le nom
  let name = data.pseudonyme || data.name || 'Utilisateur';
  if (data.first_name && data.last_name) {
    name = `${data.first_name} ${data.last_name}`;
  } else if (data.first_name) {
    name = data.first_name;
  } else if (data.last_name) {
    name = data.last_name;
  }
  
  // ⭐ Extraire le rating
  let rating = data.rating || 0;
  if (data.score) {
    if (typeof data.score === 'number') {
      rating = data.score;
    } else if (typeof data.score === 'object' && data.score.value !== undefined) {
      rating = data.score.value;
    }
  }
  
  // ⭐ Extraire l'email
  let email = data.email;
  if (data.email && typeof data.email === 'object' && data.email.value) {
    email = data.email.value;
  }
  
  return {
    ...data,
    name: name,
    photo: photoUrl,
    avatarUrl: photoUrl,  // ⭐ Ajouter aussi avatarUrl pour compatibilité
    rating: rating,
    email: email,
  };
};

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ⭐ Fonction pour charger le profil avec transformation
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: any = null;
      
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
      
      // ⭐ Transformer les données pour ajouter le champ photo
      const transformedData = transformProfileData(data);
      
      console.log('🔵 useProfile - Données brutes:', data);
      console.log('🔵 useProfile - Données transformées:', transformedData);
      console.log('🔵 useProfile - Photo extraite:', transformedData.photo);
      
      setProfile(transformedData);
    } catch (err: any) {
      console.error("Erreur chargement profil:", err);
      setError(err.message || "Erreur lors du chargement du profil");
      const fallback = profileService.getProfileFromToken();
      if (fallback) {
        setProfile(transformProfileData(fallback));
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateIndividualProfile = async (data: any) => {
    const result = await profileService.updateIndividualProfile(data);
    if (result.success) {
      const updated = await profileService.getMyProfile();
      setProfile(updated ? transformProfileData(updated) : null);
    }
    return result;
  };

  const updateEntrepriseProfile = async (data: any) => {
    const result = await profileService.updateEntrepriseProfile(data);
    if (result.success) {
      const updated = await profileService.getMyProfile();
      setProfile(updated ? transformProfileData(updated) : null);
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
    refetch: loadProfile,
  };
};