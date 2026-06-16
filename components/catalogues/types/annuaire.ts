// app/catalogue/types/annuaire.ts

export type UserRole = "fournisseurs" | "collecteurs";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  type: string;
  rating: number;
  avatar: string;
  description?: string;
}

export interface FilterState {
  location: string; // Gardé pour compatibilité mais non utilisé
  type: string;
  rating: string;
}