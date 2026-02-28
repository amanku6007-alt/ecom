




# 🛍️ ShopNow — Full-Stack ECommerce App with Admin Panel

A complete, production-ready eCommerce platform built with **React**, **Redux Toolkit**, **Tailwind CSS**, and **MongoDB**.

---

## 🗂️ Project Structure

```
ecommerce-app/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login, register, profile
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── categoryController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js             # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/                 # Express routers
│   ├── utils/
│   │   └── seeder.js           # Seed demo data
│   ├── server.js               # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.jsx   # Sidebar + navigation
│   │   │   ├── common/
│   │   │   │   └── ProductCard.jsx
│   │   │   └── customer/
│   │   │       ├── Navbar.jsx
│   │   │       └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx     # Stats + charts
│   │   │   │   ├── AdminProducts.jsx # CRUD with table
│   │   │   │   ├── AdminOrders.jsx   # Order management
│   │   │   │   ├── AdminUsers.jsx    # User list
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   └── ProductForm.jsx   # Create/edit product
│   │   │   └── customer/
│   │   │       ├── Home.jsx          # Hero + featured
│   │   │       ├── Products.jsx      # Filter + paginate
│   │   │       ├── ProductDetail.jsx
│   │   │       ├── Cart.jsx
│   │   │       ├── Checkout.jsx
│   │   │       ├── OrderSuccess.jsx
│   │   │       ├── MyOrders.jsx
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       └── Profile.jsx
│   │   ├── store/
│   │   │   ├── index.js              # Redux store
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── orderSlice.js
│   │   │       └── adminSlice.js
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + interceptors
│   │   ├── App.jsx                  # Routes
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind + custom classes
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                # Root scripts (run both)
└── README.md
```

---



## 🚀 Quick Start (Step by Step)

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Atlas](https://cloud.mongodb.com) free tier)

---

### Step 1: Clone & Setup

```bash
# Download and extract the project, then:
cd ecommerce-app

# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install:all
```

---

### Step 2: Configure Backend Environment

```bash
cd backend

# Copy example env file
cp .env.example .env
```

Edit `.env` with your values:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce     # or your Atlas URI
JWT_SECRET=your_super_secret_key_here_make_it_long_random
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:3000

# Optional - Stripe for real payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

---

### Step 3: Seed Demo Data

```bash
# From project root:
npm run seed

# This creates:
# ✅ Admin user:  admin@ecommerce.com / admin123
# ✅ Normal user: user@ecommerce.com  / user123
# ✅ 5 categories (Electronics, Clothing, Books, Home, Sports)
# ✅ 12 sample products
```

---

### Step 4: Start Development Servers

```bash
# From project root — starts both backend (5000) and frontend (3000):
npm run dev

# Or start separately:
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

---

### Step 5: Open in Browser

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Customer storefront |
| http://localhost:3000/admin | Admin panel |
| http://localhost:5000/api/health | API health check |

---

## 🔐 Authentication

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@ecommerce.com | admin123 | Full admin panel + store |
| User | user@ecommerce.com | user123 | Store + orders + profile |

---

## ✨ Features

### Customer Store
- 🏠 **Homepage** — hero banner, categories, featured products
- 🔍 **Products** — search, filter by category, sort, pagination
- 📦 **Product Detail** — images, reviews, add to cart
- 🛒 **Cart** — add/remove/update, persistent in localStorage
- 💳 **Checkout** — shipping address form (demo payment mode)
- 📋 **My Orders** — order history with status
- 👤 **Profile** — update name, phone

### Admin Panel (/admin)
- 📊 **Dashboard** — revenue + orders charts, recent orders, top products
- 📦 **Products** — list, search, create, edit, delete
- 🛍️ **Orders** — all orders, update status inline (pending → delivered)
- 👥 **Users** — list all users with roles
- 🏷️ **Categories** — create, edit, delete

---

## 🔌 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me              [Protected]
PUT    /api/auth/profile         [Protected]

GET    /api/products             ?keyword= &category= &sort= &page= &limit=
GET    /api/products/featured
GET    /api/products/:id
POST   /api/products             [Admin]
PUT    /api/products/:id         [Admin]
DELETE /api/products/:id         [Admin]
POST   /api/products/:id/reviews [Protected]

GET    /api/orders/my            [Protected]
POST   /api/orders               [Protected]
GET    /api/orders               [Admin]
PUT    /api/orders/:id/status    [Admin]

GET    /api/categories
POST   /api/categories           [Admin]
PUT    /api/categories/:id       [Admin]

GET    /api/users                [Admin]
GET    /api/dashboard/stats      [Admin]
```

---

## 🔧 Extending the App

### Add Real Payments (Stripe)
1. Create account at stripe.com
2. Add keys to `.env`
3. Install Stripe in frontend: `npm install @stripe/react-stripe-js @stripe/stripe-js`
4. Replace the demo payment in `Checkout.jsx` with `<Elements>` + `<PaymentElement>`

### Add Image Uploads (Cloudinary)
1. Create account at cloudinary.com
2. Add credentials to `.env`
3. In `productController.js`, use `cloudinary.v2.uploader.upload()`
4. Add `multer` middleware to product routes

### Deploy to Production

**Backend (Railway/Render):**
```bash
# Set environment variables on your hosting platform
# Change NODE_ENV=production
```

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Deploy the `dist/` folder
# Set API URL in vite.config.js proxy or use VITE_API_URL env var
```

**MongoDB Atlas:**
- Use your Atlas connection string as `MONGO_URI`
- Whitelist your server's IP in Atlas Network Access

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router v6 |
| Styling | Tailwind CSS, custom component classes |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, cookies |
| Build Tool | Vite |
| Icons | Lucide React |

---

## 📝 Notes

- Cart persists in `localStorage` across sessions
- JWT tokens stored in both cookies and localStorage for compatibility
- Admin routes are protected by both `protect` and `adminOnly` middleware
- Product search uses MongoDB text indexes — run `db.products.createIndex({name:'text', description:'text'})` if needed
- The seeder auto-generates SKUs; you can customize in `utils/seeder.js`
