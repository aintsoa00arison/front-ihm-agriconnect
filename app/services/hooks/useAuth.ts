import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../auth/authService';
import { 
  getUserRole, 
  setUserRole, 
  deduceRoleFromEmail, 
  logout as authLogout,
  getUserId 
} from '../lib/auth';
import type { UserLoginDTO } from '../auth/types';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string; id?: string } | null>(null);

  useEffect(() => {
    const userId = getUserId();
    const role = getUserRole();
    if (userId) {
      setUser({ email: '', role: role || undefined, id: userId });
    }
  }, []);

  const login = async (data: UserLoginDTO) => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });
      
      let role = getUserRole();
      
      if (!role) {
        role = deduceRoleFromEmail(data.email);
        if (role) {
          setUserRole(role);
        }
      }
      
      setUser({ email: data.email, role: role || undefined, id: response.access_token });
      toast.success("Connexion réussie !");
      
      if (role === "collector") {
        router.push('/c');
      } else if (role === "fournisseur") {
        router.push('/f');
      } else {
        router.push('/catalogue');
      }
      
      return { success: true, role };
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.response?.data?.detail || "Email ou mot de passe incorrect");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (emailOrUserId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.sendVerificationEmail(emailOrUserId);
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

  const verifyCode = async (userId: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.verifyCode(userId, code);
      if (response.success) {
        toast.success(response.message);
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Code invalide");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    toast.success("Déconnecté avec succès");
    router.push('/');
  };

  return {
    login,
    sendVerificationEmail,
    verifyCode,
    logout,
    isLoading,
    user,
  };
};