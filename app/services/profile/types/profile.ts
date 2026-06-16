// services/profile/types/profile.ts

export interface ProfileData {
  id: string;
  name: string;
  role: "fournisseur" | "collecteur";
  rating: number | null;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  email?: string;
  phone?: string[];
  reviews?: any[];
  isOwner?: boolean;
  type?: 'particulier' | 'entreprise';
  product_category?: string[]; // 🔥 AJOUTER CE CHAMP
}

export interface UserResponse {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  user_type?: string;
  score?: {
    value: number;
  };
  product_category?: string[]; // 🔥 AJOUTER CE CHAMP
  description?: string;
  email?: {
    value: string;
  } | string;
  phone?: Array<{ value: string }> | string[];
  address?: string;
  cin_number?: {
    value: string;
  };
  avatarUrl?: string;
  bannerUrl?: string;
  [key: string]: any;
}

export const transformUserResponse = (data: UserResponse): ProfileData => {
  console.log('🔄 transformUserResponse - Données reçues:', JSON.stringify(data, null, 2));
  
  // 🔥 Extraire le nom complet
  const firstName = data.first_name || '';
  const lastName = data.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';
  
  // 🔥 Extraire le rating
  const ratingValue = data.score?.value ?? 0;
  
  // 🔥 Extraire l'email
  const email = typeof data.email === 'string' 
    ? data.email 
    : data.email?.value || '';
  
  // 🔥 Extraire les téléphones
  const phones = Array.isArray(data.phone) 
    ? data.phone.map(p => typeof p === 'string' ? p : p.value || '').filter(Boolean)
    : [];
  
  // 🔥 Extraire le rôle
  const role = data.role || data.user_type || 'fournisseur';
  const userRole = role === 'collector' || role === 'collecteur' ? 'collecteur' : 'fournisseur';
  
  // 🔥 EXTRAIRE LES TYPES DE PRODUCTION - CORRECTION ICI
  const productCategory = data.product_category || [];
  console.log('🔍 transformUserResponse - product_category extrait:', productCategory);
  
  return {
    id: data.id || '',
    name: fullName,
    role: userRole,
    rating: typeof ratingValue === 'number' ? ratingValue : parseFloat(String(ratingValue)) || 0,
    bio: data.description || '',
    avatarUrl: data.avatarUrl || undefined,
    bannerUrl: data.bannerUrl || '/images/auth/champ.jpeg',
    email: email,
    phone: phones,
    reviews: [],
    isOwner: false,
    type: 'particulier',
    product_category: productCategory, // 🔥 AJOUTER CE CHAMP
  };
};