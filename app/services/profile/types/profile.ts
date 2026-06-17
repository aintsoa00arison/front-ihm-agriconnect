// services/profile/types/profile.ts

// services/profile/types/profile.ts

export interface ProfileData {
  id: string;
  name: string;
  pseudonyme?: string;  // ⭐ Ajouté
  role: "fournisseur" | "collecteur";
  rating: number | null;
  bio: string;
  avatarUrl?: string;
  photo?: string;
  bannerUrl?: string;
  email?: string;
  phone?: string[];
  reviews?: any[];
  isOwner?: boolean;
  type?: 'particulier' | 'entreprise';
  product_category?: string[];
 
  legal_name?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  user_type?: string;
  registered_office?: string;
  nif?: string;
  stat?: string;
  rep_first_name?: string;
  rep_last_name?: string;
  company_description?: string;
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
  product_category?: string[];
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
  // ⭐ Support de plusieurs formats pour la photo
  photo?: string | { value: string } | { url: string } | null;
  bannerUrl?: string;
  // 🔥 Champs pour les fournisseurs entreprise
  legal_name?: string;
  registered_office?: string;
  nif?: {
    value: string;
  };
  stat?: {
    value: string;
  };
  rep_first_name?: string;
  rep_last_name?: string;
  rep_cin_number?: {
    value: string;
  };
  company_description?: string;
  [key: string]: any;
}

// ⭐ Fonction helper pour extraire la photo
const extractPhotoUrl = (photo: any): string | null => {
  if (!photo) return null;
  
  // Si c'est une chaîne, la retourner directement
  if (typeof photo === 'string') {
    return photo;
  }
  
  // Si c'est un objet avec value
  if (typeof photo === 'object' && photo !== null) {
    if ('value' in photo && typeof photo.value === 'string') {
      return photo.value;
    }
    if ('url' in photo && typeof photo.url === 'string') {
      return photo.url;
    }
  }
  
  return null;
};

export const transformUserResponse = (data: UserResponse): ProfileData => {
  console.log('🔄 transformUserResponse - Données reçues:', JSON.stringify(data, null, 2));
  
  // 🔥 Extraire le nom selon le type d'utilisateur
  let displayName = '';
  let isProvider = false;
  
  // Vérifier si c'est un fournisseur entreprise (a legal_name)
  if (data.legal_name) {
    displayName = data.legal_name;
    isProvider = true;
  } else {
    // Collecteur ou fournisseur particulier : utiliser first_name + last_name
    const firstName = data.first_name || '';
    const lastName = data.last_name || '';
    displayName = `${firstName} ${lastName}`.trim() || 'Utilisateur';
  }
  
  console.log('🔍 transformUserResponse - Nom affiché:', displayName);
  console.log('🔍 transformUserResponse - isProvider:', isProvider);
  
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
  const role = data.role || data.user_type || (isProvider ? 'fournisseur' : 'collecteur');
  const userRole = role === 'collector' || role === 'collecteur' ? 'collecteur' : 'fournisseur';
  
  // 🔥 Extraire les types de production
  const productCategory = data.product_category || [];
  
  // 🔥 Extraire la description
  const description = data.description || data.company_description || '';
  
  // 🔥 Extraire l'adresse
  const address = data.address || data.registered_office || '';
  
  // 🔥 Extraire le CIN
  const cinNumber = data.cin_number?.value || data.rep_cin_number?.value || '';
  
  // ⭐⭐⭐ EXTRAIRE LA PHOTO ⭐⭐⭐
  const photoUrl = extractPhotoUrl(data.photo);
  
  console.log('📸 transformUserResponse - Photo extraite:', photoUrl);
  
  return {
    id: data.id || '',
    name: displayName,
    role: userRole,
    rating: typeof ratingValue === 'number' ? ratingValue : parseFloat(String(ratingValue)) || 0,
    bio: description,
    avatarUrl: photoUrl || undefined,
    photo: photoUrl || undefined,
    bannerUrl: data.bannerUrl || '/images/auth/champ.jpeg',
    email: email,
    phone: phones,
    reviews: [],
    isOwner: false,
    type: isProvider ? 'entreprise' : 'particulier',
    product_category: productCategory,
    // 🔥 Stocker les données supplémentaires pour les composants
    legal_name: data.legal_name,
    company_name: data.legal_name,
    first_name: data.first_name,
    last_name: data.last_name,
    user_type: data.user_type,
    registered_office: data.registered_office,
    nif: data.nif?.value,
    stat: data.stat?.value,
    rep_first_name: data.rep_first_name,
    rep_last_name: data.rep_last_name,
    company_description: data.company_description,
  };
};