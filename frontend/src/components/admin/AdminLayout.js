import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/products', label: 'Products', icon: '🖼️' },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { to: '/admin/staff', label: 'Staff', icon: '👥' },
];

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'block' : 'hidden lg:flex'} flex-col h-full bg-white border-r border-pink-100`}>
      {/* Logo */}
      <div className="p-5 border-b border-pink-100">
        <span className="font-accent text-2xl text-pink-600">Herwall</span>
        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.filter(item => item.to !== '/admin/staff' || isAdmin).map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => setSideOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
              }`
            }>
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-pink-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pink-gradient rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-pink-600 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-pink-50/30 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="w-56 flex-shrink-0 hidden lg:flex flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSideOpen(false)} />
          <div className="relative w-56 flex flex-col h-full z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-pink-100 px-4 py-3 flex items-center justify-between lg:px-6">
          <button onClick={() => setSideOpen(true)} className="lg:hidden p-1 rounded-lg hover:bg-pink-50">
            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-pink-600 transition-colors">
              View Store ↗
            </a>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
