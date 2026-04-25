import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center page-enter">
      <div className="card p-10">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-pink">
          <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Placed! 🌸</h1>
        <p className="text-gray-500 mb-6">Thank you for your order. We'll start printing right away!</p>

        {order && (
          <div className="bg-pink-50 rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-pink-700 font-mono">{order.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900">Rs. {order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="capitalize font-medium text-gray-700">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="badge bg-yellow-100 text-yellow-700 capitalize">{order.orderStatus}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mb-6">
          You can track your order using your Order ID. We'll also contact you on WhatsApp.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/orders" className="btn-primary py-3">View My Orders</Link>
          <Link to={`/track`} className="btn-outline py-3">Track This Order</Link>
          <Link to="/shop" className="btn-ghost py-2 text-sm">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
