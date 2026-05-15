// types/auth.ts

export interface AuthFormData {
  email: string;
  password?: string;
}

// Nouvelle interface pour la vérification du code
export interface VerifyCodeData {
  email: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: 'producteur' | 'collecteur';
  };
}
// Brouillon d'inscription conservé de manière sécurisée en RAM côté Front-End
export interface RegisterDraft {
  email: string;
  password?: string;
  code?: string; 
}
// Réponse classique pour les actions intermédiaires (envoi de mail, validation de code)
export interface ActionResponse {
  success: boolean;
  message: string;
}