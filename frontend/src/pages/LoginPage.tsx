import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest } from '@/api/auth';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const { accessToken, user } = event.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: `Chào mừng ${user.name}!`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
        
        window.location.reload();
      } else if (event.data?.type === 'OAUTH_ERROR') {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: event.data.error || 'Có lỗi xảy ra',
        });
        setSocialLoading(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
    } catch {
      // Error handled by useAuth hook
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading('google');
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const state = btoa(JSON.stringify({ provider: 'google', timestamp: Date.now() }));

      const popup = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=email profile&nonce=${state}&hd=*`,
        'google-login',
        'width=500,height=600'
      );

      if (popup) {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setSocialLoading(null);
          }
        }, 1000);
      } else {
        setSocialLoading(null);
        Swal.fire({
          icon: 'error',
          title: 'Không thể mở cửa sổ đăng nhập',
          text: 'Vui lòng cho phép popup cho trang này',
        });
      }
    } catch (error) {
      console.error('Google login error:', error);
      setSocialLoading(null);
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập Google thất bại',
        text: 'Vui lòng thử lại sau',
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setSocialLoading('facebook');
      const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const state = btoa(JSON.stringify({ provider: 'facebook', timestamp: Date.now() }));

      const popup = window.open(
        `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email,public_profile&state=${state}`,
        'facebook-login',
        'width=500,height=600'
      );

      if (popup) {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setSocialLoading(null);
          }
        }, 1000);
      } else {
        setSocialLoading(null);
        Swal.fire({
          icon: 'error',
          title: 'Không thể mở cửa sổ đăng nhập',
          text: 'Vui lòng cho phép popup cho trang này',
        });
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      setSocialLoading(null);
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập Facebook thất bại',
        text: 'Vui lòng thử lại sau',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">AK</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-accent-900">Chào mừng trở lại</h1>
            <p className="text-accent-500 mt-2">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-accent-400 hover:text-accent-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-accent-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-accent-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-accent-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-accent-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-accent-200 hover:bg-accent-50"
              onClick={handleGoogleLogin}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="ml-2">Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-accent-200 hover:bg-accent-50"
              onClick={handleFacebookLogin}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'facebook' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              <span className="ml-2">Facebook</span>
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-accent-600 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-700 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-accent-500 hover:text-primary transition-colors">
            ← Quay về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
