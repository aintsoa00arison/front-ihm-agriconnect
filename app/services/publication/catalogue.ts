// types/catalogue.ts

export interface Author {
  id: string;
  pseudonyme?: string;  // ⭐ AJOUTÉ
  name: string;
  rating: number;
  avatar: string;
  location: string;
  productionType: string;
}

export interface Ad {
  id: string;
  title: string;
  timeAgo: string;
  price: number;
  unit: string;
  quantity: string;
  location: string;
  productionType: string;
  description: string;
  image: string;
  author: Author;
  // 🔥 Nouveaux champs
  type?: 'Vente' | 'Demande'; // Type d'annonce
  sender_id?: string; // ID de l'auteur
  sender_type?: 'fournisseur' | 'collecteur' | string; // Type de l'auteur
}

// services/publication/catalogue.ts

export interface Supplier {
  id: string;
  pseudonyme?: string;  // ⭐ Ajouté
  name: string;
  location: string;
  productionType: string;
  rating: number;
  avatar: string;
}

export type UserRole = "fournisseur" | "collecteur";