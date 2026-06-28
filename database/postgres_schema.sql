CREATE DATABASE shophub_ecommerce;

\c shophub_ecommerce

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  address TEXT,
  phone VARCHAR(30),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  shipping_name VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_zip_code VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(30) NOT NULL,
  payment_type VARCHAR(30) NOT NULL,
  payment_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (id, name, description, price, category, stock, images, rating, review_count, featured) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life.', 10999.00, 'Electronics', 45, '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]', 4.5, 128, TRUE),
  ('22222222-2222-2222-2222-222222222222', 'Smart Watch Pro', 'Advanced fitness tracking and smartphone notifications.', 24999.00, 'Electronics', 23, '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]', 4.8, 256, TRUE),
  ('33333333-3333-3333-3333-333333333333', 'Laptop Backpack', 'Durable backpack with laptop compartment and USB charging port.', 4199.00, 'Accessories', 67, '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"]', 4.3, 89, TRUE);
