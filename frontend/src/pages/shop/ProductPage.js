import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
const BASE_URL = "https://herwall.onrender.com";

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%23ffe3ef"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="72" fill="%23ff85a1"%3E🌸%3C/text%3E%3C/svg%3E';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${slug}`)
      .then(r => { setProduct(r.data); if (r.data.sizes?.length) setSelectedSize(r.data.sizes[0].size); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Please select a size');
    addToCart(product, selectedSize, qty);
    toast.success(`${product.name} added to cart! 🌸`);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
      <div className="skeleton aspect-[3/4] rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-8 rounded w-3/4" />
        <div className="skeleton h-4 rounded w-1/2" />
        <div className="skeleton h-24 rounded" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">😢</p>
      <p className="text-gray-500">Product not found</p>
      <Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [null];
  const selectedSizeData = product.sizes?.find(s => s.size === selectedSize);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-pink-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-pink-600">Shop</Link>
        <span>/</span>
        <span className="text-pink-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="card overflow-hidden aspect-[3/4] bg-pink-50">
            <img
              src={images[activeImg] ? `${BASE_URL}${images[activeImg]}` : PLACEHOLDER}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-pink-500' : 'border-pink-100'}`}>
                  <img src={img ? `${BASE_URL}${img}` : PLACEHOLDER} alt="" className="w-full h-full object-cover"
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {product.artist && (
            <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
              {product.artist}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold text-gray-900">{product.name}</h1>

          {selectedSizeData && (
            <div className="text-3xl font-bold text-pink-600">
              Rs. {selectedSizeData.price}
            </div>
          )}

          <p className="text-gray-500 text-sm leading-relaxed">{product.description || 'Premium quality poster print on high-quality paper.'}</p>

          {/* Size selector */}
          <div>
            <label className="label text-base">Select Size</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.sizes?.map(s => (
                <button key={s.size} onClick={() => setSelectedSize(s.size)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedSize === s.size
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-pink-200 text-gray-600 hover:border-pink-300'
                  }`}>
                  <div>{s.size}</div>
                  <div className="text-xs text-pink-600 font-bold">Rs. {s.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="label text-base">Quantity</label>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 font-bold text-lg">−</button>
              <span className="w-10 text-center font-bold text-lg">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-50 font-bold text-lg">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddToCart} className="flex-1 btn-primary py-3 text-base">
              🛍️ Add to Cart
            </button>
            <Link to="/cart" onClick={handleAddToCart}
              className="flex-1 btn-outline py-3 text-base text-center">
              Buy Now
            </Link>
          </div>

          {/* Features */}
          <div className="bg-pink-50 rounded-2xl p-4 space-y-2 mt-4">
            {['Premium quality A4/A3/A2 paper', 'Vibrant, long-lasting inks', 'Carefully rolled & packaged', 'Delivered across Nepal'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
