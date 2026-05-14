// types/auth.ts
export interface AuthFormData {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'producteur' | 'collecteur';
}