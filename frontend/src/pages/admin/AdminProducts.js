import React, { useEffect, useState, useCallback } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80"%3E%3Crect width="60" height="80" fill="%23ffe3ef"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23ff85a1"%3E🌸%3C/text%3E%3C/svg%3E';
const SIZES = ['A4 (8.3×11.7 in)', 'A3 (11.7×16.5 in)', 'A2 (16.5×23.4 in)', 'A1 (23.4×33.1 in)', '12×18 in', '24×36 in'];
const ARTISTS = ['BTS', 'BLACKPINK', 'TWICE', 'EXO', 'Stray Kids', 'NewJeans', 'aespa', 'IVE', 'Other'];
const BASE_URL = "https://herwall.onrender.com";
function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product?._id;
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category?._id || product?.category || '',
    artist: product?.artist || '',
    featured: product?.featured || false,
    tags: product?.tags?.join(', ') || '',
    sizes: product?.sizes?.length ? product.sizes : [{ size: 'A4 (8.3×11.7 in)', price: 299, stock: 100 }],
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const addSize = () => setForm(f => ({ ...f, sizes: [...f.sizes, { size: '', price: 0, stock: 100 }] }));
  const removeSize = i => setForm(f => ({ ...f, sizes: f.sizes.filter((_, idx) => idx !== i) }));
  const updateSize = (i, field, val) => setForm(f => ({
    ...f, sizes: f.sizes.map((s, idx) => idx === i ? { ...s, [field]: field === 'price' || field === 'stock' ? Number(val) : val } : s)
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.category) return toast.error('Name and category are required');
    if (!form.sizes.length) return toast.error('Add at least one size');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('artist', form.artist);
      fd.append('featured', form.featured);
      fd.append('sizes', JSON.stringify(form.sizes));
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      files.forEach(f => fd.append('images', f));

      if (isEdit) {
        await API.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated! 🌸');
      } else {
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added! 🌸');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-2xl shadow-pink-lg w-full max-w-2xl my-auto">
        <div className="flex items-center justify-between p-5 border-b border-pink-100">
          <h2 className="font-display text-xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name *</label>
              <input className="input" name="name" placeholder="e.g. BTS Butter Concept Poster" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="input" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Artist</label>
              <select className="input" name="artist" value={form.artist} onChange={handleChange}>
                <option value="">Select artist</option>
                {ARTISTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input resize-none" name="description" rows={3} placeholder="Poster description..."
                value={form.description} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <label className="label">Tags (comma separated)</label>
              <input className="input" name="tags" placeholder="bts, butter, kpop, poster" value={form.tags} onChange={handleChange} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange}
                className="w-4 h-4 accent-pink-500" />
              <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">Mark as Featured</label>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Sizes & Prices *</label>
              <button type="button" onClick={addSize} className="text-xs text-pink-600 hover:text-pink-800 font-medium">+ Add Size</button>
            </div>
            <div className="space-y-2">
              {form.sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select className="input flex-1" value={s.size}
                    onChange={e => updateSize(i, 'size', e.target.value)}>
                    <option value="">Select size</option>
                    {SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                  </select>
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input type="number" className="input pl-8 text-sm" placeholder="Price" value={s.price}
                      onChange={e => updateSize(i, 'price', e.target.value)} min="0" />
                  </div>
                  <input type="number" className="input w-20 text-sm" placeholder="Stock" value={s.stock}
                    onChange={e => updateSize(i, 'stock', e.target.value)} min="0" />
                  {form.sizes.length > 1 && (
                    <button type="button" onClick={() => removeSize(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="label">Product Images</label>
            <input type="file" accept="image/*" multiple className="input text-sm" onChange={e => setFiles(Array.from(e.target.files))} />
            <p className="text-xs text-gray-400 mt-1">Max 5 images, 5MB each. {isEdit ? 'Uploading new images will replace existing ones.' : ''}</p>
            {isEdit && product?.images?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {product.images.map((img, i) => (
                  <img key={i} src={`http://localhost:5000${img}`} alt="" className="w-12 h-14 object-cover rounded-lg border border-pink-100"
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                ))}
              </div>
            )}
          </div>
        </form>
        <div className="p-5 border-t border-pink-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalProduct, setModalProduct] = useState(undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAll = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    Promise.all([
      API.get(`/products?${params}`),
      API.get('/categories')
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.products || []);
      setTotal(pRes.data.total || 0);
      setCategories(cRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deactivated');
      fetchAll();
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Products</h1>
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <button onClick={() => setModalProduct(null)} className="btn-primary">+ Add Product</button>
      </div>

      {/* Search */}
      <div className="card p-4 flex gap-3">
        <input className="input flex-1" placeholder="Search products..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
        {search && <button onClick={() => { setSearch(''); setPage(1); }} className="btn-ghost text-sm">Clear</button>}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🌸</p>
          <p className="text-gray-400 mb-4">No products found</p>
          <button onClick={() => setModalProduct(null)} className="btn-primary">Add First Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p._id} className="card overflow-hidden group">
              <div className="aspect-[3/4] bg-pink-50 relative overflow-hidden">
                <img src={p.images?.[0] ? `${BASE_URL}${p.images[0]}` : PLACEHOLDER}
                  alt={p.name} className="w-full h-full object-cover"
                  onError={e => { e.target.src = PLACEHOLDER; }} />
                {p.featured && (
                  <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">Featured</span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setModalProduct(p)}
                    className="bg-white text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-pink-50">Edit</button>
                  <button onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-600">Delete</button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{p.name}</p>
                <p className="text-xs text-pink-600 mt-1">{p.artist || p.category?.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-bold text-gray-800">
                    From Rs. {p.sizes?.length ? Math.min(...p.sizes.map(s => s.price)) : 0}
                  </p>
                  <span className="text-xs text-gray-400">{p.sizes?.length} sizes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > 12 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm disabled:opacity-40">← Prev</button>
          <span className="text-sm text-gray-600">Page {page} of {Math.ceil(total / 12)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 12)} className="btn-outline text-sm disabled:opacity-40">Next →</button>
        </div>
      )}

      {modalProduct !== undefined && (
        <ProductModal product={modalProduct} categories={categories} onClose={() => setModalProduct(undefined)} onSaved={() => { setModalProduct(undefined); fetchAll(); }} />
      )}
    </div>
  );
}
