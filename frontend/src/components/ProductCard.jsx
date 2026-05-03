import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      {/* Image — tall aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-3 sm:mb-4 rounded-sm">
        <img
          src={product.image || product.image_url}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

        {/* Quick view button — hidden on mobile for better touch UX */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden sm:block">
          <div
            className="w-full py-2.5 sm:py-3 bg-white text-black text-center text-xs sm:text-sm font-black tracking-[0.2em] uppercase hover:bg-cyan-400 transition-colors duration-200"
            style={{ fontFamily: "'Vorcas', sans-serif" }}
          >
            Quick View
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3
          className="text-xs sm:text-base lg:text-lg font-bold text-white uppercase tracking-[0.05em] sm:tracking-[0.08em] leading-tight group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2"
          style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 700 }}
        >
          {product.name}
        </h3>
        <p
          className="text-sm sm:text-base text-gray-300 font-semibold"
          style={{ fontFamily: "'Vorcas', sans-serif" }}
        >
          ${product.price}.00
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
