import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  printing: 'bg-purple-100 text-purple-700',
  packed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my')
      .then(r => setOrders(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="mb-8">
        <h1 className="section-title">My Orders</h1>
        <div className="pink-divider" />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-gray-500 text-lg mb-6">No orders yet</p>
          <Link to="/shop" className="btn-primary">Start Shopping 🌸</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-mono text-sm font-bold text-pink-700">{order.orderId}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {order.orderStatus}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">Rs. {order.totalAmount}</span>
                </div>
              </div>

              {/* Items preview */}
              <div className="space-y-1.5 mb-3">
                {order.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0" />
                    <span className="truncate">{item.productName}</span>
                    <span className="text-pink-600 font-medium flex-shrink-0">{item.size} × {item.quantity}</span>
                  </div>
                ))}
                {order.items?.length > 3 && <p className="text-xs text-gray-400 ml-3.5">+{order.items.length - 3} more items</p>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-pink-100">
                <span className="text-xs text-gray-500 capitalize">{order.paymentMethod} · {order.paymentStatus}</span>
                <Link to={`/track?id=${order.orderId}`} className="text-sm text-pink-600 hover:text-pink-800 font-medium transition-colors">
                  Track Order →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
