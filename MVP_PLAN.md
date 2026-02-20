# Zulu Bead Crafts Shop — Full MVP Implementation Plan

> **Instructions:** Point the AI agent to this file and say "Implement the MVP plan in MVP_PLAN.md".
> The agent will execute each phase in order, committing after each phase is complete.

---

## Current State (What Already Exists)

- **Frontend:** React 18 + TypeScript + Vite 5
- **Styling:** Tailwind CSS 3 + shadcn/ui (Radix UI components)
- **Routing:** React Router DOM
- **Data:** Static `products.json` (no backend, no database)
- **Features built:**
  - Homepage with hero section
  - Product categories & browsing
  - Product grid with search & filtering
  - Shopping cart (add, remove, update quantity)
  - Product cards with images, prices, stock status
  - Toast notifications
- **Features NOT built:**
  - No backend / API
  - No database
  - No authentication
  - No admin panel
  - No product detail page
  - No checkout / orders
  - No payment integration
  - No customer accounts

---

## Tech Stack for MVP

### Frontend (already in place)
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3 + shadcn/ui
- React Router DOM
- React Hook Form + Zod (validation)
- TanStack React Query (data fetching)
- Recharts (admin charts)
- Lucide React (icons)

### Backend (to be added)
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing
- **multer** — File/image uploads
- **cors** — Cross-origin requests
- **dotenv** — Environment variables

### Payments
- **M-Pesa Daraja API** — STK Push for mobile payments

### Project Structure After MVP
```
zulu-bead-crafts-shop/
├── server/                    # Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   └── mpesaController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── admin.js           # Admin-only middleware
│   │   └── upload.js          # Multer config for images
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   └── mpesa.js
│   ├── uploads/               # Uploaded product images
│   ├── .env                   # Environment variables (NOT committed)
│   ├── server.js              # Express app entry point
│   └── package.json           # Backend dependencies
├── src/                       # Frontend (existing)
│   ├── components/
│   ├── pages/
│   ├── services/              # NEW: API service layer
│   │   ├── api.ts             # Axios/fetch base config
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── orderService.ts
│   │   └── mpesaService.ts
│   ├── context/               # NEW: React contexts
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/                 # Existing + new hooks
│   ├── types/                 # NEW: TypeScript interfaces
│   │   └── index.ts
│   └── ...
├── package.json               # Frontend dependencies
├── MVP_PLAN.md                # This file
└── README.md
```

---

## Phase 1: Backend Foundation & Database

### 1.1 Initialize Backend
- Create `server/` directory with its own `package.json`
- Install dependencies: `express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `multer`
- Create `server.js` entry point with Express app
- Configure CORS to allow frontend origin (`http://localhost:8080`)
- Create `server/config/db.js` for MongoDB connection using Mongoose
- Create `.env` file with:
  ```
  MONGO_URI=mongodb://localhost:27017/zulu-bead-shop
  JWT_SECRET=your_jwt_secret_here
  PORT=5000
  ```
- Add `"server": "node server/server.js"` script (or use nodemon for dev)

### 1.2 Database Models

**User Model (`server/models/User.js`)**
```
Fields:
- name: String, required
- email: String, required, unique
- password: String, required (hashed)
- phone: String
- address: { street, city, county, postalCode }
- role: String, enum ['customer', 'admin'], default 'customer'
- createdAt: Date, default now
```

**Category Model (`server/models/Category.js`)**
```
Fields:
- name: String, required, unique
- slug: String, required, unique (auto-generated)
- description: String
- image: String (URL/path)
- isActive: Boolean, default true
- createdAt: Date, default now
```

**Product Model (`server/models/Product.js`)**
```
Fields:
- name: String, required
- slug: String, required, unique
- description: String, required
- price: Number, required
- compareAtPrice: Number (for showing discounts)
- category: ObjectId, ref 'Category', required
- images: [String] (array of image paths)
- colors: [String]
- sizes: [String]
- inStock: Boolean, default true
- stockQuantity: Number, default 0
- featured: Boolean, default false
- tags: [String]
- createdAt: Date, default now
- updatedAt: Date, default now
```

**Order Model (`server/models/Order.js`)**
```
Fields:
- orderNumber: String, unique (auto-generated, e.g., ZB-20260219-001)
- customer: ObjectId, ref 'User' (optional for guest checkout)
- guestInfo: { name, email, phone } (for guest checkout)
- items: [{
    product: ObjectId, ref 'Product'
    name: String
    price: Number
    quantity: Number
    image: String
  }]
- shippingAddress: { street, city, county, postalCode }
- subtotal: Number
- shippingCost: Number
- total: Number
- paymentMethod: String, enum ['mpesa', 'cash_on_delivery']
- paymentStatus: String, enum ['pending', 'paid', 'failed'], default 'pending'
- mpesaReceiptNumber: String
- orderStatus: String, enum ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default 'pending'
- notes: String
- createdAt: Date, default now
- updatedAt: Date, default now
```

### 1.3 Seed Data
- Create a seed script (`server/seed.js`) that:
  - Creates an admin user (email: admin@zulubead.co.ke, password: Admin123!)
  - Migrates existing categories from `products.json` into MongoDB
  - Migrates existing products from `products.json` into MongoDB
  - Can be run with `node server/seed.js`

---

## Phase 2: Authentication API

### 2.1 Auth Middleware
- `server/middleware/auth.js` — Verify JWT token from Authorization header
- `server/middleware/admin.js` — Check if authenticated user has role 'admin'

### 2.2 Auth Routes (`server/routes/auth.js`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new customer | No |
| POST | `/api/auth/login` | Login (returns JWT) | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### 2.3 Auth Controller Logic
- **Register:** Validate input with express-validator, check if email exists, hash password, create user, return JWT
- **Login:** Find user by email, compare password, return JWT with user data
- **JWT payload:** `{ userId, role }`, expires in 7 days

---

## Phase 3: Product & Category API

### 3.1 Category Routes (`server/routes/categories.js`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/categories` | List all active categories | No |
| GET | `/api/categories/:slug` | Get single category | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category (soft) | Admin |

### 3.2 Product Routes (`server/routes/products.js`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/products` | List products (with pagination, search, filter by category) | No |
| GET | `/api/products/featured` | Get featured products | No |
| GET | `/api/products/:slug` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| POST | `/api/products/:id/images` | Upload product images | Admin |

### 3.3 Image Upload
- Use `multer` to handle image uploads
- Store in `server/uploads/products/`
- Serve static files: `app.use('/uploads', express.static('server/uploads'))`
- Accept multiple images per product (max 5)
- Resize/compress with `sharp` if needed

### 3.4 Query Features
- **Pagination:** `?page=1&limit=12`
- **Search:** `?search=beaded necklace`
- **Category filter:** `?category=necklaces`
- **Sort:** `?sort=price_asc` / `price_desc` / `newest` / `popular`
- **Price range:** `?minPrice=500&maxPrice=5000`

---

## Phase 4: Order API

### 4.1 Order Routes (`server/routes/orders.js`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/orders` | Create new order | Optional (guest allowed) |
| GET | `/api/orders` | List all orders (admin) | Admin |
| GET | `/api/orders/my-orders` | List customer's orders | Customer |
| GET | `/api/orders/:id` | Get single order | Owner/Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| PUT | `/api/orders/:id/cancel` | Cancel order | Owner/Admin |

### 4.2 Order Logic
- Validate all items exist and are in stock
- Calculate subtotal, shipping cost (free above KES 5,000), total
- Generate unique order number: `ZB-YYYYMMDD-XXX`
- Reduce stock quantities on order creation
- Send order confirmation (console log for MVP, email later)

---

## Phase 5: M-Pesa Integration

### 5.1 Daraja API Setup
- Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
- Get Consumer Key & Consumer Secret (sandbox first)
- Add to `.env`:
  ```
  MPESA_CONSUMER_KEY=your_key
  MPESA_CONSUMER_SECRET=your_secret
  MPESA_PASSKEY=your_passkey
  MPESA_SHORTCODE=174379
  MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
  MPESA_ENV=sandbox
  ```

### 5.2 M-Pesa Routes (`server/routes/mpesa.js`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/mpesa/stkpush` | Initiate STK push | No |
| POST | `/api/mpesa/callback` | Receive payment confirmation | No (Safaricom) |
| GET | `/api/mpesa/status/:orderId` | Check payment status | No |

### 5.3 STK Push Flow
1. Customer enters phone number at checkout
2. Frontend calls `/api/mpesa/stkpush` with `{ phone, amount, orderId }`
3. Backend gets OAuth token from Daraja API
4. Backend sends STK push request to Safaricom
5. Customer sees M-Pesa prompt on their phone
6. Customer enters PIN
7. Safaricom sends result to callback URL
8. Backend updates order payment status
9. Frontend polls `/api/mpesa/status/:orderId` to check result

---

## Phase 6: Frontend — Connect to Backend API

### 6.1 API Service Layer (`src/services/`)
- Create `api.ts` — Base fetch/axios config with base URL (`http://localhost:5000/api`)
- Auto-attach JWT token from localStorage to all requests
- Handle 401 responses (redirect to login)
- Create service files for each resource:
  - `authService.ts` — login, register, getProfile
  - `productService.ts` — getProducts, getProduct, createProduct, etc.
  - `categoryService.ts` — getCategories, createCategory, etc.
  - `orderService.ts` — createOrder, getOrders, getMyOrders, etc.
  - `mpesaService.ts` — initiatePayment, checkStatus

### 6.2 Auth Context (`src/context/AuthContext.tsx`)
- Provide `user`, `login()`, `logout()`, `register()`, `isAdmin`, `isAuthenticated`
- Store JWT in localStorage
- Auto-load user profile on app mount
- Wrap entire app with `<AuthProvider>`

### 6.3 Cart Context (`src/context/CartContext.tsx`)
- Move cart state from Index.tsx into context (global cart)
- Persist cart in localStorage
- Provide `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `cartTotal`

### 6.4 TypeScript Types (`src/types/index.ts`)
- Define shared interfaces: `User`, `Product`, `Category`, `Order`, `CartItem`, `ApiResponse`

---

## Phase 7: Frontend — Admin Panel

### 7.1 Admin Routes
| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | AdminLogin | Admin login form |
| `/admin` | AdminDashboard | Stats overview |
| `/admin/products` | AdminProducts | Product list with CRUD |
| `/admin/products/new` | AdminProductForm | Add new product |
| `/admin/products/:id/edit` | AdminProductForm | Edit product |
| `/admin/categories` | AdminCategories | Category management |
| `/admin/orders` | AdminOrders | All orders list |
| `/admin/orders/:id` | AdminOrderDetail | Single order detail |

### 7.2 Admin Layout
- Sidebar navigation with links to all admin sections
- Top bar with admin name and logout button
- Protected by `<AdminRoute>` component (redirects to login if not admin)
- Responsive: sidebar collapses to hamburger on mobile
- Dark theme to distinguish from customer-facing site

### 7.3 Admin Dashboard Page
- **Stats cards:** Total Products, Total Orders, Revenue (today/this month), Pending Orders
- **Revenue chart:** Line chart (Recharts) showing daily revenue for last 30 days
- **Recent orders table:** Last 10 orders with status badges
- **Quick actions:** Add Product, View Orders

### 7.4 Admin Product Management
- **Product list table:** Name, Image thumbnail, Price, Category, Stock, Status, Actions (edit/delete)
- **Search & filter** within table
- **Add/Edit product form:**
  - Name, description (textarea), price, compare-at price
  - Category dropdown (from API)
  - Image upload (drag & drop zone, preview thumbnails)
  - Colors (multi-select/tags input)
  - Sizes (multi-select/tags input)
  - Stock quantity input
  - Featured toggle
  - In Stock toggle
  - Tags input
- **Delete confirmation dialog** before deleting

### 7.5 Admin Category Management
- **Category list:** Name, Description, Image, Product Count, Actions
- **Add/Edit category form:** Name, description, image upload
- **Delete with warning** if category has products

### 7.6 Admin Order Management
- **Order list table:** Order #, Customer, Items count, Total, Payment Status, Order Status, Date
- **Filter by status** (tabs: All, Pending, Processing, Shipped, Delivered, Cancelled)
- **Order detail page:**
  - Customer info (name, email, phone)
  - Shipping address
  - Items list with images, quantities, prices
  - Order total breakdown
  - Payment status & M-Pesa receipt
  - Status update dropdown (with confirmation)
  - Timeline of status changes

---

## Phase 8: Frontend — Customer-Facing Pages

### 8.1 Product Detail Page (`/product/:slug`)
- Large product image gallery (main image + thumbnails, click to zoom)
- Product name, price, description
- Color selector (clickable color swatches)
- Size selector (if applicable)
- Quantity selector
- "Add to Cart" button (disabled if out of stock)
- Stock status indicator
- Related products section (same category)
- Breadcrumb navigation (Home > Category > Product)

### 8.2 Checkout Page (`/checkout`)
- **Order summary sidebar:** Cart items, subtotal, shipping, total
- **Customer info form:**
  - Name, Email, Phone (pre-filled if logged in)
  - Shipping address: Street, City, County, Postal Code
- **Payment method selection:**
  - M-Pesa (enter phone number for STK push)
  - Cash on Delivery
- **Place Order button**
- **M-Pesa payment flow:**
  - Show "Waiting for M-Pesa payment..." modal with spinner
  - Poll payment status every 3 seconds
  - Show success/failure result
- Redirect to order confirmation on success

### 8.3 Order Confirmation Page (`/order-confirmation/:orderNumber`)
- Green checkmark animation
- Order number displayed prominently
- Order summary
- "Continue Shopping" button
- "Track Order" button (if logged in)

### 8.4 Customer Auth Pages
- **Login page (`/login`):** Email & password form, link to register
- **Register page (`/register`):** Name, email, phone, password, confirm password
- **My Orders page (`/my-orders`):** List of customer's orders with status

### 8.5 Static Pages
- **About page (`/about`):**
  - Story of Zulu bead crafts and their cultural significance
  - Mission statement
  - Images of artisans at work
- **Contact page (`/contact`):**
  - Contact form (name, email, message)
  - Phone number, email, physical address
  - Google Maps embed (optional)
  - Social media links

### 8.6 Footer Component
- About the shop (short description)
- Quick links: Home, Shop, About, Contact
- Customer service: My Orders, Contact Us
- Social media icons (Instagram, Facebook, TikTok)
- Payment methods accepted
- Copyright notice

---

## Phase 9: Polish & UX Enhancements

### 9.1 Loading States
- Skeleton loaders for product cards, product detail, admin tables
- Full-page loading spinner on initial app load
- Button loading states (spinner inside button during API calls)

### 9.2 Error Handling
- Global error boundary component
- API error toast notifications
- 404 page for invalid routes
- Empty state illustrations (no products found, no orders, empty cart)

### 9.3 Responsive Design
- Mobile-first approach (already using Tailwind)
- Test all pages at 320px, 768px, 1024px, 1440px
- Mobile hamburger menu for main navigation
- Touch-friendly cart and checkout on mobile

### 9.4 SEO
- Proper `<title>` and `<meta description>` on every page
- Open Graph tags for social sharing
- Semantic HTML (header, main, section, article, footer)
- Alt text on all images

### 9.5 Performance
- Lazy load routes with `React.lazy()` + `Suspense`
- Image lazy loading (`loading="lazy"`)
- Optimistic UI updates for cart operations
- Debounced search input

---

## Phase 10: Deployment Preparation

### 10.1 Environment Variables
- Create `.env.example` for both frontend and backend
- Frontend: `VITE_API_URL`
- Backend: `MONGO_URI`, `JWT_SECRET`, `PORT`, M-Pesa credentials

### 10.2 Build & Deploy Checklist
- [ ] Backend deployed (e.g., Railway, Render, or VPS)
- [ ] MongoDB hosted (e.g., MongoDB Atlas free tier)
- [ ] Frontend built (`npm run build`) and deployed (e.g., Vercel, Netlify)
- [ ] Environment variables set on hosting platforms
- [ ] M-Pesa switched from sandbox to production
- [ ] Admin account created via seed script
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] Domain connected (if applicable)

### 10.3 README Update
- Project description
- Tech stack
- Setup instructions (frontend + backend)
- Environment variable documentation
- Seed data instructions
- Deployment guide

---

## Execution Order Summary

| Phase | What Gets Built | Estimated Effort |
|-------|----------------|-----------------|
| 1 | Backend + Database + Models + Seed | Foundation |
| 2 | Auth API (register, login, JWT) | Small |
| 3 | Products & Categories API | Medium |
| 4 | Orders API | Medium |
| 5 | M-Pesa Integration | Medium |
| 6 | Frontend API layer + Contexts | Medium |
| 7 | Admin Panel (dashboard, products, categories, orders) | Large |
| 8 | Customer pages (product detail, checkout, auth, about, contact) | Large |
| 9 | Polish (loading, errors, responsive, SEO) | Medium |
| 10 | Deployment prep | Small |

---

## Notes
- Each phase should be committed separately with a clear commit message
- Backend runs on port 5000, frontend on port 8080
- Use MongoDB Atlas (free tier) if local MongoDB is not available
- M-Pesa sandbox for testing, production keys for go-live
- Admin credentials after seeding: `admin@zulubead.co.ke` / `Admin123!`
- All API responses follow format: `{ success: boolean, data: any, message: string }`
