import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Không tìm thấy | AKStore';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-50">
      <div className="text-center px-4">
        <div className="text-9xl font-bold text-primary/10 mb-4">404</div>
        <h1 className="text-2xl font-bold text-accent-900 mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-accent-500 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>
              Về trang chủ
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};
