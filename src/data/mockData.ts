import { Product, Review, User } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Perfect for music lovers and professionals.',
    price: 129.99,
    category: 'Electronics',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ],
    rating: 4.5,
    reviewCount: 128,
    featured: true
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone notifications. Water-resistant up to 50m.',
    price: 299.99,
    category: 'Electronics',
    stock: 23,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
    ],
    rating: 4.8,
    reviewCount: 256,
    featured: true
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    description: 'Durable and stylish backpack with dedicated laptop compartment, USB charging port, and water-resistant material.',
    price: 49.99,
    category: 'Accessories',
    stock: 67,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800'
    ],
    rating: 4.3,
    reviewCount: 89
  },
  {
    id: '4',
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming mechanical keyboard with customizable RGB lighting, tactile switches, and programmable macros.',
    price: 89.99,
    category: 'Electronics',
    stock: 34,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800'
    ],
    rating: 4.6,
    reviewCount: 167
  },
  {
    id: '5',
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity power bank with fast charging support for multiple devices. Compact and travel-friendly design.',
    price: 39.99,
    category: 'Electronics',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'
    ],
    rating: 4.4,
    reviewCount: 203,
    featured: true
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.',
    price: 29.99,
    category: 'Sports',
    stock: 78,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      'https://images.unsplash.com/photo-1592432678016-e910b452da9b?w=800'
    ],
    rating: 4.7,
    reviewCount: 145
  },
  {
    id: '7',
    name: 'Coffee Maker Automatic',
    description: 'Programmable coffee maker with thermal carafe, auto-shutoff, and brew strength control. Makes 12 cups.',
    price: 79.99,
    category: 'Home & Kitchen',
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'
    ],
    rating: 4.5,
    reviewCount: 98
  },
  {
    id: '8',
    name: 'Running Shoes Sport',
    description: 'Lightweight running shoes with breathable mesh upper and responsive cushioning. Ideal for daily training.',
    price: 89.99,
    category: 'Sports',
    stock: 56,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'
    ],
    rating: 4.6,
    reviewCount: 234
  },
  {
    id: '9',
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with touch control, multiple brightness levels, and USB charging port.',
    price: 34.99,
    category: 'Home & Kitchen',
    stock: 91,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'
    ],
    rating: 4.4,
    reviewCount: 67
  },
  {
    id: '10',
    name: 'Wireless Mouse Ergonomic',
    description: 'Comfortable ergonomic wireless mouse with adjustable DPI, silent clicks, and long battery life.',
    price: 24.99,
    category: 'Electronics',
    stock: 145,
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'
    ],
    rating: 4.3,
    reviewCount: 156
  },
  {
    id: '11',
    name: 'Water Bottle Insulated',
    description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours, hot for 12 hours. BPA-free.',
    price: 19.99,
    category: 'Sports',
    stock: 203,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'
    ],
    rating: 4.8,
    reviewCount: 312
  },
  {
    id: '12',
    name: 'Notebook Set Luxury',
    description: 'Premium leather-bound notebook set with high-quality paper. Perfect for journaling and note-taking.',
    price: 24.99,
    category: 'Stationery',
    stock: 87,
    images: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800'
    ],
    rating: 4.5,
    reviewCount: 78
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent sound quality! The noise cancellation is amazing. Worth every penny.',
    createdAt: '2026-05-15T10:30:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Sarah Smith',
    rating: 4,
    comment: 'Great headphones, but the battery life could be better. Overall very satisfied.',
    createdAt: '2026-05-10T14:20:00Z'
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'Best smartwatch I have ever owned. Fitness tracking is accurate and the battery lasts days!',
    createdAt: '2026-05-20T09:15:00Z'
  },
  {
    id: '4',
    productId: '2',
    userId: 'user4',
    userName: 'Emily Brown',
    rating: 5,
    comment: 'Love the design and features. Syncs perfectly with my phone.',
    createdAt: '2026-05-18T16:45:00Z'
  },
  {
    id: '5',
    productId: '3',
    userId: 'user5',
    userName: 'David Lee',
    rating: 4,
    comment: 'Good quality backpack with lots of compartments. Very practical for daily use.',
    createdAt: '2026-05-12T11:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    address: '123 Main St, New York, NY 10001',
    phone: '+1234567890'
  },
  {
    id: 'admin1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    address: '456 Admin Ave, San Francisco, CA 94102',
    phone: '+1987654321'
  }
];

export const categories = [
  'All',
  'Electronics',
  'Accessories',
  'Sports',
  'Home & Kitchen',
  'Stationery'
];
