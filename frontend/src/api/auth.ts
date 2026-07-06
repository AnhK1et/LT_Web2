import api from './axios';
import type { ApiResponse, AuthResponse, User } from '@/types';

export type { AuthResponse };

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),
  
  logout: () =>
    api.post<ApiResponse<void>>('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }),
  
  getProfile: () =>
    api.get<ApiResponse<User>>('/auth/profile'),
  
  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<User>>('/auth/profile', data),
  
  changePassword: (data: ChangePasswordRequest) =>
    api.put<ApiResponse<void>>('/auth/change-password', data),
};
