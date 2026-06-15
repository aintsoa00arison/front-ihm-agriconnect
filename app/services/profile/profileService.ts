// services/profile/profileService.ts
import { getUserFromToken, getUserRole, getUserId } from '../lib/auth';

// Types
export interface ProfileData {
  id: string;
  name: string;
  role: 'collecteur' | 'fournisseur';
  rating: number;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  email: string;
  phone: string;
  reviews: any[];
  isOwner: boolean;
  type?: 'particulier' | 'entreprise';
}

// Données mockées en attendant le backend
const MOCK_PROFILES: Record<string, Partial<ProfileData>> = {
  'collecteur': {
    name: 'Collecteur Test',
    bio: 'Entreprise de collecte de produits agricoles',
    avatarUrl: '/images/default-avatar.png',
  },
  'fournisseur': {
    name: 'Fournisseur Test',
    bio: 'Producteur de fruits et légumes bio',
    avatarUrl: '/images/default-avatar.png',
  },
};

export const profileService = {
  // Récupérer le profil depuis le token (pas d'appel API)
  getProfileFromToken: (): ProfileData | null => {
    const user = getUserFromToken();
    const role = getUserRole();
    const userId = getUserId();
    
    if (!user || !userId) return null;
    
    // Récupérer depuis localStorage les données sauvegardées
    const savedName = localStorage.getItem('profile_name');
    const savedBio = localStorage.getItem('profile_bio');
    const savedAvatar = localStorage.getItem('profile_avatar');
    const savedType = localStorage.getItem('profile_type') as 'particulier' | 'entreprise' | null;
    
    const userRole = role === 'collector' ? 'collecteur' : 'fournisseur';
    const mock = MOCK_PROFILES[userRole] || {};
    
    return {
      id: userId,
      name: savedName || mock.name || (userRole === 'collecteur' ? 'Collecteur' : 'Fournisseur'),
      role: userRole,
      rating: 4.5,
      bio: savedBio || mock.bio || 'Aucune description pour le moment',
      avatarUrl: savedAvatar || mock.avatarUrl || '/images/default-avatar.png',
      bannerUrl: '/images/auth/champ.jpeg',
      email: user.email || '',
      phone: '',
      reviews: [],
      isOwner: true,
      type: savedType || 'particulier',
    };
  },

  // Récupérer un profil par slug (à remplacer par appel API plus tard)
  getProfileBySlug: async (slug: string): Promise<ProfileData | null> => {
    // TODO: Remplacer par appel API réel quand disponible
    // const response = await apiClient.get(`/profile/${slug}`);
    // return transformProfileData(response.data);
    
    console.log('🔵 getProfileBySlug appelé avec slug:', slug);
    
    // Pour l'instant, retourner le profil du token si le slug correspond
    const currentProfile = profileService.getProfileFromToken();
    if (currentProfile && (slug === currentProfile.id || slug === 'me')) {
      return currentProfile;
    }
    
    // Sinon, retourner un profil mocké
    return {
      id: slug,
      name: 'Utilisateur',
      role: 'collecteur',
      rating: 4.0,
      bio: 'Aucune description disponible',
      avatarUrl: '/images/default-avatar.png',
      bannerUrl: '/images/auth/champ.jpeg',
      email: '',
      phone: '',
      reviews: [],
      isOwner: false,
    };
  },

  // Mettre à jour le profil (localStorage pour l'instant)
  updateProfile: async (data: Partial<ProfileData>): Promise<{ success: boolean; message: string }> => {
    // TODO: Remplacer par appel API réel quand disponible
    // const response = await apiClient.put('/profile/me', data);
    
    if (data.name) localStorage.setItem('profile_name', data.name);
    if (data.bio) localStorage.setItem('profile_bio', data.bio);
    if (data.avatarUrl) localStorage.setItem('profile_avatar', data.avatarUrl);
    if (data.type) localStorage.setItem('profile_type', data.type);
    
    return { success: true, message: 'Profil mis à jour avec succès' };
  },

  // Mettre à jour le profil collecteur (spécifique)
  updateCollectorProfile: async (data: any): Promise<{ success: boolean; message: string }> => {
    // TODO: Remplacer par appel API réel
    // const response = await apiClient.put('/profile/collector', data);
    
    if (data.company?.name) localStorage.setItem('profile_name', data.company.name);
    if (data.bio) localStorage.setItem('profile_bio', data.bio);
    
    return { success: true, message: 'Profil collecteur mis à jour' };
  },

  // Mettre à jour le profil fournisseur (spécifique)
  updateFournisseurProfile: async (data: any): Promise<{ success: boolean; message: string }> => {
    // TODO: Remplacer par appel API réel
    // const response = await apiClient.put('/profile/fournisseur', data);
    
    if (data.company?.name) localStorage.setItem('profile_name', data.company.name);
    if (data.bio) localStorage.setItem('profile_bio', data.bio);
    if (data.type) localStorage.setItem('profile_type', data.type);
    
    return { success: true, message: 'Profil fournisseur mis à jour' };
  },
};