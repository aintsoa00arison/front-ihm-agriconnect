// types/annuaire.ts
export type TargetRole = "fournisseurs" | "collecteurs";

export interface UserProfile {
  id: string;
  name: string;
  role: TargetRole;
  location: string;
  type: string;
  rating: number;
  avatar: string;
  description: string;
}

export interface FilterState {
  location: string;
  type: string;
  rating: string;
}