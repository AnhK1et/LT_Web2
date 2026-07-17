import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart, LogOut, Package, Settings } from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore, useCartStore } from '@/store';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useActiveCategories, useActiveBrands, useSearchSuggestions } from '@/hooks/useProducts';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role?.slug === 'admin';
  const { itemCount } = useCartStore();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useActiveCategories();
  const { data: brands } = useActiveBrands();
  const { data: suggestions } = useSearchSuggestions(searchQuery);
  const categoryList = Array.isArray(categories) ? categories : [];
  const brandList = Array.isArray(brands) ? brands : [];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      // Close dropdown menus when clicking outside
      if (!event.target || !(event.target as HTMLElement).closest('.category-dropdown')) {
        setIsCategoryMenuOpen(false);
      }
      if (!event.target || !(event.target as HTMLElement).closest('.brand-dropdown')) {
        setIsBrandMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-card">
      {/* Top Bar */}
      <div className="bg-accent-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <span>Hotline: 1900 1234</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-primary-300 transition-colors">
              Giới thiệu
            </Link>
            <Link to="/news" className="hover:text-primary-300 transition-colors">
              Tin tức
            </Link>
            <Link to="/contact" className="hover:text-primary-300 transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AK</span>
            </div>
            <span className="text-2xl font-bold text-accent-900">
              AK<span className="text-primary">Store</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-4 py-3 pr-12 border-2 border-accent-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && suggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-accent-100 py-2 z-50 max-h-96 overflow-y-auto">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug || product.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-accent-50 transition-colors"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                  >
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-accent-900 truncate">{product.name}</p>
                      <p className="text-sm text-primary font-medium">
                        {product.price?.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </Link>
                ))}
                <Link
                  to={`/products?search=${encodeURIComponent(searchQuery)}`}
                  className="block px-4 py-2 text-center text-primary font-medium hover:bg-accent-50 border-t border-accent-100"
                  onClick={() => setShowSuggestions(false)}
                >
                  Xem tất cả kết quả cho "{searchQuery}"
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-accent-600 hover:text-primary transition-colors hidden md:block"
            >
              <Heart className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-accent-600 hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-accent-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:inline font-medium text-accent-900 max-w-32 truncate">
                    {user.name}
                  </span>
                  <ChevronDown className={cn(
                    'w-4 h-4 text-accent-400 hidden md:block transition-transform',
                    isUserMenuOpen && 'rotate-180'
                  )} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-accent-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-accent-100">
                      <p className="font-medium text-accent-900 truncate">{user.name}</p>
                      <p className="text-xs text-accent-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-accent-700 hover:bg-accent-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Tài khoản
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-accent-700 hover:bg-accent-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        Đơn hàng
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-accent-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Quản trị
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-accent-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="hidden md:flex">
                    Đăng ký
                  </Button>
                </Link>
                <Link to="/login" className="md:hidden p-2 text-accent-600">
                  <User className="w-6 h-6" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-accent-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block bg-accent-50 border-t border-accent-100">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 py-3">
            <li>
              <Link to="/" className="font-medium text-accent-700 hover:text-primary transition-colors">
                Trang chủ
              </Link>
            </li>
            
            {/* Categories Dropdown */}
            <li className="relative">
              <button
                onClick={() => {
                  setIsCategoryMenuOpen(!isCategoryMenuOpen);
                  setIsBrandMenuOpen(false);
                }}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                className="flex items-center gap-1 font-medium text-accent-700 hover:text-primary transition-colors"
              >
                Danh mục
                <ChevronDown className={cn('w-4 h-4 transition-transform', isCategoryMenuOpen && 'rotate-180')} />
              </button>
              
              {isCategoryMenuOpen && categoryList.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-accent-100 py-2 z-50 category-dropdown">
                  {categoryList.slice(0, 8).map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?categoryId=${category.id}`}
                      className="block px-4 py-2 text-accent-700 hover:bg-accent-50 hover:text-primary transition-colors"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-primary font-medium hover:bg-accent-50 transition-colors border-t border-accent-100 mt-2"
                    onClick={() => setIsCategoryMenuOpen(false)}
                  >
                    Xem tất cả danh mục →
                  </Link>
                </div>
              )}
            </li>

            {/* Brands Dropdown */}
            <li className="relative">
              <button
                onClick={() => {
                  setIsBrandMenuOpen(!isBrandMenuOpen);
                  setIsCategoryMenuOpen(false);
                }}
                onMouseEnter={() => setIsBrandMenuOpen(true)}
                className="flex items-center gap-1 font-medium text-accent-700 hover:text-primary transition-colors"
              >
                Thương hiệu
                <ChevronDown className={cn('w-4 h-4 transition-transform', isBrandMenuOpen && 'rotate-180')} />
              </button>
              
              {isBrandMenuOpen && brandList.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-accent-100 py-2 z-50 brand-dropdown">
                  {brandList.slice(0, 8).map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/products?brandId=${brand.id}`}
                      className="block px-4 py-2 text-accent-700 hover:bg-accent-50 hover:text-primary transition-colors"
                      onClick={() => setIsBrandMenuOpen(false)}
                    >
                      {brand.name}
                    </Link>
                  ))}
                  <Link
                    to="/brands"
                    className="block px-4 py-2 text-primary font-medium hover:bg-accent-50 transition-colors border-t border-accent-100 mt-2"
                    onClick={() => setIsBrandMenuOpen(false)}
                  >
                    Xem tất cả thương hiệu →
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link to="/promotions" className="font-medium text-accent-700 hover:text-primary transition-colors">
                Khuyến mãi
              </Link>
            </li>
            <li>
              <Link to="/about" className="font-medium text-accent-700 hover:text-primary transition-colors">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/news" className="font-medium text-accent-700 hover:text-primary transition-colors">
                Tin tức
              </Link>
            </li>
            <li>
              <Link to="/contact" className="font-medium text-accent-700 hover:text-primary transition-colors">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-accent-100">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Danh mục
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Thương hiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block font-medium text-accent-700 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liên hệ
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="block font-medium text-accent-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="block font-medium text-accent-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn hàng
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
