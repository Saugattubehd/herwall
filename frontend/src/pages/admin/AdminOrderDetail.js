import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
const BASE_URL = "https://herwall.onrender.com";

const STATUS_COLORS = {
  placed: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  printing: 'bg-purple-100 text-purple-700', packed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const ALL_STATUSES = ['placed', 'confirmed', 'printing', 'packed', 'shipped', 'delivered', 'cancelled'];
const ALL_PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPayStatus, setNewPayStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(r => { setOrder(r.data); setNewStatus(r.data.orderStatus); setNewPayStatus(r.data.paymentStatus); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const { data } = await API.put(`/orders/${id}/status`, { orderStatus: newStatus, paymentStatus: newPayStatus, note });
      setOrder(data);
      setNote('');
      toast.success('Order updated! 🌸');
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  return (
    <div className="space-y-6 page-enter max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="btn-ghost text-sm">← Back</Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-mono">{order.orderId}</h1>
          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-NP')}</p>
        </div>
        <span className={`badge capitalize ml-auto ${STATUS_COLORS[order.orderStatus] || ''}`}>{order.orderStatus}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer info */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{order.userName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-xs">{order.userEmail}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span>
              <a href={`https://wa.me/977${order.userPhone}`} target="_blank" rel="noreferrer"
                className="text-green-600 font-medium hover:underline">{order.userPhone} 📱</a>
            </div>
          </div>
          <hr className="my-3 border-pink-100" />
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping Address</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
          </p>
        </div>

        {/* Payment */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Payment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span>
              <span className={`badge capitalize ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-pink-700 text-base">Rs. {order.totalAmount}</span></div>
          </div>
          {order.notes && <><hr className="my-3 border-pink-100" /><p className="text-xs text-gray-500"><span className="font-semibold">Note:</span> {order.notes}</p></>}
        </div>
      </div>

      {/* Items */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl">
              <div className="w-12 h-14 bg-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.productImage && <img src={`${BASE_URL}${item.productImage}`} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                <p className="text-xs text-pink-600">{item.size}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500">× {item.quantity}</p>
                <p className="font-bold text-gray-900 text-sm">Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-pink-100">
          <p className="font-bold text-gray-900">Total: <span className="text-pink-600 text-lg">Rs. {order.totalAmount}</span></p>
        </div>
      </div>

      {/* Update status */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Update Order Status</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Order Status</label>
            <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Payment Status</label>
            <select className="input" value={newPayStatus} onChange={e => setNewPayStatus(e.target.value)}>
              {ALL_PAYMENT_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="label">Note (optional)</label>
          <input className="input" placeholder="e.g. Out for delivery, expected tomorrow..." value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <button onClick={handleUpdate} disabled={updating} className="btn-primary disabled:opacity-60">
          {updating ? 'Updating...' : '✅ Update Status'}
        </button>
      </div>

      {/* Tracking history */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Tracking History</h3>
        <div className="space-y-3">
          {[...(order.trackingHistory || [])].reverse().map((h, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 bg-pink-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{h.status}</p>
                {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                <p className="text-xs text-pink-400">{new Date(h.timestamp).toLocaleString('en-NP')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
