import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShoppingBag, LogOut } from 'lucide-react';
import { ProfileCard, ProfileForm } from '@/components/common';
import { useAuthStore } from '@/store';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tài khoản của tôi</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileCard user={user} className="mb-6" />

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-card p-4"
            >
              <h3 className="font-semibold text-accent-900 mb-4">Tài khoản</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent-50 transition-colors text-left"
                >
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span className="font-medium text-accent-700">Đơn hàng của tôi</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}
