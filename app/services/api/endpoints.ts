// services/api/endpoints.ts
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh',
  SEND_VERIFICATION_EMAIL: '/auth/email/send',
  VERIFY_CODE: '/auth/email/validate',
  
  // Register
  REGISTER_COLLECTOR: '/auth/inscription/collector',
  REGISTER_INDIVIDUAL_PROVIDER: '/auth/inscription/provider/individual',
  REGISTER_ENTREPRISE_PROVIDER: '/auth/inscription/provider/entreprise',

  // Publication
  PUBLICATION_CREATE: '/publication/create',
  PUBLICATION_DELETE: '/publication/{publication_id}',
  PUBLICATION_ALL: '/publication/all/{user_id}',
  PUBLICATION_USER: '/publication/user/{user_id}',
  PUBLICATION_FILTERED: '/publication/filtered/{user_id}',
 

  // User / Profile
  USER_GET: '/user/{user_id}',
  USER_UPDATE_INDIVIDUAL: '/user/individual',
  USER_UPDATE_ENTREPRISE: '/user/entreprise',
  USER_SEARCH: '/user/name/{name}',
} as const;