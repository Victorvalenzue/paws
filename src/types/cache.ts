export interface CasheUser {
  apiKey: string;
  createdAt: string;
  lastLoginAt: string;
  stsTokenManager: {
    accessToken: string;
    expirationTime: string;
    refreshToken: string;
  };
  uid: string;
}
