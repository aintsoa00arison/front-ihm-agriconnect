// register/types.ts

export type RoleType = 'fournisseur' | 'collecteur';
export type ProductionType = 'Végétale' | 'Elevage' | 'Rente';
export type FournisseurType = 'particulier' | 'entreprise';

/**
 * Structure de données plate du store d'inscription Tsena
 * Calquée exactement sur les inputs de CollectorForm et FournisseurForm
 */
export interface RegisterStoreData {
  // --- Étape 1 : Identifiants (AuthForm) ---
  email?: string;
  password?: string;
  code?: string;

  // --- Étape 2 : Choix du Rôle & États des Formulaires ---
  role?: RoleType;        // 'fournisseur' ou 'collecteur'
  type?: FournisseurType; // 'particulier' ou 'entreprise' (pour fournisseur)

  // 1. Inputs du Collecteur (CollectorForm)
  raisonSociale?: string;
  siegeSocial?: string;
  telephonePro?: string;
  emailPro?: string;
  nif?: string;
  stat?: string;
  nomComplet?: string;         // Représentant légal collecteur
  telephoneDirect?: string;    // Représentant légal collecteur
  cin?: string;                // Représentant légal collecteur
  besoins?: string[];          // Tableau ['Végétale', 'Elevage'...]

  // 2. Inputs du Fournisseur - Entreprise (FournisseurForm)
  nomEntite?: string;
  localisationEntite?: string;
  contactExploitation?: string;
  emailContact?: string;
  // Note: nif et stat sont déjà déclarés au-dessus (communs aux entreprises)
  nomResponsable?: string;
  telephoneResponsable?: string;
  cinResponsable?: string;

  // 3. Inputs du Fournisseur - Particulier (FournisseurForm)
  nomParticulier?: string;
  telephoneParticulier?: string;
  cinParticulier?: string;
  localisationParticulier?: string;

  // 4. Commun aux Fournisseurs
  productions?: string[];      // Tableau ['Végétale', 'Elevage'...]

  // --- Étape 3 : Finition du Profil ---
  bio?: string;
  photo?: File | string | null;
}