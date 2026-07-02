import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { cartAPI } from '../services/api';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await cartAPI.getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const updatedCart = await cartAPI.addToCart(productId, quantity);
      setCart(updatedCart);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const updatedCart = await cartAPI.removeFromCart(productId);
      setCart(updatedCart);
      toast.success('Removed from cart');
    } catch (error: any) {
      toast.error('Failed to remove from cart');
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const updatedCart = await cartAPI.updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (error: any) {
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
    } catch (error: any) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
