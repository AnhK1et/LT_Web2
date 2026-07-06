import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { useAuthStore } from '@/store';
import { STORAGE_KEYS, USER_ROLES } from '@/constants';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/api/auth';
import Swal from 'sweetalert2';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, setUser, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const payload = {
        email: data.email.trim(),
        password: data.password,
      };
      console.log('[useAuth] login payload:', payload);
      const response = await authApi.login(payload);
      console.log('[useAuth] login raw response:', response);
      console.log('[useAuth] login response.data:', response.data);
      return response.data;
    },
    onSuccess: (response) => {
      console.log('[useAuth] login onSuccess response:', response);

      const data = response?.data;
      if (!data?.accessToken || !data?.user) {
        console.error('[useAuth] Invalid login payload:', data);
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: 'Phản hồi đăng nhập không hợp lệ',
        });
        return;
      }

      const { accessToken, refreshToken, user: userData } = data;

      // Transform user data to match frontend types
      const transformedUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        avatar: userData.avatar,
        address: userData.address,
        status: userData.status,
        createdAt: userData.createdAt,
        role: {
          id: userData.role?.id || 0,
          name: userData.role?.name || userData.role || 'USER',
          slug: userData.role?.slug || userData.roleSlug || 'user',
        },
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser));

      // Update store - this will persist automatically
      setUser(transformedUser);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        text: `Chào mừng ${userData.name} quay trở lại!`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });

      // Navigate based on role
      const isAdminUser = transformedUser.role.slug === USER_ROLES.ADMIN;
      if (isAdminUser) {
        window.location.href = '/admin';
      } else {
        navigate('/');
      }
    },
    onError: (error: unknown) => {
      console.error('[useAuth] login error:', error);

      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: err.response?.data?.message || 'Email hoặc mật khẩu không đúng',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      console.log('[useAuth] register raw response:', response);
      console.log('[useAuth] register response.data:', response.data);
      return response.data;
    },
    onSuccess: (response) => {
      console.log('[useAuth] register onSuccess response:', response);

      const data = response?.data;
      if (!data?.accessToken || !data?.user) {
        console.error('[useAuth] Invalid register payload:', data);
        Swal.fire({
          icon: 'error',
          title: 'Đăng ký thất bại',
          text: 'Phản hồi đăng ký không hợp lệ',
        });
        return;
      }

      const { accessToken, refreshToken, user: userData } = data;

      // Transform user data to match frontend types
      const transformedUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        avatar: userData.avatar,
        address: userData.address,
        status: userData.status,
        createdAt: userData.createdAt,
        role: {
          id: userData.role?.id || 0,
          name: userData.role?.name || userData.role || 'USER',
          slug: userData.role?.slug || userData.roleSlug || 'user',
        },
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser));

      // Update store
      setUser(transformedUser);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    },
    onError: (error: unknown) => {
      console.error('[useAuth] register error:', error);

      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại sau',
      });
    },
  });

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await registerMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D70018',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Clear store
        storeLogout();

        Swal.fire({
          icon: 'success',
          title: 'Đã đăng xuất',
          text: 'Hẹn gặp lại bạn!',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        navigate('/');
      }
    });
  };

  const checkAuth = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    checkAuth,
  };
};
