import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem, CartSummary } from '@/components/common';
import { EmptyState, Breadcrumb, Checkbox, Button } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  const {
    items,
    selectedItems,
    totals,
    isLoading,
    isUpdating,
    isRemoving,
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Calculate if all items are selected
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  // Update indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    navigate('/checkout', { state: { from: 'cart' } });
  };

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-accent-50">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Giỏ hàng</h1>
            <Breadcrumb
              items={[{ label: 'Giỏ hàng' }]}
              className="text-white/80 [&_a]:text-white/80 [&_span]:text-white"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <EmptyState
            icon="cart"
            title="Giỏ hàng trống"
            description="Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm"
            action={
              <Button onClick={() => navigate('/products')}>
                Tiếp tục mua sắm
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Giỏ hàng</h1>
          <Breadcrumb
            items={[{ label: 'Giỏ hàng' }]}
            className="text-white/80 [&_a]:text-white/80 [&_span]:text-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    ref={checkboxRef}
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        selectAllItems();
                      } else {
                        deselectAllItems();
                      }
                    }}
                  />
                  <span className="font-medium text-accent-900">
                    Chọn tất cả ({items.length} sản phẩm)
                  </span>
                </div>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa tất cả</span>
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelectChange={toggleSelectItem}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-96">
            <CartSummary
              subtotal={totals.subtotal}
              shipping={totals.shipping}
              discount={totals.discount}
              total={totals.total}
              itemCount={totals.itemCount}
              onCheckout={handleCheckout}
              isLoading={isUpdating || isRemoving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const CartPageSkeleton = () => (
  <div className="min-h-screen bg-accent-50 pb-12">
    <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-card p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-accent-100 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-accent-100 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-accent-100 rounded animate-pulse w-1/2" />
                  <div className="h-6 bg-accent-100 rounded animate-pulse w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-96">
          <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
            <div className="h-6 bg-accent-100 rounded w-1/2 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-accent-100 rounded" />
              ))}
            </div>
            <div className="h-12 bg-accent-100 rounded mt-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
