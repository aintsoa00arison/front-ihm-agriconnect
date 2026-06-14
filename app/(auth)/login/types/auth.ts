// types/auth.ts
export interface AuthFormData {
  email: string;
  password?: string;
}

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
    role: "fournisseur" | "collecteur";
  };
}

export interface RegisterDraft {
  email: string;
  password?: string;
  code?: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
}

export type AuthView = "auth" | "forgot" | "reset";
export type ToastType = "success" | "error" | "info";