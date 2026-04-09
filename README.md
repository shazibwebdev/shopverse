<div align="center">

# 🛍️ ShopVerse

### A Full-Stack E-Commerce Platform Built with the MERN Stack

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## Overview

ShopVerse is a production-ready, full-stack e-commerce web application built with the MERN stack. It features a complete shopping experience — from product discovery and cart management to Stripe-powered checkout and order tracking — alongside a fully functional admin dashboard for store management.

The project demonstrates real-world engineering practices including JWT-based authentication with email verification, Stripe webhook integration for reliable payment confirmation, role-based access control, fuzzy product search, and a polished, animated UI built with Framer Motion and Tailwind CSS.

---

## Live Demo

> Frontend and backend are both deployed on Vercel.
frontend=https://shazib-shopverse.vercel.app
backend=https://shazib-shopverse-api.vercel.app


---

## Features

### Customer-Facing
- **Product Catalog** — Browse products with category/brand filters, price range filtering, and fuzzy search (powered by Fuse.js) that handles typos and partial matches
- **Product Detail Page** — Multi-image gallery with navigation arrows, discount badges, stock status, and a customer review/rating system
- **Shopping Cart** — Persistent cart stored in MongoDB, with real-time quantity controls, stock limit enforcement, and live price recalculation
- **Wishlist** — Save products for later; toggle add/remove from any product card or detail page
- **Checkout** — Multi-step checkout with shipping info, shipping method selection (standard / express / overnight), order summary with 5% tax calculation, and choice of payment method
- **Stripe Payments** — Full Stripe Checkout Session integration with webhook-based payment confirmation, automatic stock decrement, and cart clearing on successful payment
- **Cash on Delivery** — Alternative payment method supported alongside Stripe
- **Order Tracking** — Users can view all their orders, filter by status or payment state, and see full order details
- **Order Cancellation** — Users can cancel pending orders from their dashboard
- **Transactional Emails** — Branded HTML emails for email verification, password reset, order confirmation, and payment success (via Nodemailer + Gmail SMTP)

### Authentication & Security
- **JWT Authentication** — Stateless auth with Bearer tokens stored in localStorage; all protected routes verified server-side
- **Email Verification** — New accounts require email verification before login; expired tokens are automatically regenerated on the next login attempt
- **Forgot / Reset Password** — Secure crypto token-based password reset flow with 1-hour expiry
- **Change Password** — Authenticated users can update their password from their profile
- **Resend Verification** — Users can request a new verification email from the login page
- **Role-Based Access Control** — `user` and `admin` roles enforced via middleware on all sensitive routes
- **Account Blocking** — Admins can block/unblock users; blocked users are denied login

### Admin Dashboard
- **Store Overview** — Key metrics: total products, orders, revenue, and user counts
- **Product Management** — Full CRUD for products with paginated listing, category/search filters, multi-image support, tag management, featured flag, and discounted price
- **Order Management** — View all orders with search and filter; update order status through the full lifecycle (pending → confirmed → processing → shipped → delivered → cancelled)
- **User Management** — View all users, toggle block/unblock status, promote/demote admin role, and delete accounts
- **Responsive Sidebar** — Collapsible sidebar with mobile overlay for a clean admin experience on all screen sizes

### UI & UX
- Smooth page and component animations via **Framer Motion**
- Loading shimmer effects on product images
- Toast notifications for all user actions (react-toastify)
- Fully responsive layout across mobile, tablet, and desktop
- Cart dropdown with backdrop blur overlay
- Animated product cards with hover effects, image dot navigation, and quick-action buttons

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations and transitions |
| Axios | HTTP client with JWT interceptor |
| React Hook Form | Form state and validation |
| Ant Design | UI component library |
| Stripe.js | Stripe Checkout redirect |
| React Toastify | Toast notifications |
| Lucide React / React Icons | Icon sets |
| Vite | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose 8 | Database and ODM |
| JSON Web Token (JWT) | Stateless authentication |
| bcrypt | Password hashing |
| Stripe SDK | Payment sessions and webhooks |
| Nodemailer | Transactional email via Gmail SMTP |
| Multer + Cloudinary | Image upload and cloud storage |
| Fuse.js | Fuzzy product search |
| express-async-handler | Async error handling |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

---

## Project Structure

```
shopverse/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Signup, ForgotPassword, ResetPassword, VerifyEmail
│   │   │   ├── common/         # ProductCard, CartDropdown, Wishlist, FilterBar, ProtectedRoute
│   │   │   └── layout/         # Navbar, AdminDashboard, UserDashboard, Checkout, Profile,
│   │   │                       # StoreOverview, ProductManagement, OrderManagement,
│   │   │                       # UserManagement, OrderDetail, Success, ErrorPage
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx  # Auth state, login, logout, signup
│   │   │   └── GlobalContext.jsx# Cart, wishlist, UI state
│   │   ├── pages/
│   │   │   ├── MainLayoutPage.jsx
│   │   │   └── ProductDetailPage.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx   # All client-side routes
│   │   └── services/
│   │       └── api.js          # Axios instance with auth interceptor
│   └── vercel.json             # SPA rewrite rules for Vercel
│
└── server/                     # Node.js + Express backend
    ├── config/
    │   ├── db.js               # MongoDB connection
    │   └── mail.js             # Nodemailer transporter
    ├── controllers/
    │   ├── authController.js   # Register, login, email verification
    │   ├── productController.js# CRUD, fuzzy search, reviews
    │   ├── cartController.js   # Cart CRUD, qty management
    │   ├── orderController.js  # Place order, Stripe session, status updates
    │   ├── userController.js   # User management (admin)
    │   ├── wishlistController.js
    │   ├── ResetPasswordController.js
    │   ├── mailController.js   # sendEmail utility
    │   └── uploadController.js # Cloudinary image upload
    ├── middleware/
    │   ├── authMiddleware.js   # JWT verification
    │   ├── authorize.js        # Role-based access control
    │   └── upload.js           # Multer + Cloudinary storage
    ├── models/
    │   ├── User.js             # User schema with bcrypt pre-save hook
    │   ├── Product.js          # Product schema with review sub-document
    │   ├── Cart.js             # Cart schema with pre-save price recalculation
    │   └── Order.js            # Order schema with full lifecycle fields
    ├── routes/                 # Express routers for each resource
    ├── utils/
    │   ├── cloudinary.js       # Cloudinary config
    │   ├── hfClient.js         # Hugging Face API client (AI search parser)
    │   └── searchParser.js     # NLP query parser using Mistral-7B
    ├── server.js               # App entry point + Stripe webhook handler
    └── vercel.json             # Vercel serverless deployment config
```

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/registerr` | Public | Register new user, send verification email |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/verify-email/:token` | Public | Verify email address |
| POST | `/resend-verification` | Public | Resend verification email |

### Password — `/api/password`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/forgot` | Public | Send password reset email |
| PATCH | `/reset/:token` | Public | Reset password via token |
| PATCH | `/change` | Auth | Change password (logged-in user) |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/get-products` | Public | Paginated product list with filters and fuzzy search |
| GET | `/get-single-product/:id` | Public | Single product with populated reviews |
| GET | `/get-filters` | Public | Available categories and brands |
| POST | `/add-review/:id` | Auth | Add a product review |
| GET | `/add-to-wishlist/:id` | Auth | Add product to wishlist |
| GET | `/get-wishlist` | Auth | Get user's wishlist |
| DELETE | `/delete-from-wishlist/:id` | Auth | Remove from wishlist |
| POST | `/add` | Admin | Add new product |
| PUT | `/edit/:id` | Admin | Update product |
| DELETE | `/delete/:id` | Admin | Delete product |

### Cart — `/api/cart`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/get` | Auth | Fetch user's cart |
| POST | `/add/:id` | Auth | Add item or increment quantity |
| PATCH | `/qty-inc/:id` | Auth | Increment cart item quantity |
| PATCH | `/qty-dec/:id` | Auth | Decrement cart item quantity |
| DELETE | `/remove/:id` | Auth | Remove item from cart |
| DELETE | `/clear` | Auth | Clear entire cart |

### Orders — `/api/order`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/place` | Auth | Place order; creates Stripe session or COD order |
| GET | `/user-orders` | Auth | Get current user's orders |
| GET | `/detail/:id` | Auth | Get single order detail |
| PATCH | `/cancel/:id` | Auth | Cancel an order |
| GET | `/get` | Admin | Get all orders with filters |
| PATCH | `/update-status/:id` | Admin | Update order status |

### Users — `/api/user`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/single` | Auth | Get current user's profile |
| PATCH | `/update` | Auth | Update username |
| GET | `/get` | Admin | Get all users with filters |
| PATCH | `/block-toggle/:id` | Admin | Block or unblock a user |
| PATCH | `/admin-toggle/:id` | Admin | Promote or demote admin role |
| DELETE | `/delete/:id` | Admin | Delete a user |

### Upload — `/api/upload`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Upload image to Cloudinary |

### Stripe Webhook — `/webhook`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/webhook` | Handles `checkout.session.completed` — marks order paid, decrements stock, clears cart, sends confirmation email |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (test mode keys)
- Gmail account with App Password enabled
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/shazibwebdev/shopverse.git
cd shopverse
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173


```

### 3. Configure the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the application

In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Seed the database (optional)

```bash
cd server
node seed.js
```

---

## Deployment

Both the client and server are configured for deployment on **Vercel**.

- `client/vercel.json` — rewrites all routes to `index.html` for SPA support
- `server/vercel.json` — configures the Express server as a Vercel serverless function

For Stripe webhooks in production, register your deployed server URL in the Stripe dashboard:
```
https://your-server.vercel.app/webhook
```


---

## Environment Variables Summary

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | Secret key for signing JWTs |
| `STRIPE_SECRET_KEY` | server | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | server | Stripe webhook signing secret |
| `EMAIL_USER` | server | Gmail address for sending emails |
| `EMAIL_PASS` | server | Gmail App Password |
| `CLOUDINARY_CLOUD_NAME` | server | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | server | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | server | Cloudinary API secret |
| `FRONTEND_URL` | server | Frontend base URL (for email links) |
| `HF_API_KEY` | server | Hugging Face API key (optional) |
| `VITE_API_URL` | client | Backend API base URL |

---

## Key Implementation Details

**Stripe Webhook Reliability** — The webhook handler is mounted before `express.json()` so it receives the raw body required for signature verification. On `checkout.session.completed`, it atomically marks the order as paid, decrements product stock, clears the user's cart, and sends a branded confirmation email.

**Cart Price Recalculation** — The Cart model uses a Mongoose `pre('save')` hook that populates cart items and recalculates `totalCartPrice` on every save, respecting discounted prices. This keeps pricing logic server-side and consistent.

**Fuzzy Search** — Product search uses Fuse.js with a 0.4 threshold across `name`, `description`, `brand`, `tags`, and `category` fields. Results are paginated client-side after fuzzy matching.

**Email Verification Flow** — Tokens are hashed with SHA-256 before storage. On login, if a token is expired, a new one is automatically generated and emailed without requiring the user to manually request it.

**Role-Based Access** — The `authorize(...roles)` middleware factory is composed with `verifyToken` on all admin routes. The frontend `ProtectedRoute` component checks the user's role from context and redirects to `/unauthorized` if access is denied.

**Image Upload** — Multer with `multer-storage-cloudinary` streams uploads directly to Cloudinary without writing to disk.

---

## Screenshots

> Add screenshots of your application here.

---


---

<div align="center">
  Built with ❤️ using the MERN Stack by: SHAZIB HUSSAIN (Full Stack MERN Developer)
</div>
