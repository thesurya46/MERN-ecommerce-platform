import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './db.js';
import { authMiddleware, comparePassword, hashPassword, signToken } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password and name are required' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const id = uuidv4();
    const passwordHash = await hashPassword(password);
    await pool.query(
      'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [id, email, name, passwordHash, 'user']
    );

    const token = signToken({ id, email, role: 'user' });
    res.status(201).json({ user: { id, email, name, role: 'user' }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
        phone: user.phone,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, name, role, address, phone, avatar FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load user' });
  }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, address, phone, avatar } = req.body;
    await pool.query('UPDATE users SET name = ?, address = ?, phone = ?, avatar = ?, updated_at = NOW() WHERE id = ?', [name, address, phone, avatar, req.user.id]);
    const [rows] = await pool.query('SELECT id, email, name, role, address, phone, avatar FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, minRating, search, sortBy } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (minRating) {
      query += ' AND rating >= ?';
      params.push(minRating);
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sortBy === 'price-asc') query += ' ORDER BY price ASC';
    else if (sortBy === 'price-desc') query += ' ORDER BY price DESC';
    else if (sortBy === 'rating') query += ' ORDER BY rating DESC';
    else query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows.map((p) => ({ ...p, images: JSON.parse(p.images || '[]') })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load products' });
  }
});

app.get('/api/products/featured', async (_, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC');
    res.json(rows.map((p) => ({ ...p, images: JSON.parse(p.images || '[]') })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load featured products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    const product = rows[0];
    res.json({ ...product, images: JSON.parse(product.images || '[]') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load product' });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const id = uuidv4();
    const { name, description, price, category, stock, images, rating, reviewCount, featured } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (id, name, description, price, category, stock, images, rating, review_count, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, price, category, stock, JSON.stringify(images || []), rating || 0, reviewCount || 0, featured ? 1 : 0]
    );
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const { name, description, price, category, stock, images, rating, reviewCount, featured } = req.body;
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, images = ?, rating = ?, review_count = ?, featured = ? WHERE id = ?',
      [name, description, price, category, stock, JSON.stringify(images || []), rating || 0, reviewCount || 0, featured ? 1 : 0, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const product = rows[0];
    res.json({ ...product, images: JSON.parse(product.images || '[]') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.product_id, c.quantity, p.id AS product_id_alias, p.name, p.price, p.images, p.stock
       FROM carts c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(rows.map((row) => ({
      productId: row.product_id,
      quantity: row.quantity,
      product: {
        id: row.product_id_alias,
        name: row.name,
        price: row.price,
        images: JSON.parse(row.images || '[]'),
        stock: row.stock,
      },
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load cart' });
  }
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const [existing] = await pool.query('SELECT id FROM carts WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
    if (existing.length) {
      await pool.query('UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity, req.user.id, productId]);
    } else {
      await pool.query('INSERT INTO carts (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)', [uuidv4(), req.user.id, productId, quantity]);
    }
    return res.status(201).json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

app.put('/api/cart/:productId', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?', [req.body.quantity, req.user.id, req.params.productId]);
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

app.delete('/api/cart/:productId', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM carts WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
});

app.delete('/api/cart', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM carts WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    const orderId = `ORD-${Date.now()}`;
    await pool.query(
      'INSERT INTO orders (id, user_id, total, status, shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country, shipping_phone, payment_type, payment_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, req.user.id, total, 'pending', shippingAddress.fullName, shippingAddress.address, shippingAddress.city, shippingAddress.state, shippingAddress.zipCode, shippingAddress.country, shippingAddress.phone, paymentMethod.type, JSON.stringify(paymentMethod)]
    );

    for (const item of items) {
      const itemId = uuidv4();
      await pool.query(
        'INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
        [itemId, orderId, item.productId, item.quantity, item.product.price]
      );
    }

    await pool.query('DELETE FROM carts WHERE user_id = ?', [req.user.id]);
    res.status(201).json({ id: orderId, status: 'pending' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.json({ ...orders[0], items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
