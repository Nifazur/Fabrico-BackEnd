# Fabrico Backend API

A comprehensive e-commerce backend API built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**. This robust system provides complete functionality for user management, product catalog, shopping cart, and order processing with secure authentication.

## 🌐 Live API

**Base URL:** https://fabrico-backend-one.vercel.app

## 🚀 Features

### Authentication & Authorization

- **Dual Authentication System**: Email/Password + Google OAuth2.0
- **JWT-based Authentication**: Access & Refresh token implementation
- **Role-based Access Control**: USER, ADMIN, SUPER_ADMIN roles
- **Secure Session Management**: Express sessions with Passport.js
- **Password Security**: Bcrypt hashing with configurable salt rounds

### User Management

- User registration and profile management
- Social login integration (Google)
- Password change functionality
- User status management (Active/Inactive/Blocked)
- Address management

### Product Management

- Complete CRUD operations for products
- Product variants (size, color, SKU)
- Inventory management with stock tracking
- Product categorization and filtering
- Search functionality with multiple criteria
- Slug-based URL friendly endpoints

### Shopping Cart

- Add/Remove items from cart
- Update item quantities
- Variant-specific cart items
- Automatic total calculation
- Stock validation

### Order Management

- Complete order lifecycle management
- Multiple payment methods (COD, Card, Mobile Banking)
- Order status tracking (Pending → Delivered)
- Shipping address management
- Order history and tracking
- Automatic stock deduction

### Security & Validation

- Input validation with Zod schemas
- Comprehensive error handling
- CORS configuration
- Cookie security (httpOnly, secure, sameSite)
- Request rate limiting ready
- Environment-based configuration

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Local & Google OAuth)
- **Validation**: Zod
- **Security**: bcryptjs, JWT
- **Environment**: dotenv
- **HTTP Status**: http-status-codes

## 📁 Project Structure

```

src/

├── app.ts                          # Express app configuration

├── server.ts                       # Server entry point

└── app/

    ├── config/

    │   ├── env.ts                  # Environment variables

    │   └── passport.ts             # Passport strategies

    ├── errorHelpers/

    │   └── AppError.ts             # Custom error class

    ├── helpers/

    │   ├── handleCastError.ts      # MongoDB cast error handler

    │   ├── handleDuplicateError.ts # Duplicate key error handler

    │   ├── handlerValidationError.ts # Validation error handler

    │   └── handlerZodError.ts      # Zod error handler

    ├── interfaces/

    │   ├── error.types.ts          # Error type definitions

    │   └── index.d.ts              # Global type declarations

    ├── middlewares/

    │   ├── checkAuth.ts            # Authentication middleware

    │   ├── globalErrorHandler.ts   # Global error handler

    │   ├── notFound.ts             # 404 handler

    │   └── validateRequest.ts      # Request validation middleware

    ├── modules/

    │   ├── auth/                   # Authentication module

    │   ├── user/                   # User management module

    │   ├── product/                # Product management module

    │   ├── cart/                   # Shopping cart module

    │   └── order/                  # Order management module

    ├── routes/

    │   └── index.ts                # Route aggregation

    └── utils/

        ├── catchAsync.ts           # Async error wrapper

        ├── jwt.ts                  # JWT utilities

        ├── seedSuperAdmin.ts       # Admin seeding

        ├── sendResponse.ts         # Response formatter

        ├── setCookie.ts            # Cookie utilities

        └── userTokens.ts           # Token management

```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env

# Server Configuration

PORT=5000

NODE_ENV=development

FRONTEND_URL=http://localhost:3000


# Database

DB_URL=mongodb://localhost:27017/fabrico


# JWT Configuration

JWT_ACCESS_SECRET=your_access_secret_key

JWT_ACCESS_EXPIRES=1d

JWT_REFRESH_SECRET=your_refresh_secret_key

JWT_REFRESH_EXPIRES=7d


# Security

BCRYPT_SALT_ROUND=12

EXPRESS_SESSION_SECRET=your_session_secret


# Google OAuth

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback


# Admin Account

SUPER_ADMIN_EMAIL=admin@fabrico.com

SUPER_ADMIN_PASSWORD=Admin@123

```

## 📚 API Documentation

### Base URL

```

https://fabrico-backend-one.vercel.app/api/v1

```

### Authentication Endpoints

#### Register User

```http

POST /auth/register

Content-Type: application/json


{

  "name": "John Doe",

  "email": "john@example.com",

  "password": "SecurePass@123",

  "phone": "01712345678"

}

```

#### Login with Credentials

```http

POST /auth/login

Content-Type: application/json


{

  "email": "john@example.com",

  "password": "SecurePass@123"

}

```

#### Google Authentication

```http

GET /auth/google?redirect=/dashboard

```

#### Refresh Access Token

```http

POST /auth/refresh-token

```

#### Logout

```http

POST /auth/logout

```

### User Management

#### Get My Profile

```http

GET /users/me

Authorization: Bearer {accessToken}

```

#### Update Profile

```http

PATCH /users/me

Authorization: Bearer {accessToken}

Content-Type: application/json


{

  "name": "Updated Name",

  "phone": "01987654321",

  "address": {

    "street": "123 Main St",

    "city": "Dhaka",

    "country": "Bangladesh"

  }

}

```

#### Change Password

```http

PATCH /users/change-password

Authorization: Bearer {accessToken}

Content-Type: application/json


{

  "oldPassword": "oldPass@123",

  "newPassword": "newPass@456"

}

```

### Product Management

#### Get All Products

```http

GET /products?page=1&limit=12&category=clothing&search=shirt

```

**Query Parameters:**

- `search` - Search in name, description, tags
- `category` - Filter by category
- `subcategory` - Filter by subcategory
- `size` - Filter by available size
- `color` - Filter by available color
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `brand` - Filter by brand
- `gender` - Filter by gender (male/female/unisex)
- `sort` - Sort order (default: -createdAt)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

#### Get Product by Slug

```http

GET /products/{slug}

```

#### Create Product (Admin Only)

```http

POST /products

Authorization: Bearer {adminToken}

Content-Type: application/json


{

  "name": "Classic T-Shirt",

  "description": "Comfortable cotton t-shirt",

  "category": "Clothing",

  "subcategory": "T-Shirts",

  "brand": "Fabrico",

  "price": 1299,

  "comparePrice": 1599,

  "images": ["https://example.com/image1.jpg"],

  "variants": [

    {

      "size": "M",

      "color": "Blue",

      "stock": 50,

      "sku": "TS-BLU-M-001"

    }

  ],

  "tags": ["casual", "cotton"],

  "featured": true

}

```

### Shopping Cart

#### Get My Cart

```http

GET /cart

Authorization: Bearer {accessToken}

```

#### Add Item to Cart

```http

POST /cart/items

Authorization: Bearer {accessToken}

Content-Type: application/json


{

  "productId": "64f5b2c4e5f6a7b8c9d0e1f2",

  "variant": {

    "size": "M",

    "color": "Blue",

    "sku": "TS-BLU-M-001"

  },

  "quantity": 2

}

```

#### Update Cart Item Quantity

```http

PATCH /cart/items/{itemId}

Authorization: Bearer {accessToken}

Content-Type: application/json


{

  "quantity": 3

}

```

#### Remove Item from Cart

```http

DELETE /cart/items/{itemId}

Authorization: Bearer {accessToken}

```

#### Clear Cart

```http

DELETE /cart

Authorization: Bearer {accessToken}

```

### Order Management

#### Create Order

```http

POST /orders

Authorization: Bearer {accessToken}

Content-Type: application/json


{

  "shippingAddress": {

    "fullName": "John Doe",

    "phone": "01712345678",

    "street": "123 Main Street",

    "city": "Dhaka",

    "state": "Dhaka",

    "country": "Bangladesh",

    "zipCode": "1000"

  },

  "paymentMethod": "CASH_ON_DELIVERY",

  "notes": "Please call before delivery"

}

```

#### Get My Orders

```http

GET /orders/me?page=1&limit=10&status=PENDING

Authorization: Bearer {accessToken}

```

#### Get Order by Order Number

```http

GET /orders/{orderNumber}

```

#### Get All Orders (Admin Only)

```http

GET /orders?page=1&status=PENDING

Authorization: Bearer {adminToken}

```

#### Update Order Status (Admin Only)

```http

PATCH /orders/{orderId}/status

Authorization: Bearer {adminToken}

Content-Type: application/json


{

  "orderStatus": "SHIPPED",

  "trackingNumber": "TRK123456789",

  "estimatedDelivery": "2024-01-15T10:00:00.000Z"

}

```

## 🔐 Authentication Flow

### JWT Token Structure

```json

{

"userId":"user_id",

"email":"user@example.com",

"role":["USER"]

}

```

### Cookie Configuration

- **httpOnly**: true (prevents XSS)
- **secure**: true in production
- **sameSite**: "none" in production, "lax" in development
- **maxAge**: 24 hours for session

### Role-Based Access Control

- **USER**: Access to profile, cart, orders
- **ADMIN**: User management, product management, order management
- **SUPER_ADMIN**: Full system access

## 🛡️ Security Features

### Input Validation

- **Zod schemas** for request validation
- **Email format** validation
- **Password strength** requirements
- **Phone number** format validation (Bangladesh)

### Error Handling

- **Custom AppError** class
- **MongoDB error** handling (CastError, ValidationError, DuplicateKey)
- **Zod validation** error handling
- **Global error handler** with environment-specific responses

### Security Headers

- **CORS** configuration with specific origins
- **Trust proxy** for secure cookies behind reverse proxy
- **Cookie security** settings

## 📊 Data Models

### User Schema

```typescript

{

  name:string;

  email:string;

  password?: string;

  phone?: string;

  picture?: string;

  role:Role[];

  address?: IAddress;

  isVerified:boolean;

  isActive:IsActive;

  isDeleted:boolean;

  auths:IAuthProvider[];

}

```

### Product Schema

```typescript

{

  name:string;

  slug:string;

  description:string;

  category:string;

  subcategory?: string;

  brand?: string;

  price:number;

  comparePrice?: number;

  images:string[];

  variants:IProductVariant[];

  tags?: string[];

  featured:boolean;

  isActive:boolean;

  totalStock:number;

  ratings:number;

  numReviews:number;

}

```

### Order Schema

```typescript

{

  orderNumber:string;

  user:ObjectId;

  items:IOrderItem[];

  shippingAddress:IShippingAddress;

  paymentMethod:PaymentMethod;

  paymentStatus:PaymentStatus;

  orderStatus:OrderStatus;

  subtotal:number;

  shippingCost:number;

  tax:number;

  total:number;

  trackingNumber?: string;

  estimatedDelivery?: Date;

}

```

## 🚦 Order Status Flow

```

PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED

                                         ↘ CANCELLED

```

## 💳 Payment Methods

- **CASH_ON_DELIVERY**: Pay when receiving the order
- **CARD**: Online card payment (integration ready)
- **MOBILE_BANKING**: bKash, Nagad, Rocket (integration ready)

## 🎯 Response Format

### Success Response

```json

{

"statusCode":200,

"success":true,

"message":"Products retrieved successfully",

"data":[...],

"meta":{

"total":150,

"page":1,

"limit":12,

"totalPages":13

}

}

```

### Error Response

```json

{

"success":false,

"message":"Validation Error",

"errorSources":[

{

"path":"email",

"message":"Invalid email format"

}

]

}

```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash

   git clone <repository-url>

   cd fabrico-backend

   ```

```


2. **Install dependencies**

   ```bash

   npm install

```

3. **Set up environment variables**

   ```bash

   cp .env.example .env

   # Update the .env file with your configurations

   ```

```


4. **Start development server**

   ```bash

   npm run dev

```

5. **Build for production**

   ```bash

   npm run build

   ```

```


6. **Start production server**

   ```bash

   npm start

```

## 📝 Available Scripts

```bash

npm run dev      # Start development server with hot reload

npm run build    # Build TypeScript to JavaScript

npm start        # Start production server

npm run lint     # Run ESLint

npm test         # Run tests (if configured)

```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact:

- **Email**: support@fabrico.com
- **Documentation**: https://fabrico-backend-one.vercel.app
- **API Status**: https://fabrico-backend-one.vercel.app/api/v1

---

**Built with ❤️ by the Fabrico Team**
