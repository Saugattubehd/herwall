import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect width="300" height="400" fill="%23ffe3ef"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%23ff85a1"%3E🌸%3C/text%3E%3C/svg%3E';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const minPrice = product.sizes?.length ? Math.min(...product.sizes.map(s => s.price)) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes?.length) {
      addToCart(product, product.sizes[0].size, 1);
      toast.success(`Added to cart! 🌸`);
    }
  };

  return (
    <Link to={`/product/${product.slug}`}
      className="card group cursor-pointer hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-pink-50">
        <img
          src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-pink-gradient text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ✨ Featured
          </span>
        )}
        {product.artist && (
          <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-pink-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-pink-200">
            {product.artist}
          </span>
        )}
        {/* Quick add overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-3 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button onClick={handleQuickAdd}
            className="w-full btn-primary text-sm py-2">
            + Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-pink-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-pink-600 font-bold text-base">
            From Rs. {minPrice}
          </span>
          <span className="text-xs text-gray-400">{product.sizes?.length} sizes</span>
        </div>
      </div>
    </Link>
  );
}
