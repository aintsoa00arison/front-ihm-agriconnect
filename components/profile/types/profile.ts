export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string; // 👈 Harmonisé ici pour correspondre au reste de l'application
  rating: number;
  comment: string;
  date: string;
}

export interface LegalRepresentative {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string; 
  role: "fournisseur" | "collecteur";
  rating: number;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  
  // Infos détaillées de l'onglet "À propos"
  representative: LegalRepresentative;
  company: CompanyInfo;
  productionTypes: string[]; 
  
  // Données pour l'onglet "Avis"
  reviews: Review[];
}