import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../utils/api';

const STEPS = ['placed', 'confirmed', 'printing', 'packed', 'shipped', 'delivered'];
const STEP_ICONS = { placed: '📝', confirmed: '✅', printing: '🖨️', packed: '📦', shipped: '🚚', delivered: '🎉', cancelled: '❌' };

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const { data } = await API.get(`/orders/track/${orderId.trim().toUpperCase()}`);
      setOrder(data);
    } catch {
      setError('Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (searchParams.get('id')) handleTrack(); }, []);

  const currentStep = STEPS.indexOf(order?.orderStatus);
  const isCancelled = order?.orderStatus === 'cancelled';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 page-enter">
      <div className="text-center mb-10">
        <h1 className="section-title">Track Your Order</h1>
        <div className="pink-divider mx-auto" />
        <p className="text-gray-500 text-sm mt-2">Enter your Order ID to see the latest status</p>
      </div>

      <form onSubmit={handleTrack} className="card p-6 mb-8">
        <label className="label text-base">Order ID</label>
        <div className="flex gap-3 mt-2">
          <input className="input flex-1 font-mono text-sm uppercase" placeholder="HW-XXXXXXXX"
            value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())} />
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 disabled:opacity-60">
            {loading ? '...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="card p-5 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}

      {order && (
        <div className="card p-6 space-y-6">
          {/* Order header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-mono text-lg font-bold text-pink-700">{order.orderId}</p>
              <p className="text-sm text-gray-500">{order.userName} · {new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 text-lg">Rs. {order.totalAmount}</p>
              <p className="text-sm text-gray-500">{order.items?.length} item(s)</p>
            </div>
          </div>

          {/* Progress tracker */}
          {!isCancelled ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Delivery Progress</h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-pink-100" />
                <div className="absolute top-5 left-5 h-0.5 bg-pink-400 transition-all duration-500"
                  style={{ width: `${currentStep >= 0 ? (currentStep / (STEPS.length - 1)) * 100 : 0}%`, maxWidth: 'calc(100% - 40px)' }} />

                <div className="relative flex justify-between">
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 w-14">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                          done ? 'bg-pink-500 border-pink-500 shadow-pink' : 'bg-white border-pink-200'
                        } ${active ? 'scale-110' : ''}`}>
                          {STEP_ICONS[step]}
                        </div>
                        <p className={`text-xs text-center capitalize leading-tight ${done ? 'text-pink-700 font-semibold' : 'text-gray-400'}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-3xl mb-2">❌</p>
              <p className="font-semibold text-red-700">Order Cancelled</p>
            </div>
          )}

          {/* History */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order History</h3>
            <div className="space-y-3">
              {[...(order.trackingHistory || [])].reverse().map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-pink-500' : 'bg-pink-200'}`} />
                    {i < (order.trackingHistory?.length - 1) && <div className="w-0.5 h-full bg-pink-100 mt-1" />}
                  </div>
                  <div className="pb-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">{h.status}</p>
                    {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                    <p className="text-xs text-pink-400 mt-1">{new Date(h.timestamp).toLocaleString('en-NP')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
