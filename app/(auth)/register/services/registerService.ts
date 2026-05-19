// services/registerService.ts

// Importation de ton interface centralisée
import { RegisterStoreData } from '../types'; 

interface RegisterResponse {
  success: boolean;
  message: string;
}

/**
 * REQUÊTE 1 : Vérifie si l'email existe déjà (Appelé à l'Étape 1 dans AuthForm)
 */
export const checkEmailAvailability = async (email: string): Promise<{ available: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulation d'un email déjà pris dans Django
      if (email.toLowerCase() === "deja-pris@exemple.com") {
        resolve({
          available: false,
          message: "Cette adresse email est déjà associée à un compte Tsena."
        });
      } else {
        resolve({
          available: true,
          message: "Email disponible."
        });
      }
    }, 1000);
  });
};

/**
 * REQUÊTE 2 : Soumission finale (Appelé à l'Étape 3 dans RegisterPage)
 * On utilise directement ton type global 'RegisterStoreData' comme structure de payload
 */
export const registerAccountService = async (payload: RegisterStoreData): Promise<RegisterResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Log pour vérifier que la structure plate de ton type arrive complète
        console.log("Payload reçu par le service d'inscription :", payload);

        // Tous les champs requis étant gérés en amont par le HTML, on simule une validation directe
        resolve({
          success: true,
          message: "Votre compte a été créé avec succès."
        });
      } catch (error: any) {
        resolve({
          success: false,
          message: error?.message || "Une erreur technique est survenue lors de l'envoi."
        });
      }
    }, 2000);
  });
};