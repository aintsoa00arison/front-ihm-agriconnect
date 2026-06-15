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
} as const;