CREATE DATABASE IF NOT EXISTS shophub_ecommerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shophub_ecommerce;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  address TEXT NULL,
  phone VARCHAR(30) NULL,
  avatar TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  images JSON NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  review_count INT NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_product (product_id),
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS carts (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_user_product (user_id, product_id),
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_carts_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  shipping_name VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_zip_code VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(30) NOT NULL,
  payment_type VARCHAR(30) NOT NULL,
  payment_details JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) NOT NULL,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO products (id, name, description, price, category, stock, images, rating, review_count, featured) VALUES
('prod-1', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life.', 10999.00, 'Electronics', 45, '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]', 4.5, 128, 1),
('prod-2', 'Smart Watch Pro', 'Advanced fitness tracking and smartphone notifications.', 24999.00, 'Electronics', 23, '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]', 4.8, 256, 1),
('prod-3', 'Laptop Backpack', 'Durable backpack with laptop compartment and USB charging port.', 4199.00, 'Accessories', 67, '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"]', 4.3, 89, 1),
('prod-4', 'Yoga Mat Premium', 'Non-slip eco-friendly yoga mat for home workouts.', 2499.00, 'Sports', 78, '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800"]', 4.7, 145, 1);

SELECT 'Database shophub_ecommerce created successfully.' AS status;
