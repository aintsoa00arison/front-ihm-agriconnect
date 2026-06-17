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
  PUBLICATION_UPDATE: '/publication/{publication_id}',
  PUBLICATION_DELETE: '/publication/{publication_id}',
  PUBLICATION_ALL: '/publication/all/{user_id}',
  PUBLICATION_USER: '/publication/user/{user_id}',
  PUBLICATION_FILTERED: '/publication/filtered/{user_id}',
  PUBLICATION_PROVIDER_ALL: '/publication/provider/all',
  PUBLICATION_COLLECTOR_ALL: '/publication/collector/all',

  // User / Profile
  USER_GET: '/user/{user_id}',
  USER_ALL: '/user/all',
  USER_TOP_PROVIDERS: '/user/top/providers',
  USER_TOP_COLLECTORS: '/user/top/collectors',
  USER_UPDATE_INDIVIDUAL: '/user/individual',
  USER_UPDATE_ENTREPRISE: '/user/entreprise',
  USER_SEARCH: '/user/name/{name}',

  // Evaluation
  EVALUATION_CREATE: '/evaluation/create',
  EVALUATION_UPDATE: '/evaluation/update',
  EVALUATION_DELETE: '/evaluation/delete/{evaluation_id}',
  EVALUATION_ALL: '/evaluation/all/{user_id}',
  EVALUATION_TOP: '/evaluation/top/{user_id}',
  EVALUATION_BOTTOM: '/evaluation/bottom/{user_id}',

  // ⭐ Invitation
  INVITATION_CREATE: '/invitation/create',
  INVITATION_ACCEPT: '/invitation/accept/{user_id}',
  INVITATION_REFUSE: '/invitation/refuse/{user_id}',
  INVITATION_LIST: '/invitation/{user_id}',
} as const;