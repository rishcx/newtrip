import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      {/* Image — tall aspect ratio for big product display */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-4">
        <img
          src={product.image || product.image_url}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

        {/* Quick view button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div
            className="w-full py-3 bg-white text-black text-center text-sm font-black tracking-[0.2em] uppercase hover:bg-cyan-400 transition-colors duration-200"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Quick View
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        <h3
          className="text-base sm:text-lg font-bold text-white uppercase tracking-[0.08em] leading-tight group-hover:text-cyan-400 transition-colors duration-300"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
        >
          {product.name}
        </h3>
        <p
          className="text-base text-gray-400 font-semibold"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          ${product.price}.00
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
