import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const HeartIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="url(#hgrad)"/>
    <defs><linearGradient id="hgrad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#ff85a1"/><stop offset="1" stopColor="#ff4d6d"/></linearGradient></defs>
  </svg>
);

export default function Navbar() {
  const { user, logout, isStaff } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/track', label: 'Track Order' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <HeartIcon />
            <span className="font-accent text-2xl text-pink-600 group-hover:text-pink-700 transition-colors">Herwall</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(l.to) ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-pink-50 transition-colors">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse-pink">
                  {count}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            {user ? (
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors">
                  <div className="w-7 h-7 bg-pink-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-pink-700 hidden sm:block max-w-24 truncate">{user.name}</span>
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-pink border border-pink-100 py-1 z-50">
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      My Orders
                    </Link>
                    {isStaff && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-pink-100" />
                    <button onClick={() => { logout(); navigate('/'); setDropOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-full hover:bg-pink-50">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(l.to) ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-pink-50'
              }`}>
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-outline text-sm text-center">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-sm text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
