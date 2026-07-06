import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { cn } from '@/utils';
import { useAuthStore, useUIStore } from '@/store';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { isSidebarOpen, isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const navigate = useNavigate();

  const isAdmin = user?.role?.slug === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-accent-50">
      <AdminSidebar />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <AdminHeader />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
