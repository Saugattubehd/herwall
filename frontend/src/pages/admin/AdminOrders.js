import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  printing: 'bg-purple-100 text-purple-700', packed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const ALL_STATUSES = ['placed', 'confirmed', 'printing', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    API.get(`/orders?${params}`)
      .then(r => { setOrders(r.data.orders || []); setTotal(r.data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, status, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Orders</h1>
          <p className="text-sm text-gray-500">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <input className="input flex-1 min-w-48" placeholder="Search by Order ID or customer name..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="input w-auto" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        {(search || status) && (
          <button onClick={() => { setSearch(''); setStatus(''); setPage(1); }} className="btn-ghost text-sm">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="py-3 px-4"><div className="skeleton h-5 rounded" /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} className="hover:bg-pink-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/admin/orders/${o._id}`} className="font-mono text-xs font-bold text-pink-700 hover:underline">{o.orderId}</Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{o.userName}</div>
                    <div className="text-xs text-gray-400">{o.userEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{o.items?.length} item(s)</td>
                  <td className="py-3 px-4 font-bold text-gray-900">Rs. {o.totalAmount}</td>
                  <td className="py-3 px-4 capitalize text-gray-600">{o.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className={`badge capitalize ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-700'}`}>{o.orderStatus}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Link to={`/admin/orders/${o._id}`} className="text-pink-600 hover:text-pink-800 text-xs font-medium">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 15 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm disabled:opacity-40">← Prev</button>
          <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 15)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)} className="btn-outline text-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}
