// types/catalogue.ts
export interface Author {
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
}

export interface Supplier {
  name: string;
  location: string;
  productionType: string;
  rating: number;
  avatar: string;
}

export type UserRole = "fournisseur" | "collecteur";