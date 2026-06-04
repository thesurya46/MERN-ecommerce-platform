import { Product, User, Order, Review, CartItem, FilterOptions } from '../types';
import { mockProducts, mockReviews, mockUsers } from '../data/mockData';
import { validateEmail, validatePassword, normalizeEmail } from '../utils/authValidation';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CREDENTIALS_KEY = 'user_credentials';
const REGISTERED_USERS_KEY = 'registered_users';

function loadPersistedUsers(): void {
  try {
    const stored: User[] = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    stored.forEach((u) => {
      const index = mockUsers.findIndex((m) => m.id === u.id);
      if (index >= 0) {
        mockUsers[index] = u;
      } else {
        mockUsers.push(u);
      }
    });
  } catch {
    // ignore invalid storage
  }
}

function persistRegisteredUsers(): void {
  const credentials = getStoredCredentials();
  const registered = mockUsers.filter((u) => credentials[normalizeEmail(u.email)]);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
}

loadPersistedUsers();

function getStoredCredentials(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCredential(email: string, password: string): void {
  const credentials = getStoredCredentials();
  credentials[normalizeEmail(email)] = password;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

function getStoredPassword(email: string): string | undefined {
  return getStoredCredentials()[normalizeEmail(email)];
}

export const productAPI = {
  async getProducts(filters?: Partial<FilterOptions>): Promise<Product[]> {
    await delay(300);

    let filtered = [...mockProducts];

    if (filters) {
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
      }

      if (filters.minRating !== undefined) {
        filtered = filtered.filter(p => p.rating >= filters.minRating);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
    }

    return filtered;
  },

  async getProduct(id: string): Promise<Product | null> {
    await delay(200);
    return mockProducts.find(p => p.id === id) || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(200);
    return mockProducts.filter(p => p.featured);
  },

  async getBestSellers(): Promise<Product[]> {
    await delay(200);
    return [...mockProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  },

  async getNewArrivals(): Promise<Product[]> {
    await delay(200);
    return [...mockProducts].slice(-8).reverse();
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(300);
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    mockProducts[index] = { ...mockProducts[index], ...updates };
    return mockProducts[index];
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts.splice(index, 1);
  }
};

export const reviewAPI = {
  async getReviews(productId: string): Promise<Review[]> {
    await delay(200);
    return mockReviews.filter(r => r.productId === productId);
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    await delay(300);
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    mockReviews.push(newReview);
    return newReview;
  }
};

export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);

    const emailError = validateEmail(email);
    if (emailError) throw new Error(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    const normalizedEmail = normalizeEmail(email);
    const user = mockUsers.find((u) => normalizeEmail(u.email) === normalizedEmail);
    const storedPassword = getStoredPassword(normalizedEmail);

    if (!user || !storedPassword || storedPassword !== password) {
      throw new Error('No account found with this email. Please register first.');
    }

    const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));

    return { user, token };
  },

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await delay(500);

    const emailError = validateEmail(email);
    if (emailError) throw new Error(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    if (!name.trim()) {
      throw new Error('Full name is required');
    }

    const normalizedEmail = normalizeEmail(email);

    if (mockUsers.find((u) => normalizeEmail(u.email) === normalizedEmail)) {
      throw new Error('An account with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: normalizedEmail,
      name: name.trim(),
      role: 'user',
    };

    mockUsers.push(newUser);
    saveCredential(normalizedEmail, password);
    persistRegisteredUsers();

    const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 }));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(newUser));

    return { user: newUser, token };
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await delay(300);
    const userStr = localStorage.getItem('current_user');
    if (!userStr) throw new Error('Not authenticated');

    const user: User = JSON.parse(userStr);
    if (user.id !== userId) throw new Error('Not authorized');

    if (updates.name !== undefined && !updates.name.trim()) {
      throw new Error('Full name is required');
    }

    if (updates.email !== undefined) {
      const emailError = validateEmail(updates.email);
      if (emailError) throw new Error(emailError);

      const normalizedNew = normalizeEmail(updates.email);
      const normalizedOld = normalizeEmail(user.email);

      if (normalizedNew !== normalizedOld) {
        const taken = mockUsers.find(
          (u) => u.id !== userId && normalizeEmail(u.email) === normalizedNew
        );
        if (taken) throw new Error('This email is already in use');

        const credentials = getStoredCredentials();
        const currentPassword = credentials[normalizedOld];
        if (currentPassword) {
          delete credentials[normalizedOld];
          credentials[normalizedNew] = currentPassword;
          localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
        }
        updates.email = normalizedNew;
      }
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id: user.id,
      role: user.role,
      name: updates.name?.trim() ?? user.name,
      phone: updates.phone?.trim() || undefined,
      address: updates.address?.trim() || undefined,
      avatar:
        updates.avatar !== undefined
          ? updates.avatar || undefined
          : user.avatar,
    };

    const index = mockUsers.findIndex((u) => u.id === userId);
    if (index >= 0) {
      mockUsers[index] = updatedUser;
    }

    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    persistRegisteredUsers();

    return updatedUser;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await delay(300);

    const userStr = localStorage.getItem('current_user');
    if (!userStr) throw new Error('Not authenticated');

    const user: User = JSON.parse(userStr);
    const normalizedEmail = normalizeEmail(user.email);
    const storedPassword = getStoredPassword(normalizedEmail);

    if (!storedPassword || storedPassword !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) throw new Error(passwordError);

    saveCredential(normalizedEmail, newPassword);
  },
};

export const cartAPI = {
  async getCart(): Promise<CartItem[]> {
    const cartStr = localStorage.getItem('shopping_cart');
    return cartStr ? JSON.parse(cartStr) : [];
  },

  async addToCart(productId: string, quantity: number = 1): Promise<CartItem[]> {
    await delay(200);
    const cart = await this.getCart();
    const product = mockProducts.find(p => p.id === productId);

    if (!product) throw new Error('Product not found');

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity, product });
    }

    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    return cart;
  },

  async updateCartItem(productId: string, quantity: number): Promise<CartItem[]> {
    await delay(200);
    const cart = await this.getCart();
    const item = cart.find(i => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem('shopping_cart', JSON.stringify(cart));
    }

    return cart;
  },

  async removeFromCart(productId: string): Promise<CartItem[]> {
    await delay(200);
    const cart = await this.getCart();
    const filtered = cart.filter(item => item.productId !== productId);
    localStorage.setItem('shopping_cart', JSON.stringify(filtered));
    return filtered;
  },

  async clearCart(): Promise<void> {
    localStorage.removeItem('shopping_cart');
  }
};

export const orderAPI = {
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    await delay(500);

    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = this.getOrdersFromStorage();
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    await cartAPI.clearCart();

    return newOrder;
  },

  async getOrders(userId: string): Promise<Order[]> {
    await delay(300);
    const orders = this.getOrdersFromStorage();
    return orders.filter(o => o.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getAllOrders(): Promise<Order[]> {
    await delay(300);
    const orders = this.getOrdersFromStorage();
    return orders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getOrder(orderId: string): Promise<Order | null> {
    await delay(200);
    const orders = this.getOrdersFromStorage();
    return orders.find(o => o.id === orderId) || null;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await delay(300);
    const orders = this.getOrdersFromStorage();
    const order = orders.find(o => o.id === orderId);

    if (!order) throw new Error('Order not found');

    order.status = status;
    order.updatedAt = new Date().toISOString();

    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
  },

  getOrdersFromStorage(): Order[] {
    const ordersStr = localStorage.getItem('orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
  }
};

export const paymentAPI = {
  async processPayment(amount: number, paymentMethod: any): Promise<{ success: boolean; transactionId: string }> {
    await delay(1000);

    const success = Math.random() > 0.1;

    if (!success) {
      throw new Error('Payment failed. Please try again.');
    }

    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }
};

export const wishlistAPI = {
  async getWishlist(): Promise<Product[]> {
    const wishlistStr = localStorage.getItem('wishlist');
    return wishlistStr ? JSON.parse(wishlistStr) : [];
  },

  async addToWishlist(productId: string): Promise<Product[]> {
    await delay(200);
    const wishlist = await this.getWishlist();
    const product = mockProducts.find(p => p.id === productId);

    if (!product) throw new Error('Product not found');

    if (!wishlist.some(item => item.id === productId)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    return wishlist;
  },

  async removeFromWishlist(productId: string): Promise<Product[]> {
    await delay(200);
    const wishlist = await this.getWishlist();
    const filtered = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(filtered));
    return filtered;
  },

  async isInWishlist(productId: string): Promise<boolean> {
    const wishlist = await this.getWishlist();
    return wishlist.some(item => item.id === productId);
  }
};
