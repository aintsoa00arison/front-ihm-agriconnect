// services/hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../auth/authService';
import type { UserLoginDTO } from '../auth/types';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null);

  // Fonction pour décoder le token JWT et extraire le rôle
  const getRoleFromToken = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload.user_role || null;
    } catch {
      return null;
    }
  };

  const login = async (data: UserLoginDTO) => {
    setIsLoading(true);
    try {
      // Note: le backend attend "passord" (faute)
      const loginData = {
        email: data.email,
        passord: data.passord,  // Transformation pour le backend
      };
      
      const response = await authService.login(loginData as any);
      
      // Extraire le rôle depuis le token
      const role = getRoleFromToken(response.access_token);
      
      // Stocker les infos utilisateur
      setUser({ email: data.email, role: role || undefined });
      
      toast.success("Connexion réussie !");
      
      // Redirection basée sur le rôle
      if (role === "collecteur") {
        router.push('/c');
      } else if (role === "fournisseur") {
        router.push('/f');
      } else {
        router.push('/catalogue');
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

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
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