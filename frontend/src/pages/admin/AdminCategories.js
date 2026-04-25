import React, { useEffect, useState, useCallback } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

function CategoryModal({ category, onClose, onSaved }) {
  const isEdit = !!category?._id;
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name) return toast.error('Category name is required');
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/categories/${category._id}`, form);
        toast.success('Category updated! 🌸');
      } else {
        await API.post('/categories', form);
        toast.success('Category added! 🌸');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-pink-lg w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-pink-100">
          <h2 className="font-display text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input className="input" placeholder="e.g. BTS, BLACKPINK, Aesthetic"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Short description..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Image URL (optional)</label>
            <input className="input" placeholder="https://..." value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
          </div>
        </form>
        <div className="p-5 border-t border-pink-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCat, setModalCat] = useState(undefined);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    API.get('/categories')
      .then(r => setCategories(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deactivated');
      fetchCategories();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Categories</h1>
          <p className="text-sm text-gray-500">{categories.length} active categories</p>
        </div>
        <button onClick={() => setModalCat(null)} className="btn-primary">+ Add Category</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="text-gray-400 mb-4">No categories yet</p>
          <button onClick={() => setModalCat(null)} className="btn-primary">Add First Category</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="card p-5 flex flex-col gap-3 group hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl"
                      onError={e => { e.target.style.display = 'none'; e.target.parentElement.textContent = '🌸'; }} />
                  ) : '🌸'}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModalCat(cat)}
                    className="p-1.5 rounded-lg hover:bg-pink-50 text-pink-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(cat._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                {cat.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                )}
              </div>
              <div className="mt-auto pt-2 border-t border-pink-50">
                <span className="text-xs font-mono text-gray-400">/{cat.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalCat !== undefined && (
        <CategoryModal
          category={modalCat}
          onClose={() => setModalCat(undefined)}
          onSaved={() => { setModalCat(undefined); fetchCategories(); }}
        />
      )}
    </div>
  );
}
