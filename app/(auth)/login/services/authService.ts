// services/authService.ts
import { AuthFormData, VerifyCodeData, AuthResponse, ActionResponse } from "../types/auth";

// 1. Simuler la connexion (Déjà existant)
export async function mockLoginService(credentials: AuthFormData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const { email, password } = credentials;

  if (email === "crash@agriconnect.mg") {
    throw new Error("Erreur 500 : Le serveur ne répond pas.");
  }
  if (password !== "password123") {
    return { success: false, message: "Le mot de passe saisi est incorrect." };
  }
  if (email === "fournisseur@agriconnect.mg") {
    return { success: true, user: { id: "usr_fourn_01", email, role: "fournisseur" } };
  }
  if (email === "collecteur@agriconnect.mg") {
    return { success: true, user: { id: "usr_coll_02", email, role: "collecteur" } };
  }
  return { success: false, message: "Aucun compte associé à cette adresse email." };
}

// 2. NOUVEAU : Simuler la demande d'envoi de mail (génération du code par le back)
export async function sendVerificationEmail(email: string): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Latence réseau

  if (email === "crash@agriconnect.mg") {
    throw new Error("Erreur 500 : Impossible d'envoyer l'email de vérification.");
  }

  return {
    success: true,
    message: `Un code de vérification a été généré et envoyé à l'adresse : ${email}`,
  };
}

// 3. NOUVEAU : Simuler la validation du code entré par l'utilisateur
export async function verifyCodeService(data: VerifyCodeData): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const { email, code } = data;

  // Code de test fixe
  if (code !== "AGRI2026") {
    return {
      success: false,
      message: "Le code de vérification est incorrect ou a expiré.",
    };
  }

  return {
    success: true,
    message: "Le code est valide. Votre adresse email a été confirmée.",
  };
}