// services/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService, getRoleFromToken } from '../auth/authService';
import type { UserLoginDTO } from '../auth/types';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null);

  // Vérifier le token au montage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const role = getRoleFromToken(token);
      if (role) {
        setUser({ email: '', role });
      }
    }
  }, []);

const login = async (data: UserLoginDTO) => {
  console.log("🔵 useAuth.login appelé avec:", data); // Debug
  setIsLoading(true);
  try {
    const response = await authService.login({
      email: data.email,
      password: data.password,
    });
    console.log("🔵 Réponse reçue:", response); // Debug
    console.log("Réponse login:", response);
    console.log("Access token:", response.access_token);
    
    // Extraire le rôle depuis le token
    const role = getRoleFromToken(response.access_token);
    
    console.log("Rôle extrait:", role);
    // Redirection basée sur le rôle - avec les bonnes valeurs
    if (role === "collector") {  // "collector" et non "collecteur"
      router.push('/c');
    } else if (role === "fournisseur" || role === "provider") {  // "fournisseur" ou "provider"
      router.push('/f');
    } else {
      console.warn("Rôle inconnu, redirection vers la page d'accueil");
    }
    
    return { success: true, user: response, role };

    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.response?.data?.detail || "Email ou mot de passe incorrect");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authService.sendVerificationEmail(email);
      if (response.success) {
        toast.success(response.message);
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'envoi du code");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyCode({ email, code });
      if (response.success) {
        toast.success(response.message);
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de la vérification");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success("Déconnecté avec succès");
    router.push('/');
  };

  const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  };

  return {
    login,
    sendVerificationEmail,
    verifyCode,
    logout,
    isLoading,
    user,
    isAuthenticated: isAuthenticated(),
  };
};