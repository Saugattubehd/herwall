import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!form.phone) return toast.error('Phone number is required');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome to Herwall, ${user.name}! 🌸`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-accent text-4xl text-pink-600">Herwall</span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Create your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input className="input" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">WhatsApp Number *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🇳🇵 +977</span>
                <input className="input pl-20" type="tel" name="phone" placeholder="98XXXXXXXX"
                  value={form.phone} onChange={handleChange} required />
              </div>
              <p className="text-xs text-gray-400 mt-1">We'll use this to contact you about your order</p>
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input className="input pr-10" type={show ? 'text' : 'password'} name="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password *</label>
              <input className="input" type="password" name="confirmPassword" placeholder="Re-enter your password"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base mt-2 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating account...
                </span>
              ) : '🌸 Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-800 transition-colors">Sign In</Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-pink-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
