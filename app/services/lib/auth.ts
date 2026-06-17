// lib/auth.ts
"use client";

import { decodeToken } from '../auth/authService';

export interface DecodedToken {
  sub: string;
  user_type?: string;
  role?: string;
  exp: number;
  iat: number;
  email?: string;
}

const isBrowser = typeof window !== 'undefined';

export const getUserFromToken = () => {
  if (!isBrowser) {
    return null;
  }
  
  try {
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
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

export const getUserId = (): string | null => {
  if (!isBrowser) {
    return null;
  }
  
  try {
    const user = getUserFromToken();
    return user?.id || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    return null;
  }
};

// ⭐ NOUVELLE FONCTION : Normaliser le rôle
export const normalizeRole = (role: string | null): string | null => {
  if (!role) return null;
  
  const normalized = role.toLowerCase();
  
  // 🔥 Mapping des rôles
  if (normalized === 'fournisseur' || normalized === 'provider' || normalized === 'supplier') {
    return 'fournisseur';
  }
  
  if (normalized === 'collecteur' || normalized === 'collector') {
    return 'collecteur';
  }
  
  if (normalized === 'admin') {
    return 'admin';
  }
  
  if (normalized === 'worker') {
    return 'worker';
  }
  
  return normalized;
};

export const getUserRole = (): string | null => {
  if (!isBrowser) {
    return null;
  }
  
  try {
    // D'abord vérifier dans localStorage
    const storedRole = localStorage.getItem('user_role');
    if (storedRole) {
      // ⭐ Normaliser le rôle stocké
      return normalizeRole(storedRole);
    }
    
    // Sinon, extraire du token
    const user = getUserFromToken();
    if (user?.userType) {
      const normalized = normalizeRole(user.userType);
      // Stocker pour la prochaine fois
      if (normalized) {
        localStorage.setItem('user_role', normalized);
      }
      return normalized;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    return null;
  }
};

// ⭐ NOUVELLE FONCTION : Vérifier si l'utilisateur est un fournisseur
export const isProvider = (): boolean => {
  const role = getUserRole();
  return role === 'fournisseur';
};

// ⭐ NOUVELLE FONCTION : Vérifier si l'utilisateur est un collecteur
export const isCollector = (): boolean => {
  const role = getUserRole();
  return role === 'collecteur';
};

export const setUserRole = (role: string) => {
  if (!isBrowser) return;
  
  try {
    // ⭐ Normaliser avant de stocker
    const normalized = normalizeRole(role);
    if (normalized) {
      localStorage.setItem('user_role', normalized);
    }
  } catch (error) {
    console.error('Erreur lors du stockage du rôle:', error);
  }
};

export const isAuthenticated = (): boolean => {
  if (!isBrowser) {
    return false;
  }
  
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};

export const deduceRoleFromEmail = (email: string): string | null => {
  if (!email) return null;
  
  const cleanEmail = email.toLowerCase();
  if (cleanEmail.includes("collecteur") || cleanEmail.includes("collector")) {
    return "collecteur";
  }
  if (cleanEmail.includes("fournisseur") || cleanEmail.includes("provider")) {
    return "fournisseur";
  }
  return null;
};

export const isUUID = (str: string): boolean => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const logout = () => {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('profile_name');
    localStorage.removeItem('profile_bio');
    localStorage.removeItem('profile_avatar');
    localStorage.removeItem('profile_type');
    document.cookie = 'access_token=; path=/; max-age=0';
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

export const getToken = (): string | null => {
  if (!isBrowser) return null;
  
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

export const setToken = (token: string): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem('access_token', token);
  } catch (error) {
    console.error('Erreur lors du stockage du token:', error);
  }
};