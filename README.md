# 🌸 Herwall — K-Pop Poster Printing Ecommerce

A full-stack ecommerce platform for premium K-Pop poster prints (BTS, BLACKPINK, and more), built for the Nepal market with eSewa, Khalti, and Cash on Delivery payment support.

---

## ✨ Features

### 🛍️ Customer Side
- **Pink aesthetic** UI with smooth animations and responsive design
- Browse posters by **artist** (BTS, BLACKPINK, TWICE, EXO, Stray Kids, NewJeans…)
- Filter by **category**, **search**, and **artist**
- Product detail page with **size selector** and pricing per size
- **Shopping cart** with quantity management (persisted in localStorage)
- **Mandatory login** to place orders
- Checkout with **eSewa**, **Khalti**, and **Cash on Delivery**
- **Order tracking** by Order ID (no login required to track)
- My Orders page with full order history
- **Contact page** with form submission
- Fully **mobile responsive**

### 🔧 Admin Panel (`/admin`)
- Secure **role-based access** (Admin / Moderator)
- **Dashboard** with stats: total orders, revenue, products, customers
- **Orders management**: search by Order ID or customer name, filter by status
- **Order detail**: view items, customer info, update order & payment status, add tracking notes
- **Products management**: add/edit/delete with image upload, multiple sizes, per-size pricing
- **Categories management**: add/edit/delete product categories
- **Staff management**: Admin can add/remove moderators with specific credentials
- **Role permissions** table visible in staff page

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/herwall
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000

ADMIN_NAME=Herwall Admin
ADMIN_EMAIL=admin@herwall.com
ADMIN_PASSWORD=Admin@Herwall2024
ADMIN_PHONE=9800000000
```

> ⚠️ **Change the admin credentials before going live!**

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- The admin user with credentials from `.env`
- 7 default categories (BTS, BLACKPINK, TWICE, EXO, Stray Kids, NewJeans, Aesthetic)
- 2 sample products

### 4. Run in Development

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) concurrently.

- 🛍️ **Shop:** http://localhost:3000
- ⚙️ **Admin:** http://localhost:3000/admin
- 🔌 **API:** http://localhost:5000/api

---

## 🔐 Admin Login

| Field | Value |
|-------|-------|
| Email | `admin@herwall.com` |
| Password | `Admin@Herwall2024` |

> Change these in `backend/.env` before seeding, or update directly in MongoDB.

---

## 📁 Project Structure

```
herwall/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT auth, role guards
│   ├── models/
│   │   ├── User.js           # User (customer/moderator/admin)
│   │   ├── Product.js        # Products with size variants
│   │   ├── Category.js       # Product categories
│   │   └── Order.js          # Orders with tracking history
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Me
│   │   ├── products.js       # CRUD + image upload
│   │   ├── categories.js     # CRUD
│   │   ├── orders.js         # Place, track, manage orders
│   │   ├── admin.js          # Stats, staff management
│   │   └── contact.js        # Contact form
│   ├── uploads/              # Uploaded product images
│   ├── seed.js               # Database seeder
│   ├── server.js             # Express app entry
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.js
        │   │   └── Footer.js
        │   ├── shop/
        │   │   └── ProductCard.js
        │   └── admin/
        │       └── AdminLayout.js
        ├── context/
        │   ├── AuthContext.js   # Login, register, logout
        │   └── CartContext.js   # Cart with localStorage
        ├── pages/
        │   ├── shop/
        │   │   ├── HomePage.js
        │   │   ├── ShopPage.js
        │   │   ├── ProductPage.js
        │   │   ├── CartPage.js
        │   │   ├── CheckoutPage.js
        │   │   ├── OrderSuccessPage.js
        │   │   ├── OrdersPage.js
        │   │   ├── TrackOrderPage.js
        │   │   └── ContactPage.js
        │   ├── auth/
        │   │   ├── LoginPage.js
        │   │   └── RegisterPage.js
        │   └── admin/
        │       ├── AdminDashboard.js
        │       ├── AdminOrders.js
        │       ├── AdminOrderDetail.js
        │       ├── AdminProducts.js
        │       ├── AdminCategories.js
        │       └── AdminStaff.js
        ├── utils/
        │   └── api.js           # Axios instance with auth interceptor
        ├── App.js               # Routes
        └── index.css            # Tailwind + custom pink theme
```

---

## 💳 Payment Integration Notes

### eSewa & Khalti
Currently set up as **manual payment flow**:
1. Customer selects eSewa or Khalti at checkout
2. Order is placed with `paymentStatus: pending`
3. Admin/team contacts customer via WhatsApp with payment details
4. Admin marks payment as `paid` in the order detail panel

To integrate **live eSewa/Khalti SDK**, replace the checkout flow in `CheckoutPage.js` with their respective SDK calls and add webhook handlers in the backend.

### Cash on Delivery
Works out of the box — payment collected on delivery.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | 🔒 User |

### Products
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/products` | Public |
| GET | `/api/products/:slug` | Public |
| POST | `/api/products` | 🔒 Staff |
| PUT | `/api/products/:id` | 🔒 Staff |
| DELETE | `/api/products/:id` | 🔒 Staff |

### Orders
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/orders` | 🔒 User |
| GET | `/api/orders/my` | 🔒 User |
| GET | `/api/orders/track/:orderId` | Public |
| GET | `/api/orders` | 🔒 Staff |
| GET | `/api/orders/:id` | 🔒 Staff |
| PUT | `/api/orders/:id/status` | 🔒 Staff |

### Admin
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/admin/stats` | 🔒 Admin |
| GET | `/api/admin/staff` | 🔒 Admin |
| POST | `/api/admin/moderator` | 🔒 Admin |
| DELETE | `/api/admin/moderator/:id` | 🔒 Admin |

---

## 🏗️ Production Deployment

### Backend (e.g. Railway, Render, VPS)
1. Set environment variables from `.env.example`
2. Use MongoDB Atlas for cloud database
3. Run `npm start` in the `backend/` folder

### Frontend (e.g. Vercel, Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Run `npm run build` in the `frontend/` folder
3. Deploy the `build/` folder

---

## 📞 Support & Contact
For questions about this codebase, reach out via the Contact page in the app.

---

Made with 🌸 for K-Pop fans in Nepal
