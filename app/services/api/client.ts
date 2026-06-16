// services/api/client.ts
"use client"; // 🔥 Ajouter "use client" en haut

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 🔥 Vérifier si on est côté client
const isBrowser = typeof window !== 'undefined';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 🔥 Fonction utilitaire pour récupérer le token en toute sécurité
const getToken = (): string | null => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

// 🔥 Fonction utilitaire pour stocker le token en toute sécurité
const setToken = (token: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('access_token', token);
  } catch (error) {
    console.error('Erreur lors du stockage du token:', error);
  }
};

// 🔥 Fonction utilitaire pour supprimer le token en toute sécurité
const removeToken = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem('access_token');
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
  }
};

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use(
  (config) => {
    // 🔥 Vérifier si on est côté client
    if (isBrowser) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Erreur intercepteur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 🔥 Vérifier si on est côté client
    if (!isBrowser) {
      return Promise.reject(error);
    }
    
    // 🔥 Vérifier si c'est une erreur 401 et qu'on n'a pas déjà tenté le refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const accessToken = getToken();
        if (!accessToken) {
          // Pas de token, rediriger vers login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        console.log('🔄 Tentative de refresh token...');
        const response = await apiClient.post('/auth/refresh', {
          access_token: accessToken,
        });
        
        const { access_token } = response.data;
        if (access_token) {
          setToken(access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          console.log('✅ Token rafraîchi avec succès');
          return apiClient(originalRequest);
        } else {
          throw new Error('Aucun token reçu lors du refresh');
        }
      } catch (refreshError) {
        console.error('❌ Échec du refresh token:', refreshError);
        // Supprimer le token et rediriger vers login
        removeToken();
        if (isBrowser) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // 🔥 Gérer les autres erreurs
    if (error.response?.status === 403) {
      console.warn('⛔ Accès refusé (403)');
      if (isBrowser) {
        // Optionnel: rediriger vers une page d'accès refusé
        // window.location.href = '/forbidden';
      }
    }
    
    if (error.message === 'Network Error') {
      console.error('🌐 Erreur réseau - Vérifiez que le serveur est en cours d\'exécution');
    }
    
    return Promise.reject(error);
  }
);

// 🔥 Exporter des utilitaires pour une utilisation externe
export const apiUtils = {
  getToken,
  setToken,
  removeToken,
  isBrowser,
};