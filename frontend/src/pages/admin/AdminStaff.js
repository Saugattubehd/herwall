import React, { useEffect, useState, useCallback } from 'react';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function AddModeratorModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone)
      return toast.error('All fields are required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await API.post('/admin/moderator', form);
      toast.success('Moderator added! 🌸');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add moderator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-pink-lg w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-pink-100">
          <h2 className="font-display text-xl font-bold text-gray-900">Add Moderator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs text-pink-700">
            ℹ️ Moderators can view and update orders, and manage products & categories. Only admins can add/remove moderators.
          </div>
          <div>
            <label className="label">Full Name *</label>
            <input className="input" placeholder="Moderator's full name"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input className="input" type="email" placeholder="moderator@herwall.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="label">WhatsApp Number *</label>
            <input className="input" type="tel" placeholder="98XXXXXXXX"
              value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
        <div className="p-5 border-t border-pink-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Adding...' : '👥 Add Moderator'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminStaff() {
  const { user: currentUser, isAdmin } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchStaff = useCallback(() => {
    setLoading(true);
    API.get('/admin/staff')
      .then(r => setStaff(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove moderator access from ${name}?`)) return;
    try {
      await API.delete(`/admin/moderator/${id}`);
      toast.success(`${name} removed as moderator`);
      fetchStaff();
    } catch {
      toast.error('Failed to remove moderator');
    }
  };

  const ROLE_BADGE = {
    admin: 'bg-pink-100 text-pink-700',
    moderator: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-5 page-enter max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Staff Management</h1>
          <p className="text-sm text-gray-500">{staff.length} staff members</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Moderator</button>
        )}
      </div>

      {/* Admin credentials reminder */}
      <div className="card p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🔐</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Admin Credentials</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Default admin login: <span className="font-mono font-bold text-pink-700">admin@herwall.com</span>
              {' '}/ See your <span className="font-mono">.env</span> file for password.
              Change these immediately after first login.
            </p>
          </div>
        </div>
      </div>

      {/* Staff list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-400 mb-4">No staff members yet</p>
          {isAdmin && <button onClick={() => setShowModal(true)} className="btn-primary">Add First Moderator</button>}
        </div>
      ) : (
        <div className="space-y-3">
          {staff.map(member => (
            <div key={member._id} className="card p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-pink-gradient rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {member.name?.[0]?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <span className={`badge capitalize ${ROLE_BADGE[member.role] || 'bg-gray-100 text-gray-600'}`}>
                    {member.role}
                  </span>
                  {member._id === currentUser?._id && (
                    <span className="badge bg-green-100 text-green-700">You</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{member.email}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <span>📱</span>
                  <a href={`https://wa.me/977${member.phone}`} target="_blank" rel="noreferrer"
                    className="hover:text-green-600 transition-colors">{member.phone}</a>
                </p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-gray-400 mb-2">
                  Joined {new Date(member.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short' })}
                </p>
                {isAdmin && member.role === 'moderator' && member._id !== currentUser?._id && (
                  <button onClick={() => handleRemove(member._id, member.name)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors border border-red-200 hover:border-red-300 px-3 py-1 rounded-full">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions table */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Permission</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-pink-600 uppercase">Admin</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-purple-600 uppercase">Moderator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 text-gray-600">
              {[
                ['View Orders', true, true],
                ['Update Order Status', true, true],
                ['Add / Edit Products', true, true],
                ['Add / Edit Categories', true, true],
                ['View Dashboard Stats', true, true],
                ['Add Moderators', true, false],
                ['Remove Moderators', true, false],
                ['View All Users', true, false],
              ].map(([perm, admin, mod]) => (
                <tr key={perm} className="hover:bg-pink-50/30">
                  <td className="py-2.5 px-3">{perm}</td>
                  <td className="py-2.5 px-3 text-center">{admin ? '✅' : '❌'}</td>
                  <td className="py-2.5 px-3 text-center">{mod ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddModeratorModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchStaff(); }}
        />
      )}
    </div>
  );
}
