import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { googleLogin, facebookLogin } from '@/api/oauth';
import { STORAGE_KEYS } from '@/constants';
import Swal from 'sweetalert2';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get('provider');
      const accessToken = searchParams.get('access_token');
      const idToken = searchParams.get('id_token');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error || errorDescription) {
        setStatus('error');
        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: 'Đăng nhập thất bại',
            text: errorDescription || 'Không thể đăng nhập với mạng xã hội',
          }).then(() => {
            window.opener?.postMessage({ type: 'OAUTH_ERROR', error: error || errorDescription }, window.location.origin);
            window.close();
          });
        }, 100);
        return;
      }

      if (!provider || (!accessToken && !idToken)) {
        setStatus('error');
        setTimeout(() => {
          window.close();
        }, 100);
        return;
      }

      try {
        let result;
        if (provider === 'google' && idToken) {
          result = await googleLogin({ idToken });
        } else if (provider === 'facebook' && accessToken) {
          result = await facebookLogin({ accessToken });
        } else {
          throw new Error('Invalid provider or missing token');
        }

        if (result?.accessToken && result?.user) {
          setStatus('success');
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
          
          setTimeout(() => {
            window.opener?.postMessage({ 
              type: 'OAUTH_SUCCESS', 
              accessToken: result.accessToken,
              user: result.user
            }, window.location.origin);
            window.close();
          }, 100);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: unknown) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        const errorMessage = error instanceof Error 
          ? error.message 
          : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
        
        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: 'Đăng nhập thất bại',
            text: errorMessage,
          }).then(() => {
            window.opener?.postMessage({ type: 'OAUTH_ERROR', error: errorMessage }, window.location.origin);
            window.close();
          });
        }, 100);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
      <div className="text-center">
        <Loader2 className={`w-12 h-12 animate-spin text-primary mx-auto mb-4 ${status === 'error' ? 'hidden' : ''}`} />
        {status === 'error' && (
          <p className="text-accent-600">Đang chuyển hướng...</p>
        )}
        {status === 'loading' && (
          <p className="text-accent-600">Đang xử lý đăng nhập...</p>
        )}
        {status === 'success' && (
          <p className="text-accent-600">Đăng nhập thành công!</p>
        )}
      </div>
    </div>
  );
}
