import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Tag, 
  ShoppingCart, 
  Users, 
  FileText,
  Settings,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Sản phẩm',
    icon: Package,
    href: '/admin/products',
  },
  {
    title: 'Danh mục',
    icon: Layers,
    href: '/admin/categories',
  },
  {
    title: 'Thương hiệu',
    icon: Tag,
    href: '/admin/brands',
  },
  {
    title: 'Đơn hàng',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    title: 'Người dùng',
    icon: Users,
    href: '/admin/users',
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { isSidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-accent-900 text-white z-40 transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-accent-800">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">AK</span>
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-bold">
              AK<span className="text-primary">Admin</span>
            </span>
          )}
        </Link>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href !== '/admin' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-accent-300 hover:bg-accent-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-accent-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-accent-300 hover:bg-accent-800 hover:text-white transition-all"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="font-medium">Cài đặt</span>}
        </Link>
      </div>
    </aside>
  );
};
