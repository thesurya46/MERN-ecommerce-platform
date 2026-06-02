# E-Commerce Platform 

A full-featured e-commerce platform built with React, TypeScript, and Tailwind CSS. Features product browsing, shopping cart, checkout flow, order tracking, and admin dashboard.

## Features

### Frontend Features
- **Product Catalog**: Grid view with filtering by category, price range, and ratings
- **Advanced Search**: Real-time search with sorting options (price, rating, newest)
- **Product Detail Pages**: Full product information, multiple images, reviews, and ratings
- **Shopping Cart**: Add/remove items, adjust quantities, persisted to localStorage
- **Multi-Step Checkout**: Shipping address, payment method selection, order review
- **Order History**: View past orders with status tracking (pending → processing → shipped → delivered)
- **User Authentication**: Sign up, login, JWT-based authentication
- **Admin Dashboard**: Product management (CRUD), order management, inventory updates
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Review System**: Users can rate and review products

### Mock Backend APIs
Located in `src/services/api.ts`:
- **Product API**: GET products with filters, GET single product, POST/PUT/DELETE (admin)
- **User API**: Registration, login, profile management
- **Cart API**: Add to cart, remove items, update quantities
- **Order API**: Create order, get order history, get order details, update status
- **Review API**: Add reviews, get reviews for product
- **Payment API**: Mock payment processing (simulates success/failure)

### Data Models
Located in `src/types/index.ts`:
- Products: id, name, description, price, category, stock, images, rating, reviews
- Users: id, email, password (hashed), name, address, phone, role (user/admin)
- Orders: id, userId, items, total, status, createdAt, shippingAddress
- CartItems: productId, quantity, product reference
- Reviews: id, productId, userId, rating, comment, createdAt

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── ui/          # Shadcn/ui components
│   └── App.tsx          # Main app with routing
├── components/
│   └── Navbar.tsx       # Navigation bar
├── contexts/
│   ├── AuthContext.tsx  # Authentication state management
│   └── CartContext.tsx  # Shopping cart state management
├── data/
│   └── mockData.ts      # Mock product data and reviews
├── pages/
│   ├── Home.tsx         # Landing page with featured products
│   ├── Products.tsx     # Product catalog with filters
│   ├── ProductDetail.tsx # Product detail page
│   ├── Cart.tsx         # Shopping cart
│   ├── Checkout.tsx     # Multi-step checkout
│   ├── Orders.tsx       # Order history
│   ├── OrderDetail.tsx  # Order tracking
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   └── Admin.tsx        # Admin dashboard
├── services/
│   └── api.ts           # Mock API services
└── types/
    └── index.ts         # TypeScript interfaces
```

## Getting Started

### Installation
```bash
pnpm install
```

### Running the Application
The Vite dev server is already running in this environment. The application will be available in the preview surface.

### Demo Credentials
- **Admin**: admin@example.com / password
- **User**: john@example.com / password

## Connecting to MySQL Database

The current implementation uses localStorage and mock data. To connect to a MySQL database:

### 1. Backend Setup (Node.js/Express)

Create a backend API server with these endpoints:

```javascript
// Example Express setup
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'ecommerce_db'
});

// Example product endpoint
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows);
});
```

### 2. MySQL Schema

```sql
CREATE DATABASE ecommerce_db;

USE ecommerce_db;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  images JSON,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address JSON,
  payment_method JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 3. Update API Service

Replace the mock API calls in `src/services/api.ts` with real HTTP requests:

```typescript
// Example using fetch
export const productAPI = {
  async getProducts(filters?: Partial<FilterOptions>): Promise<Product[]> {
    const queryParams = new URLSearchParams(filters as any).toString();
    const response = await fetch(`${API_URL}/products?${queryParams}`);
    return response.json();
  },
  
  async getProduct(id: string): Promise<Product | null> {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  }
  // ... other methods
};
```

## Features to Add

- [ ] Real payment integration (Stripe/Razorpay)
- [ ] Email notifications for orders
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Discount codes/coupons
- [ ] Two-factor authentication
- [ ] Social login (Google/GitHub)
- [ ] Inventory low-stock alerts
- [ ] Analytics dashboard

## Tech Stack

- **Frontend**: React 18.3.1, TypeScript
- **Routing**: React Router 7.15.1
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Form Handling**: React Hook Form 7.55.0
- **Notifications**: Sonner
- **Build Tool**: Vite 6.3.5

## Security Notes

⚠️ **Important**: This is a demo application. For production:
- Use proper password hashing (bcrypt)
- Implement HTTPS
- Add CSRF protection
- Validate all inputs server-side
- Use environment variables for sensitive data
- Implement rate limiting
- Add SQL injection protection
- Use secure JWT storage
- Add XSS protection

## License

MIT
