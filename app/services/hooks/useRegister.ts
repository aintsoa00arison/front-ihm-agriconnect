import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerService } from '../register/registerService';
import { useRegisterStore } from '../register/store/registerStore';
import { authService } from '../auth/authService';
import { IndividualProviderPayload, EntrepriseProviderPayload } from '../register/types/payloads';

export const useRegister = () => {
  const router = useRouter();
  const { registerDraft } = useRegisterStore();
  const [isLoading, setIsLoading] = useState(false);

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

  const registerCollector = async (): Promise<{ success: boolean; userId?: string }> => {
    console.log("🔵 registerCollector - === DÉBUT ===");
    setIsLoading(true);
    try {
      const { email, password } = registerDraft;
      console.log("🔵 email:", email);
      console.log("🔵 password:", password ? "***" : "MANQUANT");
      
      if (!email || !password) {
        console.warn("⚠️ Données manquantes:", { email: !!email, password: !!password });
        toast.error("Données d'inscription manquantes");
        return { success: false };
      }

      const payload = registerService.prepareCollectorData(registerDraft);
      console.log("🔵 payload préparé:", JSON.stringify(payload, null, 2));
      
      if (!payload) {
        toast.error("Données du formulaire incomplètes");
        return { success: false };
      }

      const response = await registerService.registerCollector(payload, email, password);
      console.log("🔵 Réponse reçue:", response);
      
      if (response.success) {
        toast.success(response.message);
        console.log("🔵 userId retourné:", response.userId);
        return { success: true, userId: response.userId };
      } else {
        toast.error(response.message);
        return { success: false };
      }
    } catch (error: any) {
      console.error("🔴 Erreur inscription collecteur:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const registerFournisseur = async (bio?: string, photo?: File | string | null): Promise<{ success: boolean; userId?: string }> => {
    console.log("🔵 registerFournisseur - === DÉBUT ===");
    setIsLoading(true);
    try {
      const { email, password, type } = registerDraft;
      
      if (!email || !password || !type) {
        console.warn("⚠️ Données manquantes:", { email: !!email, password: !!password, type: !!type });
        toast.error("Données d'inscription manquantes");
        return { success: false };
      }

      const fournisseurData = registerService.prepareFournisseurData(registerDraft);
      console.log("🔵 fournisseurData préparé:", JSON.stringify(fournisseurData, null, 2));
      
      if (!fournisseurData) {
        toast.error("Données du formulaire incomplètes");
        return { success: false };
      }

      let response: { success: boolean; message: string; userId?: string };
      
      if (type === "entreprise") {
        console.log("🔵 Appel registerEntrepriseProvider");
        response = await registerService.registerEntrepriseProvider(
          fournisseurData as EntrepriseProviderPayload,
          email,
          password,
          bio,
          photo
        );
      } else {
        console.log("🔵 Appel registerIndividualProvider");
        response = await registerService.registerIndividualProvider(
          fournisseurData as IndividualProviderPayload,
          email,
          password,
          bio,
          photo
        );
      }

      console.log("🔵 Réponse reçue:", response);
      
      if (response.success) {
        toast.success(response.message);
        console.log("🔵 userId retourné:", response.userId);
        return { success: true, userId: response.userId };
      } else {
        toast.error(response.message);
        return { success: false };
      }
    } catch (error: any) {
      console.error("🔴 Erreur inscription fournisseur:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
      return { success: false };
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