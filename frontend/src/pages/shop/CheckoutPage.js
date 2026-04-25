import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: '', city: 'Kathmandu', district: 'Bagmati', province: 'Bagmati Province'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleOrder = async () => {
    if (!form.street || !form.city) return toast.error('Please fill in your address');
    if (!cart.length) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const items = cart.map(i => ({
        product: i.productId, productName: i.productName,
        productImage: i.productImage, size: i.size,
        price: i.price, quantity: i.quantity
      }));
      const { data } = await API.post('/orders', {
        items, paymentMethod, shippingAddress: form, notes
      });
      clearCart();
      navigate('/order-success', { state: { order: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const PAYMENT_METHODS = [
    { id: 'esewa', label: 'eSewa', color: 'text-green-700 bg-green-50 border-green-200', logo: '💚', desc: 'Pay with eSewa wallet' },
    { id: 'khalti', label: 'Khalti', color: 'text-purple-700 bg-purple-50 border-purple-200', logo: '💜', desc: 'Pay with Khalti wallet' },
    { id: 'cod', label: 'Cash on Delivery', color: 'text-gray-700 bg-gray-50 border-gray-200', logo: '💵', desc: 'Pay when delivered' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <div className="mb-8">
        <h1 className="section-title">Checkout</h1>
        <div className="pink-divider" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 text-sm font-bold">1</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="label">Name</label>
                <input className="input" value={user?.name || ''} disabled />
              </div>
              <div>
                <label className="label">Phone (WhatsApp)</label>
                <input className="input" value={user?.phone || ''} disabled />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input className="input" value={user?.email || ''} disabled />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 text-sm font-bold">2</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <label className="label">Street / Area *</label>
                <input className="input" name="street" placeholder="e.g. Thamel, near Kathmandu Guest House" value={form.street} onChange={handleChange} />
              </div>
              <div>
                <label className="label">City *</label>
                <input className="input" name="city" value={form.city} onChange={handleChange} />
              </div>
              <div>
                <label className="label">District</label>
                <input className="input" name="district" value={form.district} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className="label">Province</label>
                <input className="input" name="province" value={form.province} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 text-sm font-bold">3</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(m => (
                <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === m.id ? 'border-pink-400 bg-pink-50' : 'border-gray-100 hover:border-pink-200'
                }`}>
                  <input type="radio" className="sr-only" value={m.id} checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)} />
                  <div className="flex-shrink-0 text-2xl">{m.logo}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === m.id ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </label>
              ))}
            </div>
            {paymentMethod !== 'cod' && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
                ⚠️ After placing the order, our team will contact you on WhatsApp with the payment details for {paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'}.
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card p-6">
            <label className="label text-base font-semibold text-gray-900 mb-2">Order Notes (Optional)</label>
            <textarea className="input resize-none" rows={3} placeholder="Any special instructions or requests..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.key} className="flex gap-3">
                  <div className="w-12 h-14 bg-pink-50 rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={item.productImage ? `http://localhost:5000${item.productImage}` : ''} alt=""
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.productName}</p>
                    <p className="text-xs text-pink-600">{item.size} × {item.quantity}</p>
                    <p className="text-xs font-bold text-gray-900">Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-pink-100 mb-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {total}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <hr className="border-pink-100" />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-pink-600">Rs. {total}</span></div>
            </div>
            <button onClick={handleOrder} disabled={loading}
              className="w-full btn-primary py-3 mt-6 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Placing Order...
                </span>
              ) : '🌸 Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
