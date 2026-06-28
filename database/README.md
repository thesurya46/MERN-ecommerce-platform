# MySQL Database Setup for ShopHub

This folder contains a ready-to-import SQL script for your e-commerce website.

## Import into MySQL Server

### Option 1: Command line
```bash
mysql -u root -p < database/shophub_ecommerce.sql
```

### Option 2: MySQL Workbench
1. Open MySQL Workbench.
2. Connect to your local MySQL server.
3. Open the file [database/shophub_ecommerce.sql](shophub_ecommerce.sql).
4. Run the script.

## What it creates
- Database: `shophub_ecommerce`
- Tables: `users`, `products`, `reviews`, `carts`, `orders`, `order_items`
- Sample products for testing

## Connection settings for your app
Use these values in your backend environment file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shophub_ecommerce
```

If you want, I can next wire this database into a Node.js/Express backend for your website.
