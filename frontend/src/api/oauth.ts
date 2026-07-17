import api from './axios';
import type { ApiResponse, AuthResponse } from '@/types';

export interface SocialAuthRequest {
  provider: string;
  accessToken?: string;
  idToken?: string;
}

export const oauthApi = {
  google: (data: { idToken: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/social/google', data),

  facebook: (data: { accessToken: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/social/facebook', data),
};

export const googleLogin = async (data: { idToken: string }) => {
  const response = await oauthApi.google(data);
  return response.data.data;
};

export const facebookLogin = async (data: { accessToken: string }) => {
  const response = await oauthApi.facebook(data);
  return response.data.data;
};
