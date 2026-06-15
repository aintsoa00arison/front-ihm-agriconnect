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
    setIsLoading(true);
    try {
      const { email, password } = registerDraft;
      if (!email || !password) {
        toast.error("Données d'inscription manquantes");
        return { success: false };
      }

      const payload = registerService.prepareCollectorData(registerDraft);
      if (!payload) {
        toast.error("Données du formulaire incomplètes");
        return { success: false };
      }

      const response = await registerService.registerCollector(payload, email, password);
      return response;
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const registerFournisseur = async (bio?: string, photo?: File | string | null): Promise<{ success: boolean; userId?: string }> => {
    console.log("🔵 registerFournisseur - === DÉBUT ===");
    console.log("🔵 bio:", bio);
    console.log("🔵 photo:", photo ? "présente" : "absente");
    console.log("🔵 registerDraft:", JSON.stringify(registerDraft, null, 2));
    
    setIsLoading(true);
    try {
      const { email, password, type } = registerDraft;
      
      console.log("🔵 email:", email);
      console.log("🔵 password:", password ? "***" : "MANQUANT");
      console.log("🔵 type:", type);
      
      if (!email || !password || !type) {
        console.error("🔴 Données manquantes:", { email: !!email, password: !!password, type: !!type });
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
        if (!('legal_name' in fournisseurData)) {
          toast.error("Données entreprise invalides");
          return { success: false };
        }
        response = await registerService.registerEntrepriseProvider(
          fournisseurData as EntrepriseProviderPayload,
          email,
          password,
          bio,
          photo
        );
      } else {
        console.log("🔵 Appel registerIndividualProvider");
        if (!('last_name' in fournisseurData)) {
          toast.error("Données particulier invalides");
          return { success: false };
        }
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
        return { success: true, userId: response.userId };
      } else {
        toast.error(response.message);
        return { success: false };
      }
    } catch (error: any) {
      console.error("🔴 Erreur inscription fournisseur:", error);
      console.error("🔴 Détails erreur:", error.response?.data);
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