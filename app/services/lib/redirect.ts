// lib/redirect.ts
import { getUserRole } from './auth';

export const getRedirectPath = (): string => {
  const role = getUserRole();
  
  if (role === "collector" || role === "collecteur") {
    return '/c';
  } else if (role === "fournisseur" || role === "provider") {
    return '/f';
  }
  return '/catalogue';
};

export const redirectToRoleBasedPage = (router: any) => {
  const path = getRedirectPath();
  router.push(path);
};