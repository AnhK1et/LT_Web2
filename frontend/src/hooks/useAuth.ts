import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { oauthApi } from '@/api/oauth';
import { useAuthStore } from '@/store';
import { STORAGE_KEYS, USER_ROLES } from '@/constants';
import type { LoginRequest, RegisterRequest } from '@/api/auth';
import Swal from 'sweetalert2';

export const useAuth = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = user?.role?.slug === USER_ROLES.ADMIN;
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const payload = {
        email: data.email.trim(),
        password: data.password,
      };
      const response = await authApi.login(payload);
      return response.data;
    },
    onSuccess: (response) => {
      const data = response?.data;
      if (!data?.accessToken || !data?.user) {
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
          id: typeof userData.role === 'object' ? (userData.role?.id || 0) : 0,
          name: typeof userData.role === 'string' ? userData.role : (userData.role?.name || 'USER'),
          slug:
            typeof userData.role === 'object'
              ? (userData.role?.slug || 'user')
              : (userData.roleSlug || String(userData.role || 'user')),
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
        navigate('/admin', { replace: true });
      } else {
        navigate('/');
      }
    },
    onError: (error: unknown) => {
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
      return response.data;
    },
    onSuccess: (response) => {
      const data = response?.data;
      if (!data?.accessToken || !data?.user) {
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
          id: typeof userData.role === 'object' ? (userData.role?.id || 0) : 0,
          name: typeof userData.role === 'string' ? userData.role : (userData.role?.name || 'USER'),
          slug:
            typeof userData.role === 'object'
              ? (userData.role?.slug || 'user')
              : (userData.roleSlug || String(userData.role || 'user')),
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

  const socialLoginMutation = useMutation({
    mutationFn: async ({ provider, idToken, accessToken }: { provider: string; idToken?: string; accessToken?: string }) => {
      if (provider === 'google' && idToken) {
        const response = await oauthApi.google({ idToken });
        return response.data;
      } else if (provider === 'facebook' && accessToken) {
        const response = await oauthApi.facebook({ accessToken });
        return response.data;
      }
      throw new Error('Invalid provider or missing token');
    },
    onSuccess: (response) => {
      const data = response?.data;
      if (!data?.accessToken || !data?.user) {
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
          id: typeof userData.role === 'object' ? (userData.role?.id || 0) : 0,
          name: typeof userData.role === 'string' ? userData.role : (userData.role?.name || 'USER'),
          slug:
            typeof userData.role === 'object'
              ? (userData.role?.slug || 'user')
              : (userData.roleSlug || String(userData.role || 'user')),
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
        title: 'Đăng nhập thành công!',
        text: `Chào mừng ${userData.name}!`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });

      // Navigate based on role
      const isAdminUser = transformedUser.role.slug === USER_ROLES.ADMIN;
      if (isAdminUser) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/');
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: err.response?.data?.message || err.message || 'Không thể đăng nhập với mạng xã hội',
      });
    },
  });

  const socialLogin = async (provider: string, idToken?: string, accessToken?: string) => {
    setIsLoading(true);
    try {
      await socialLoginMutation.mutateAsync({ provider, idToken, accessToken });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
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
        logout();

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
  }, [logout, navigate]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || socialLoginMutation.isPending,
    login,
    register,
    socialLogin,
    logout: handleLogout,
  };
};
