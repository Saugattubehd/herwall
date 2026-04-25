import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../utils/api';
import ProductCard from '../../components/shop/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [selectedArtist, setSelectedArtist] = useState(searchParams.get('artist') || '');
  const [page, setPage] = useState(1);

  const ARTISTS = ['BTS', 'BLACKPINK', 'TWICE', 'EXO', 'Stray Kids', 'NewJeans'];

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data || [])).catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCat) params.set('category', selectedCat);
    if (selectedArtist) params.set('artist', selectedArtist);
    params.set('page', page);
    params.set('limit', 12);
    API.get(`/products?${params}`)
      .then(r => { setProducts(r.data.products || []); setTotal(r.data.total || 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, selectedCat, selectedArtist, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setSearch(''); setSelectedCat(''); setSelectedArtist(''); setPage(1);
  };

  const hasFilters = search || selectedCat || selectedArtist;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <div className="mb-8">
        <h1 className="section-title">All Posters</h1>
        <div className="pink-divider" />
        <p className="text-gray-500 text-sm mt-1">{total} posters found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="card p-5 sticky top-20 space-y-6">
            {/* Search */}
            <div>
              <label className="label">Search</label>
              <input className="input" placeholder="BTS, poster..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category</label>
              <div className="space-y-1.5 mt-1">
                <button onClick={() => { setSelectedCat(''); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCat ? 'bg-pink-100 text-pink-700 font-medium' : 'hover:bg-pink-50 text-gray-600'}`}>
                  All Categories
                </button>
                {categories.map(c => (
                  <button key={c._id} onClick={() => { setSelectedCat(c._id); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCat === c._id ? 'bg-pink-100 text-pink-700 font-medium' : 'hover:bg-pink-50 text-gray-600'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Artist */}
            <div>
              <label className="label">Artist</label>
              <div className="space-y-1.5 mt-1">
                <button onClick={() => { setSelectedArtist(''); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedArtist ? 'bg-pink-100 text-pink-700 font-medium' : 'hover:bg-pink-50 text-gray-600'}`}>
                  All Artists
                </button>
                {ARTISTS.map(a => (
                  <button key={a} onClick={() => { setSelectedArtist(a); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedArtist === a ? 'bg-pink-100 text-pink-700 font-medium' : 'hover:bg-pink-50 text-gray-600'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="w-full text-center text-xs text-pink-500 hover:text-pink-700 underline">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton aspect-[3/4]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 rounded w-3/4" />
                    <div className="skeleton h-4 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🌸</p>
              <p className="text-gray-500 text-lg">No posters found</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {total > 12 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="btn-outline text-sm disabled:opacity-40">← Prev</button>
                  <span className="text-sm text-gray-600 px-4">Page {page} of {Math.ceil(total / 12)}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 12)}
                    className="btn-outline text-sm disabled:opacity-40">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
