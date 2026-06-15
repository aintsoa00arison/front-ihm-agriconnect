// lib/auth.ts

export interface DecodedToken {
  sub: string;
  user_type?: string;
  role?: string;
  exp: number;
  iat: number;
  email?: string;
}

// Vérifier si on est côté client
const isBrowser = (): boolean => typeof window !== 'undefined';

// Décoder le token JWT
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Erreur décodage token:", error);
    return null;
  }
};

// Récupérer les informations utilisateur depuis le token
export const getUserFromToken = () => {
  if (!isBrowser()) return null;
  
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    userType: decoded.user_type || decoded.role || null,
    email: decoded.email || null,
    exp: decoded.exp,
  };
};

// Récupérer l'ID utilisateur
export const getUserId = (): string | null => {
  if (!isBrowser()) return null;
  return getUserFromToken()?.id || null;
};

// Récupérer le rôle utilisateur (priorité au token, puis localStorage)
export const getUserRole = (): string | null => {
  if (!isBrowser()) return null;
  
  const user = getUserFromToken();
  
  // Si le token contient le user_type, l'utiliser
  if (user?.userType) {
    return user.userType;
  }
  
  // Sinon, utiliser la valeur stockée dans localStorage
  return localStorage.getItem('user_role');
};

// Sauvegarder le rôle (solution temporaire)
export const setUserRole = (role: string) => {
  if (!isBrowser()) return;
  localStorage.setItem('user_role', role);
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  if (!isBrowser()) return false;
  
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Vérifier si le token n'est pas expiré
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
};

// Récupérer l'email utilisateur
export const getUserEmail = (): string | null => {
  if (!isBrowser()) return null;
  return getUserFromToken()?.email || null;
};

// Déduire le rôle à partir de l'email (solution temporaire)
export const deduceRoleFromEmail = (email: string): string | null => {
  const cleanEmail = email.toLowerCase();
  if (cleanEmail.includes("collecteur") || cleanEmail.includes("collector")) {
    return "collector";
  }
  if (cleanEmail.includes("fournisseur") || cleanEmail.includes("provider")) {
    return "fournisseur";
  }
  return null;
};

// Sauvegarder les informations du profil
export const saveProfileInfo = (data: { name?: string; bio?: string; avatarUrl?: string }) => {
  if (!isBrowser()) return;
  if (data.name) localStorage.setItem('profile_name', data.name);
  if (data.bio) localStorage.setItem('profile_bio', data.bio);
  if (data.avatarUrl) localStorage.setItem('profile_avatar', data.avatarUrl);
};

// Récupérer les informations du profil sauvegardées
export const getProfileInfo = () => {
  if (!isBrowser()) return { name: null, bio: null, avatarUrl: null };
  return {
    name: localStorage.getItem('profile_name'),
    bio: localStorage.getItem('profile_bio'),
    avatarUrl: localStorage.getItem('profile_avatar'),
  };
};

// Déconnexion complète
export const logout = () => {
  if (!isBrowser()) return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('profile_name');
  localStorage.removeItem('profile_bio');
  localStorage.removeItem('profile_avatar');
  localStorage.removeItem('profile_type');
  document.cookie = 'access_token=; path=/; max-age=0';
};