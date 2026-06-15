// lib/auth.ts
import { decodeToken } from '../auth/authService';

export interface DecodedToken {
  sub: string;
  user_type?: string;
  role?: string;
  exp: number;
  iat: number;
  email?: string;
}

export const getUserFromToken = () => {
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

export const getUserId = (): string | null => {
  return getUserFromToken()?.id || null;
};

export const getUserRole = (): string | null => {
  // 🔥 D'abord vérifier dans localStorage
  const storedRole = localStorage.getItem('user_role');
  if (storedRole) return storedRole;
  
  // Sinon, extraire du token
  const user = getUserFromToken();
  if (user?.userType) {
    // Stocker pour la prochaine fois
    localStorage.setItem('user_role', user.userType);
    return user.userType;
  }
  
  return null;
};

export const setUserRole = (role: string) => {
  localStorage.setItem('user_role', role);
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
};

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

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('profile_name');
  localStorage.removeItem('profile_bio');
  localStorage.removeItem('profile_avatar');
  localStorage.removeItem('profile_type');
  document.cookie = 'access_token=; path=/; max-age=0';
};