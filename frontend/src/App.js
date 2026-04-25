import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Shop pages
import HomePage from './pages/shop/HomePage';
import ShopPage from './pages/shop/ShopPage';
import ProductPage from './pages/shop/ProductPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderSuccessPage from './pages/shop/OrderSuccessPage';
import OrdersPage from './pages/shop/OrdersPage';
import TrackOrderPage from './pages/shop/TrackOrderPage';
import ContactPage from './pages/shop/ContactPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminStaff from './pages/admin/AdminStaff';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';

const ProtectedRoute = ({ children, staffOnly = false }) => {
  const { user, isStaff } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (staffOnly && !isStaff) return <Navigate to="/" replace />;
  return children;
};

const ShopLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-cream">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#fff0f6', color: '#2d1b2e', border: '1px solid #ffc1d9' },
              success: { iconTheme: { primary: '#ff4d6d', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Shop routes */}
            <Route path="/" element={<ShopLayout><HomePage /></ShopLayout>} />
            <Route path="/shop" element={<ShopLayout><ShopPage /></ShopLayout>} />
            <Route path="/product/:slug" element={<ShopLayout><ProductPage /></ShopLayout>} />
            <Route path="/cart" element={<ShopLayout><CartPage /></ShopLayout>} />
            <Route path="/track" element={<ShopLayout><TrackOrderPage /></ShopLayout>} />
            <Route path="/contact" element={<ShopLayout><ContactPage /></ShopLayout>} />
            <Route path="/checkout" element={<ProtectedRoute><ShopLayout><CheckoutPage /></ShopLayout></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><ShopLayout><OrderSuccessPage /></ShopLayout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><ShopLayout><OrdersPage /></ShopLayout></ProtectedRoute>} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute staffOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="staff" element={<AdminStaff />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
