// services/auth/types.ts
export interface TokenOutput {
  refresh_token: string;  
  access_token: string;
}

export interface UserLoginDTO {
  email: string;
  passord: string;  
}

export interface EmailValidationDTO {
  email: string;
  code: string;
}