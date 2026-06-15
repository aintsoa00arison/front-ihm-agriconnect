// services/hooks/useRegister.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerService } from '../register/registerService';
import { useRegisterStore } from '../register/store/registerStore';
import { authService } from '../auth/authService';

export const useRegister = () => {
  const router = useRouter();
  const { registerDraft } = useRegisterStore();
  const [isLoading, setIsLoading] = useState(false);

  // Envoyer le code de vérification
  const sendVerificationCode = async (email: string): Promise<boolean> => {
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

  // Vérifier le code
  const verifyCode = async (email: string, code: string): Promise<boolean> => {
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
      toast.error(error.response?.data?.detail || "Code invalide");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Finaliser l'inscription du collecteur
  const registerCollector = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { email, password, code } = registerDraft;
      
      if (!email || !password || !code) {
        toast.error("Données d'inscription manquantes");
        return false;
      }

      const collectorData = registerService.prepareCollectorData(registerDraft);
      if (!collectorData) {
        toast.error("Données du formulaire incomplètes");
        return false;
      }

      const response = await registerService.registerCollector(
        collectorData,
        email,
        password,
        code
      );

      if (response.success) {
        toast.success(response.message);
        router.push('/login');
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Finaliser l'inscription du fournisseur
  const registerFournisseur = async (bio?: string, photo?: File | string | null): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { email, password, code, type } = registerDraft;
      
      if (!email || !password || !code || !type) {
        toast.error("Données d'inscription manquantes");
        return false;
      }

      const fournisseurData = registerService.prepareFournisseurData(registerDraft);
      if (!fournisseurData) {
        toast.error("Données du formulaire incomplètes");
        return false;
      }

      let response;
      if (type === "entreprise") {
        response = await registerService.registerEntrepriseProvider(
          fournisseurData,
          email,
          password,
          code,
          bio,
          photo
        );
      } else {
        response = await registerService.registerIndividualProvider(
          fournisseurData,
          email,
          password,
          code,
          bio,
          photo
        );
      }

      if (response.success) {
        toast.success(response.message);
        router.push('/login');
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    registerCollector,
    registerFournisseur,
    isLoading,
  };
};