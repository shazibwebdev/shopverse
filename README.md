<div align="center">

# 🛍️ ShopVerse

### A Production-Ready Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

**[Live Demo](https://shopverse.vercel.app) · [GitHub](https://github.com/shazibwebdev/shopverse)**

</div>

---

## 📖 Overview

ShopVerse is a production-ready, full-stack e-commerce web application built with the MERN stack. It delivers a complete shopping experience — from AI-powered product discovery and server-side cart management to Stripe-verified checkout and comprehensive order tracking — alongside a fully functional admin dashboard.

### Key Highlights

- **🔐 Enterprise-Grade Auth** — JWT with SHA-256 hashed email verification tokens, auto-regeneration on expiry, and role-based access control
- **💳 Stripe Webhook Integration** — Atomic payment processing with automatic stock decrement, cart clearing, and branded confirmation emails
- **🤖 AI Shopping Assistant** — Groq-powered Llama 3.3 for natural language product search and recommendations
- **🔍 Fuzzy Search** — Fuse.js with 0.4 threshold across 5 fields for typo-tolerant product discovery
- **📊 Complete Admin Dashboard** — Store analytics, product CRUD, 6-stage order management, and user administration

---

## ✨ Features

### 🛒 Customer Experience

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse with category/brand filters, price range, and Fuse.js fuzzy search (0.4 threshold across name, description, brand, tags, category) |
| **Product Details** | Multi-image gallery, discount badges, stock status, customer reviews with rating aggregation |
| **Shopping Cart** | Server-side cart with Mongoose pre-save hooks for real-time price recalculation respecting discounts |
| **Wishlist** | Save favorites, toggle add/remove from any product card or detail page |
| **Multi-Step Checkout** | Shipping info, method selection (standard/express/overnight), 5% tax calculation, Stripe or COD payment |
| **Order Tracking** | 6-stage lifecycle: pending → confirmed → processing → shipped → delivered → cancelled |
| **AI Assistant** | Natural language product search and recommendations powered by Groq API (Llama 3.3 70B) |

### 🔐 Authentication & Security

| Feature | Implementation |
|---------|----------------|
| **JWT Authentication** | Stateless auth with Bearer tokens, bcrypt password hashing |
| **Email Verification** | SHA-256 hashed tokens (30-min expiry), auto-regeneration on expiry |
| **Password Reset** | Crypto token-based flow with 1-hour expiry |
| **Role-Based Access** | `user` and `admin` roles via composable Express middleware |
| **Account Blocking** | Admins can block/unblock users; blocked users denied login |

### 📊 Admin Dashboard

| Feature | Capabilities |
|---------|--------------|
| **Store Overview** | Total products, orders, revenue, user counts |
| **Product Management** | Full CRUD, multi-image Cloudinary uploads, tags, featured flags, discount pricing |
| **Order Management** | Search/filter orders, update status through full lifecycle |
| **User Management** | Block/unblock, promote/demote admin role, delete accounts |

### 🎨 UI/UX

- Smooth animations via **Framer Motion**
- Loading shimmer effects on product images
- Toast notifications for all user actions
- Fully responsive across mobile, tablet, and desktop
- Cart dropdown with backdrop blur overlay
- Animated product cards with hover effects

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| React Router DOM | v7 | Client-side routing |
| Tailwind CSS | v4 | Utility-first styling |
| Framer Motion | Latest | Animations and transitions |
| Axios | Latest | HTTP client with JWT interceptor |
| React Hook Form | Latest | Form state and validation |
| Stripe.js | Latest | Stripe Checkout redirect |
| React Toastify | Latest | Toast notifications |
| Lucide React | Latest | Icon library |
| Vite | Latest | Build tool and dev server |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js + Express | 5 | REST API server |
| MongoDB + Mongoose | 8 | Database and ODM |
| JSON Web Token | Latest | Stateless authentication |
| bcrypt | Latest | Password hashing |
| Stripe SDK | Latest | Payment sessions and webhooks |
| Nodemailer | Latest | Transactional emails via Gmail SMTP |
| Multer + Cloudinary | Latest | Image upload and cloud storage |
| Fuse.js | Latest | Fuzzy product search |
| Groq API | Llama 3.3 70B | AI shopping assistant |

---

## 📁 Project Structure

```
shopverse/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # Login, Signup, ForgotPassword, ResetPassword, VerifyEmail
│   │   │   ├── common/             # ProductCard, CartDropdown, Wishlist, FilterBar, AiChat
│   │   │   └── layout/             # Navbar, AdminDashboard, Checkout, Profile, HeroSection
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx     # Auth state, login, logout, signup
│   │   │   └── GlobalContext.jsx   # Cart, wishlist, UI state
│   │   ├── pages/
│   │   │   ├── MainLayoutPage.jsx
│   │   │   └── ProductDetailPage.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx       # All client-side routes
│   │   └── services/
│   │       └── api.js              # Axios instance with auth interceptor
│   └── vercel.json                 # SPA rewrite rules
│
└── server/                         # Node.js + Express backend
    ├── config/
    │   ├── db.js                   # MongoDB connection
    │   └── mail.js                 # Nodemailer transporter
    ├── controllers/
    │   ├── authController.js       # Register, login, email verification
    │   ├── productController.js    # CRUD, fuzzy search, reviews
    │   ├── cartController.js       # Cart CRUD, quantity management
    │   ├── orderController.js      # Place order, Stripe session, status updates
    │   ├── userController.js       # User management (admin)
    │   ├── aiController.js         # AI chat with Groq API
    │   └── ...
    ├── middleware/
    │   ├── authMiddleware.js       # JWT verification
    │   ├── authorize.js            # Role-based access control
    │   └── upload.js               # Multer + Cloudinary storage
    ├── models/
    │   ├── User.js                 # User schema with bcrypt pre-save hook
    │   ├── Product.js              # Product schema with review sub-document
    │   ├── Cart.js                 # Cart schema with pre-save price recalculation
    │   └── Order.js                # Order schema with full lifecycle fields
    ├── routes/                     # Express routers
    ├── utils/                      # Cloudinary, AI utilities
    ├── server.js                   # App entry + Stripe webhook handler
    └── vercel.json                 # Vercel serverless config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (test mode keys)
- Gmail account with App Password enabled
- Cloudinary account
- Groq API key (for AI assistant)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/shazibwebdev/shopverse.git
cd shopverse
```

#### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Assistant (Groq)
GROQ_API_KEY=your_groq_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### 3. Configure the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000
```

#### 4. Run the application

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

#### 5. Seed the database (optional)

```bash
cd server
node seed.js
```

---

## 🌐 Deployment

Both client and server are configured for **Vercel** deployment.

### Frontend (`client/vercel.json`)
- Rewrites all routes to `index.html` for SPA support

### Backend (`server/vercel.json`)
- Configures Express server as a Vercel serverless function

### Stripe Webhooks
Register your deployed server URL in the Stripe dashboard:
```
https://your-server.vercel.app/webhook
```

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/registerr` | Public | Register new user, send verification email |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/verify-email/:token` | Public | Verify email address |
| POST | `/resend-verification` | Public | Resend verification email |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/get-products` | Public | Paginated list with filters and fuzzy search |
| GET | `/get-single-product/:id` | Public | Single product with populated reviews |
| GET | `/get-filters` | Public | Available categories and brands |
| POST | `/add-review/:id` | Auth | Add a product review |
| GET | `/add-to-wishlist/:id` | Auth | Add to wishlist |
| GET | `/get-wishlist` | Auth | Get user's wishlist |
| DELETE | `/delete-from-wishlist/:id` | Auth | Remove from wishlist |
| POST | `/add` | Admin | Add new product |
| PUT | `/edit/:id` | Admin | Update product |
| DELETE | `/delete/:id` | Admin | Delete product |

### Cart — `/api/cart`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/get` | Auth | Fetch user's cart |
| POST | `/add/:id` | Auth | Add item or increment quantity |
| PATCH | `/qty-inc/:id` | Auth | Increment quantity |
| PATCH | `/qty-dec/:id` | Auth | Decrement quantity |
| DELETE | `/remove/:id` | Auth | Remove item |
| DELETE | `/clear` | Auth | Clear entire cart |

### Orders — `/api/order`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/place` | Auth | Place order (Stripe session or COD) |
| GET | `/user-orders` | Auth | Get user's orders |
| GET | `/detail/:id` | Auth | Get order detail |
| PATCH | `/cancel/:id` | Auth | Cancel order |
| GET | `/get` | Admin | Get all orders with filters |
| PATCH | `/update-status/:id` | Admin | Update order status |

### AI Assistant — `/api/ai`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/chat` | Public | Chat with AI shopping assistant |

### Stripe Webhook — `/webhook`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook` | Handles `checkout.session.completed` — marks order paid, decrements stock, clears cart, sends confirmation email |

---

## 🔧 Key Implementation Details

### Stripe Webhook Reliability
The webhook handler is mounted **before** `express.json()` to receive the raw body required for signature verification. On `checkout.session.completed`, it atomically:
- Marks the order as paid
- Decrements product stock
- Clears the user's cart
- Sends a branded HTML confirmation email

### Cart Price Recalculation
The Cart model uses a Mongoose `pre('save')` hook that:
- Populates cart items from Product collection
- Recalculates `totalCartPrice` on every save
- Respects discounted prices when applicable
- Keeps pricing logic server-side and consistent

### Fuzzy Search Implementation
Product search uses Fuse.js with:
- **0.4 threshold** for typo tolerance
- **5 search fields**: name, description, brand, tags, category
- Server-side pagination after fuzzy matching

### Email Verification Flow
- Tokens are hashed with **SHA-256** before storage
- **30-minute expiry** on verification tokens
- On login, if token is expired, a new one is **automatically generated and emailed**
- No manual "resend verification" required

### Role-Based Access Control
- `authorize(...roles)` middleware factory composed with `verifyToken`
- Frontend `ProtectedRoute` checks user role from context
- Redirects to `/unauthorized` if access denied

### AI Shopping Assistant
- Powered by **Groq API** with Llama 3.3 70B model
- Detects greetings vs. product searches
- Returns relevant products with AI-generated recommendations
- Handles general questions about the store

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Product Catalog
![Products](screenshots/products.png)

### Product Detail
![Product Detail](screenshots/product-detail.png)

### Cart
![Cart](screenshots/cart.png)

### Checkout
![Checkout](screenshots/checkout.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

### AI Assistant
![AI Chat](screenshots/ai-chat.png)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Shazib Hussain**

- GitHub: [@shazibwebdev](https://github.com/shazibwebdev)
- LinkedIn: [shazibwebdev](https://linkedin.com/in/shazibwebdev)
- Email: shazib.webdev@gmail.com

---

<div align="center">

**Built with ❤️ using the MERN Stack**

[⬆ Back to Top](#-shopverse)

</div>