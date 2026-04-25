import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import ProductCard from '../../components/shop/ProductCard';

const ARTISTS = [
  { name: 'BTS', emoji: '💜', color: 'from-purple-100 to-pink-100' },
  { name: 'BLACKPINK', emoji: '🖤', color: 'from-pink-100 to-rose-100' },
  { name: 'TWICE', emoji: '🌸', color: 'from-pink-50 to-pink-100' },
  { name: 'Stray Kids', emoji: '⚡', color: 'from-yellow-50 to-pink-100' },
  { name: 'NewJeans', emoji: '🐰', color: 'from-blue-50 to-pink-100' },
  { name: 'EXO', emoji: '⭐', color: 'from-gray-50 to-pink-100' },
];

function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-20 md:py-32">
      {/* Decorative petals */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="petal animate-float" style={{
          width: `${60 + i * 20}px`, height: `${60 + i * 20}px`,
          top: `${10 + i * 12}%`, left: `${5 + i * 15}%`,
          animationDelay: `${i * 0.4}s`, opacity: 0.4
        }} />
      ))}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span>✨</span> Premium K-Pop Poster Prints in Nepal
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
          Wall your world with
          <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
            K-Pop magic
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          High-quality poster prints of BTS, BLACKPINK, and your favourite K-pop artists — delivered right to your door in Nepal.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="btn-primary text-base px-8 py-3 shadow-pink-lg">
            Shop Now 🌸
          </Link>
          <Link to="/track" className="btn-outline text-base px-8 py-3">
            Track My Order
          </Link>
        </div>
        {/* Payment badges */}
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-xs text-gray-400">Accepts:</span>
          {['eSewa', 'Khalti', 'Cash on Delivery'].map(p => (
            <span key={p} className="bg-white border border-pink-100 text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-soft font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtistsSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="section-title">Browse by Artist</h2>
        <div className="pink-divider mx-auto" />
        <p className="text-gray-500 mt-2 text-sm">Find your favourite group's poster collection</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {ARTISTS.map(a => (
          <Link key={a.name} to={`/shop?artist=${a.name}`}
            className={`card bg-gradient-to-br ${a.color} p-4 text-center hover:-translate-y-1 transition-all duration-200 cursor-pointer border-0`}>
            <div className="text-4xl mb-2">{a.emoji}</div>
            <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts({ products, loading }) {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Featured Prints</h2>
          <div className="pink-divider mx-auto" />
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/shop" className="btn-primary px-10 py-3">View All Posters</Link>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const features = [
    { icon: '🖨️', title: 'HD Quality Print', desc: 'Vibrant colors on premium paper stock' },
    { icon: '📦', title: 'Safe Packaging', desc: 'Rolled in protective tubes, safe delivery' },
    { icon: '⚡', title: 'Fast Shipping', desc: 'Delivered within 3-5 days in Nepal' },
    { icon: '💳', title: 'Easy Payment', desc: 'eSewa, Khalti or Cash on Delivery' },
  ];
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="section-title">Why Choose Herwall?</h2>
        <div className="pink-divider mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map(f => (
          <div key={f.title} className="text-center p-6 card hover:-translate-y-1 transition-all duration-200">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products?featured=true&limit=8')
      .then(r => setFeatured(r.data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      <HeroBanner />
      <ArtistsSection />
      <FeaturedProducts products={featured} loading={loading} />
      <WhyUs />
    </div>
  );
}
