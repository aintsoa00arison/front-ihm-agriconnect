// utils/validation.ts

export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,          // 10 chiffres (Madagascar)
  nif: /^\d{10}$/,            // 10 chiffres
  cin: /^\d{11}[1-2]$/,       // 12 chiffres et doit se terminer par 1 ou 2 au total, le dernier est obligatoirement 1 ou 2
  stat: /^\d{17}$/            // 🔥 17 chiffres exactement (pour le STAT malgache)
};

// --- FONCTIONS DE FORMATAGE EN TEMPS RÉEL ---

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)}`;
};

export const formatCin = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const blocks = [];
  for (let i = 0; i < digits.length && i < 12; i += 3) {
    blocks.push(digits.slice(i, i + 3));
  }
  return blocks.join(" ");
};

// --- FONCTIONS DE VALIDATION ---

export const validateEmail = (email: string): boolean => 
  email === '' || REGEX_PATTERNS.email.test(email.trim());

export const validatePhone = (phone: string): boolean => {
  if (phone === '') return true;
  const cleanPhone = phone.replace(/\s/g, '');
  return REGEX_PATTERNS.phone.test(cleanPhone);
};

export const validateNif = (nif: string): boolean => {
  if (nif === '') return true;
  const cleanNif = nif.replace(/\s/g, '');
  return REGEX_PATTERNS.nif.test(cleanNif);
};

export const validateCin = (cin: string): boolean => {
  if (cin === '') return true;
  const cleanCin = cin.replace(/\s/g, '');
  return REGEX_PATTERNS.cin.test(cleanCin);
};

export const validateStat = (stat: string): boolean => {
  if (stat === '') return true;
  const cleanStat = stat.replace(/\s/g, '');
  return REGEX_PATTERNS.stat.test(cleanStat);
};

// --- ANALYSE PRÉCISE DES ERREURS D'EMAIL ---

export const analyzeEmailError = (email: string): string => {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return "L'adresse email est obligatoire.";
  }
  
  if (!trimmed.includes('@')) {
    return "Il manque le symbole '@' dans votre adresse email.";
  }
  
  const parts = trimmed.split('@');
  
  if (parts[0] === '') {
    return "Il manque la partie locale avant le symbole '@' (ex: 'nom').";
  }
  
  const domainPart = parts[1] || '';
  
  if (!domainPart) {
    return "Veuillez entrer un nom de domaine après le '@' (ex: 'gmail.com').";
  }
  
  if (!domainPart.includes('.')) {
    return "Il manque le point suivi de l'extension dans le domaine (ex: '.com', '.fr').";
  }
  
  const domainSubParts = domainPart.split('.');
  const extension = domainSubParts[domainSubParts.length - 1];
  
  if (!extension || extension.length < 2) {
    return "L'extension après le point est invalide ou trop courte (ex: '.com').";
  }
  
  return "Le format de l'adresse email est invalide.";
};

// ==================== NOUVEAUX AJOUTS ====================

// --- FONCTIONS DE VALIDATION AVEC MESSAGES D'ERREUR ---

export const getPhoneError = (phone: string): string | null => {
  if (!phone) return "Le numéro de téléphone est requis";
  if (!validatePhone(phone)) return "10 chiffres requis";
  return null;
};

export const getEmailError = (email: string): string | null => {
  if (!email) return "L'adresse email est requise";
  if (!validateEmail(email)) return analyzeEmailError(email);
  return null;
};

export const getNifError = (nif: string): string | null => {
  if (!nif) return "Le NIF est requis";
  if (!validateNif(nif)) return "10 chiffres requis";
  return null;
};

export const getCinError = (cin: string): string | null => {
  if (!cin) return "Le CIN est requis";
  if (!validateCin(cin)) return "12 chiffres requis (dernier chiffre 1 ou 2)";
  return null;
};

export const getStatError = (stat: string): string | null => {
  if (!stat) return "Le STAT est requis";
  if (!validateStat(stat)) return "17 chiffres requis";
  return null;
};

export const getRequiredError = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} est requis`;
  return null;
};

// --- VALIDATEUR DE FORMULAIRE ---

export const validateFormField = {
  required: (value: string, fieldName: string): string | null => {
    return getRequiredError(value, fieldName);
  },
  email: (value: string): string | null => {
    if (!value) return "L'adresse email est requise";
    if (!validateEmail(value)) return analyzeEmailError(value);
    return null;
  },
  phone: (value: string): string | null => {
    return getPhoneError(value);
  },
  nif: (value: string): string | null => {
    return getNifError(value);
  },
  cin: (value: string): string | null => {
    return getCinError(value);
  },
  stat: (value: string): string | null => {
    return getStatError(value);
  },
};

// --- FONCTION POUR VALIDER PLUSIEURS CHAMPS À LA FOIS ---

export interface ValidationField {
  value: string;
  validator: (value: string) => string | null;
}

export const validateFields = (fields: Record<string, ValidationField>): Record<string, string | null> => {
  const errors: Record<string, string | null> = {};
  for (const [key, field] of Object.entries(fields)) {
    errors[key] = field.validator(field.value);
  }
  return errors;
};

export const hasErrors = (errors: Record<string, string | null>): boolean => {
  return Object.values(errors).some(error => error !== null);
};

// --- FONCTION POUR VALIDER UN CHAMP SELON SON TYPE ---

export const validateField = (
  value: string,
  type: "required" | "email" | "phone" | "nif" | "cin" | "stat",
  fieldName?: string
): string | null => {
  switch (type) {
    case "required":
      return validateFormField.required(value, fieldName || "Ce champ");
    case "email":
      return validateFormField.email(value);
    case "phone":
      return validateFormField.phone(value);
    case "nif":
      return validateFormField.nif(value);
    case "cin":
      return validateFormField.cin(value);
    case "stat":
      return validateFormField.stat(value);
    default:
      return null;
  }
};