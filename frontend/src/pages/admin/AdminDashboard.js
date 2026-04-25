import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  printing: 'bg-purple-100 text-purple-700', packed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-blue-50 to-blue-100', text: 'text-blue-700' },
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue?.toLocaleString()}`, icon: '💰', color: 'from-green-50 to-green-100', text: 'text-green-700' },
    { label: 'Total Products', value: stats.totalProducts, icon: '🖼️', color: 'from-pink-50 to-pink-100', text: 'text-pink-700' },
    { label: 'Total Customers', value: stats.totalUsers, icon: '👤', color: 'from-purple-50 to-purple-100', text: 'text-purple-700' },
  ] : [];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening at Herwall.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className={`card p-5 bg-gradient-to-br ${s.color} border-0`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-pink-600 hover:text-pink-800 font-medium">View All →</Link>
        </div>
        {stats?.recentOrders?.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {stats.recentOrders?.map(o => (
                  <tr key={o._id} className="hover:bg-pink-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <Link to={`/admin/orders/${o._id}`} className="font-mono text-xs text-pink-700 hover:underline">{o.orderId}</Link>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{o.userName}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">Rs. {o.totalAmount}</td>
                    <td className="py-3 px-3">
                      <span className={`badge capitalize ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-700'}`}>{o.orderStatus}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/admin/products', label: 'Add Product', icon: '➕', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
          { to: '/admin/categories', label: 'Add Category', icon: '🏷️', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
          { to: '/admin/orders', label: 'View Orders', icon: '📦', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
          { to: '/admin/staff', label: 'Manage Staff', icon: '👥', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
        ].map(a => (
          <Link key={a.to} to={a.to} className={`card p-4 flex flex-col items-center gap-2 text-center border-0 transition-colors ${a.color}`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm font-medium">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
