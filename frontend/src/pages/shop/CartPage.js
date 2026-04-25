import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="100" viewBox="0 0 80 100"%3E%3Crect width="80" height="100" fill="%23ffe3ef"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%23ff85a1"%3E🌸%3C/text%3E%3C/svg%3E';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center page-enter">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some beautiful K-pop posters to your cart!</p>
      <Link to="/shop" className="btn-primary px-10 py-3 text-base">Browse Posters 🌸</Link>
    </div>
  );

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=/checkout'); return; }
    navigate('/checkout');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Shopping Cart</h1>
          <div className="pink-divider" />
        </div>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.key} className="card flex gap-4 p-4">
              <div className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-pink-50">
                <img
                  src={item.productImage ? `http://localhost:5000${item.productImage}` : PLACEHOLDER}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="font-semibold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2 text-sm">
                  {item.productName}
                </Link>
                <p className="text-xs text-pink-600 mt-1 font-medium">{item.size}</p>
                <p className="text-sm font-bold text-pink-700 mt-1">Rs. {item.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.key)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <div className="flex items-center gap-2 bg-pink-50 rounded-full px-2 py-1">
                  <button onClick={() => updateQty(item.key, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-pink-600 hover:bg-pink-100 rounded-full font-bold text-sm">−</button>
                  <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.key, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-pink-600 hover:bg-pink-100 rounded-full font-bold text-sm">+</button>
                </div>
                <p className="text-sm font-bold text-gray-900">Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {cart.map(item => (
                <div key={item.key} className="flex justify-between text-gray-600">
                  <span className="truncate max-w-36">{item.productName} ({item.size}) ×{item.quantity}</span>
                  <span className="font-medium ml-2">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <hr className="border-pink-100 my-2" />
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>Rs. {total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
              </div>
              <hr className="border-pink-100 my-2" />
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span><span className="text-pink-600">Rs. {total}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary py-3 mt-6 text-base">
              Proceed to Checkout →
            </button>
            <Link to="/shop" className="block text-center text-sm text-pink-500 hover:text-pink-700 mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
