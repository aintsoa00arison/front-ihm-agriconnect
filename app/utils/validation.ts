export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,          // 10 chiffres (Madagascar)
  nif: /^\d{10}$/,            // 10 chiffres
  cin: /^\d{11}[1-2]$/,       // 12 chiffres et  doit se terminer par 1 ou 2 au total, le dernier est obligatoirement 1 ou 2
  stat: /^.{5,}$/             // Minimum 5 caractères
};

// --- FONCTIONS DE FORMATAGE EN TEMPS RÉEL (À utiliser dans tes onChange) ---

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


// --- FONCTIONS DE VALIDATION (Nettoient les espaces avant vérification) ---

export const validateEmail = (email: string): boolean => 
  email === '' || REGEX_PATTERNS.email.test(email.trim());

export const validatePhone = (phone: string): boolean => {
  if (phone === '') return true;
  const cleanPhone = phone.replace(/\s/g, ''); // Enlève les espaces visuels
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

export const validateStat = (stat: string): boolean => 
  stat === '' || REGEX_PATTERNS.stat.test(stat.trim());


// --- ANALYSE PRÉCISE DES ERREURS D'EMAIL ---

/**
 * Analyse un email invalide et retourne un message d'erreur textuel précis.
 */
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