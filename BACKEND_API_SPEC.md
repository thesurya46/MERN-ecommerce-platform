# Backend API Specification

This document outlines the required API endpoints for connecting the frontend to a MySQL database.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
Login existing user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### GET /auth/me
Get current user (protected)
```json
Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

### PUT /auth/profile
Update user profile (protected)
```json
Request:
{
  "name": "Jane Doe",
  "address": "456 Oak Ave",
  "phone": "+9876543210"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "role": "user",
  "address": "456 Oak Ave",
  "phone": "+9876543210"
}
```

---

## Product Endpoints

### GET /products
Get all products with optional filters
```
Query params:
- category: string (optional)
- minPrice: number (optional)
- maxPrice: number (optional)
- minRating: number (optional)
- search: string (optional)
- sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' (optional)

Response:
[
  {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 50,
    "images": ["url1", "url2"],
    "rating": 4.5,
    "reviewCount": 128,
    "featured": true
  }
]
```

### GET /products/featured
Get featured products
```json
Response:
[
  {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 50,
    "images": ["url1", "url2"],
    "rating": 4.5,
    "reviewCount": 128,
    "featured": true
  }
]
```

### GET /products/:id
Get single product
```json
Response:
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "images": ["url1", "url2"],
  "rating": 4.5,
  "reviewCount": 128,
  "featured": true
}
```

### POST /products
Create product (admin only, protected)
```json
Request:
{
  "name": "New Product",
  "description": "Description",
  "price": 49.99,
  "category": "Electronics",
  "stock": 100,
  "images": ["url1"],
  "rating": 0,
  "reviewCount": 0
}

Response:
{
  "id": "uuid",
  "name": "New Product",
  ...
}
```

### PUT /products/:id
Update product (admin only, protected)
```json
Request:
{
  "name": "Updated Product",
  "price": 59.99,
  "stock": 75
}

Response:
{
  "id": "uuid",
  "name": "Updated Product",
  "price": 59.99,
  "stock": 75,
  ...
}
```

### DELETE /products/:id
Delete product (admin only, protected)
```json
Response:
{
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

### GET /cart
Get user's cart (protected)
```json
Response:
[
  {
    "productId": "uuid",
    "quantity": 2,
    "product": {
      "id": "uuid",
      "name": "Product Name",
      "price": 99.99,
      "images": ["url1"],
      "stock": 50
    }
  }
]
```

### POST /cart
Add item to cart (protected)
```json
Request:
{
  "productId": "uuid",
  "quantity": 1
}

Response:
[
  {
    "productId": "uuid",
    "quantity": 1,
    "product": {...}
  }
]
```

### PUT /cart/:productId
Update cart item quantity (protected)
```json
Request:
{
  "quantity": 3
}

Response:
[
  {
    "productId": "uuid",
    "quantity": 3,
    "product": {...}
  }
]
```

### DELETE /cart/:productId
Remove item from cart (protected)
```json
Response:
[
  // Updated cart
]
```

### DELETE /cart
Clear entire cart (protected)
```json
Response:
{
  "message": "Cart cleared"
}
```

---

## Order Endpoints

### POST /orders
Create new order (protected)
```json
Request:
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "product": {...}
    }
  ],
  "total": 199.98,
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": {
    "type": "card",
    "cardNumber": "****1234",
    "cardHolder": "John Doe",
    "expiryDate": "12/25"
  }
}

Response:
{
  "id": "ORD-123456",
  "userId": "uuid",
  "items": [...],
  "total": 199.98,
  "status": "pending",
  "shippingAddress": {...},
  "paymentMethod": {...},
  "createdAt": "2026-05-26T10:30:00Z",
  "updatedAt": "2026-05-26T10:30:00Z"
}
```

### GET /orders
Get user's orders (protected)
```json
Response:
[
  {
    "id": "ORD-123456",
    "userId": "uuid",
    "items": [...],
    "total": 199.98,
    "status": "delivered",
    "shippingAddress": {...},
    "paymentMethod": {...},
    "createdAt": "2026-05-26T10:30:00Z",
    "updatedAt": "2026-05-27T15:45:00Z"
  }
]
```

### GET /orders/all
Get all orders (admin only, protected)
```json
Response:
[
  {
    "id": "ORD-123456",
    "userId": "uuid",
    "items": [...],
    "total": 199.98,
    "status": "pending",
    "shippingAddress": {...},
    "createdAt": "2026-05-26T10:30:00Z"
  }
]
```

### GET /orders/:id
Get single order (protected)
```json
Response:
{
  "id": "ORD-123456",
  "userId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "price": 99.99,
        "images": ["url1"]
      }
    }
  ],
  "total": 199.98,
  "status": "shipped",
  "shippingAddress": {...},
  "paymentMethod": {...},
  "createdAt": "2026-05-26T10:30:00Z",
  "updatedAt": "2026-05-27T15:45:00Z"
}
```

### PATCH /orders/:id/status
Update order status (admin only, protected)
```json
Request:
{
  "status": "shipped"
}

Response:
{
  "id": "ORD-123456",
  "status": "shipped",
  "updatedAt": "2026-05-27T15:45:00Z",
  ...
}
```

---

## Review Endpoints

### GET /reviews/:productId
Get reviews for a product
```json
Response:
[
  {
    "id": "uuid",
    "productId": "uuid",
    "userId": "uuid",
    "userName": "John Doe",
    "rating": 5,
    "comment": "Great product!",
    "createdAt": "2026-05-26T10:30:00Z"
  }
]
```

### POST /reviews
Add a review (protected)
```json
Request:
{
  "productId": "uuid",
  "rating": 5,
  "comment": "Excellent product!"
}

Response:
{
  "id": "uuid",
  "productId": "uuid",
  "userId": "uuid",
  "userName": "John Doe",
  "rating": 5,
  "comment": "Excellent product!",
  "createdAt": "2026-05-26T10:30:00Z"
}
```

---

## Payment Endpoint

### POST /payment/process
Process payment (protected)
```json
Request:
{
  "amount": 199.98,
  "paymentMethod": {
    "type": "card",
    "cardNumber": "4242424242424242",
    "cardHolder": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}

Response:
{
  "success": true,
  "transactionId": "TXN-123456789"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Middleware Requirements

1. **Authentication Middleware**: Verify JWT token
2. **Admin Middleware**: Check if user has admin role
3. **CORS**: Enable CORS for frontend origin
4. **Body Parser**: Parse JSON request bodies
5. **Error Handler**: Catch and format errors
6. **Rate Limiting**: Prevent abuse
7. **Input Validation**: Validate request data

## Security Best Practices

1. Hash passwords with bcrypt (salt rounds: 10+)
2. Use JWT with expiration (e.g., 24 hours)
3. Sanitize all user inputs
4. Use parameterized queries to prevent SQL injection
5. Implement HTTPS in production
6. Add request rate limiting
7. Validate and sanitize file uploads
8. Store sensitive data in environment variables
9. Implement CSRF protection
10. Add security headers (helmet.js)
