import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api';
import { useAuthStore } from '@/store';
import Swal from 'sweetalert2';
import type { CartItem, Cart } from '@/types';

interface CartState {
  selectedItems: number[];
  items: CartItem[];
}

export const useCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Fetch cart
  const {
    data: cartData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartApi.getCart();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const cart: Cart | null = cartData?.data || null;
  const items: CartItem[] = cart?.items || [];

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await cartApi.addItem({ productId, quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      Swal.fire({
        icon: 'success',
        title: 'Thêm vào giỏ hàng thành công!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Thêm vào giỏ hàng thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại',
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await cartApi.updateItem(itemId, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại',
      });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await cartApi.removeItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa sản phẩm',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
        icon: 'error',
        title: 'Xóa thất bại',
        text: err.response?.data?.message || 'Vui lòng thử lại',
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await cartApi.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setSelectedItems([]);
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa toàn bộ giỏ hàng',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Xóa thất bại',
        text: 'Vui lòng thử lại',
      });
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async (checkoutData: {
      shippingAddress: string;
      shippingPhone: string;
      shippingName: string;
      note?: string;
      paymentMethod: string;
    }) => {
      const response = await cartApi.checkout(checkoutData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setSelectedItems([]);
      return data;
    },
  });

  // Actions
  const addToCart = useCallback(
    async (productId: number, quantity: number = 1) => {
      if (!isAuthenticated) {
        Swal.fire({
          icon: 'warning',
          title: 'Vui lòng đăng nhập',
          text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng',
          confirmButtonText: 'Đăng nhập',
          confirmButtonColor: '#D70018',
        });
        return;
      }
      await addToCartMutation.mutateAsync({ productId, quantity });
    },
    [isAuthenticated, addToCartMutation]
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      await updateQuantityMutation.mutateAsync({ itemId, quantity });
    },
    [updateQuantityMutation]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      const result = await Swal.fire({
        title: 'Xóa sản phẩm',
        text: 'Bạn có chắc muốn xóa sản phẩm này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#D70018',
      });

      if (result.isConfirmed) {
        await removeItemMutation.mutateAsync(itemId);
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      }
    },
    [removeItemMutation]
  );

  const clearCart = useCallback(async () => {
    const result = await Swal.fire({
      title: 'Xóa toàn bộ giỏ hàng',
      text: 'Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa tất cả',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#D70018',
    });

    if (result.isConfirmed) {
      await clearCartMutation.mutateAsync();
    }
  }, [clearCartMutation]);

  const checkout = useCallback(
    async (checkoutData: {
      shippingAddress: string;
      shippingPhone: string;
      shippingName: string;
      note?: string;
      paymentMethod: string;
    }) => {
      return await checkoutMutation.mutateAsync(checkoutData);
    },
    [checkoutMutation]
  );

  // Selection
  const toggleSelectItem = useCallback((itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const selectAllItems = useCallback(() => {
    setSelectedItems(items.map((item) => item.id));
  }, [items]);

  const deselectAllItems = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const selectedItemsList = items.filter((item) =>
      selectedItems.includes(item.id)
    );
    
    const subtotal = selectedItemsList.reduce((sum, item) => {
      const product = item.product;
      const price = product?.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    const itemCount = selectedItemsList.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const discount = 0; // Có thể thêm logic discount sau
    const total = subtotal + shipping - discount;

    return { subtotal, shipping, discount, total, itemCount };
  }, [items, selectedItems]);

  return {
    // Data
    cart,
    items,
    selectedItems,
    totals,
    
    // Loading states
    isLoading,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
    isCheckingOut: checkoutMutation.isPending,
    error,
    
    // Actions
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    refetch,
    
    // Selection
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    setSelectedItems,
  };
};
