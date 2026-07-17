import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Cart, CartItem } from '@/types';
import { STORAGE_KEYS, USER_ROLES } from '@/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
        });
      },
      
      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        set({ 
          user: null, 
          isAuthenticated: false,
        });
      },
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'akstore-auth',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useIsAdmin = () => useAuthStore((s) => s.user?.role?.slug === USER_ROLES.ADMIN);

interface CartState {
  cart: Cart | null;
  itemCount: number;
  setCart: (cart: Cart | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      itemCount: 0,
      
      setCart: (cart) => {
        const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        set({ cart, itemCount });
      },
      
      addItem: (item) => {
        const { cart } = get();
        const existingIndex = cart?.items.findIndex(i => i.product.id === item.product.id);
        
        if (cart) {
          let newItems: CartItem[];
          if (existingIndex !== undefined && existingIndex >= 0) {
            newItems = [...cart.items];
            newItems[existingIndex].quantity += item.quantity;
          } else {
            newItems = [...(cart.items || []), item];
          }
          
          const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
          
          set({
            cart: { ...cart, items: newItems, subtotal, totalItems: itemCount },
            itemCount,
          });
        } else {
          const newCart: Cart = {
            id: 0,
            items: [item],
            subtotal: item.price * item.quantity,
            totalItems: item.quantity,
          };
          set({ cart: newCart, itemCount: item.quantity });
        }
      },
      
      updateItem: (productId, quantity) => {
        const { cart } = get();
        if (!cart) return;
        
        const newItems = cart.items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        
        const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
        
        set({
          cart: { ...cart, items: newItems, subtotal, totalItems: itemCount },
          itemCount,
        });
      },
      
      removeItem: (productId) => {
        const { cart } = get();
        if (!cart) return;
        
        const newItems = cart.items.filter(item => item.product.id !== productId);
        const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
        
        set({
          cart: { ...cart, items: newItems, subtotal, totalItems: itemCount },
          itemCount,
        });
      },
      
      clearCart: () => {
        set({ cart: null, itemCount: 0 });
      },
    }),
    {
      name: 'akstore-cart',
    }
  )
);

interface UIState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
