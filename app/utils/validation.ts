// utils/validation.ts

export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,         // 10 chiffres (Madagascar)
  nif: /^\d{10}$/,           // 10 chiffres
  cin: /^\d{12}$/,           // 12 chiffres
  stat: /^.{5,}$/            // Minimum 5 caractères (ajustable selon tes besoins)
};

export const validateEmail = (email: string): boolean => 
  email === '' || REGEX_PATTERNS.email.test(email);

export const validatePhone = (phone: string): boolean => 
  phone === '' || REGEX_PATTERNS.phone.test(phone);

export const validateNif = (nif: string): boolean => 
  nif === '' || REGEX_PATTERNS.nif.test(nif);

export const validateCin = (cin: string): boolean => 
  cin === '' || REGEX_PATTERNS.cin.test(cin);

export const validateStat = (stat: string): boolean => 
  stat === '' || REGEX_PATTERNS.stat.test(stat.trim());