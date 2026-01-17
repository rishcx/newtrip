import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <button className="p-3 bg-cyan-500 rounded-full hover:bg-cyan-400 transition-colors">
              <Eye className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 shadow-[0_0_20px_rgba(251,191,36,0.8)] hover:shadow-[0_0_26px_rgba(244,114,182,0.9)] transition-all duration-200 hover:scale-105">
              <ShoppingCart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
            {product.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">${product.price}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-zinc-700"
                style={{
                  backgroundColor: color.toLowerCase() === 'multi' 
                    ? 'linear-gradient(135deg, #06b6d4, #ec4899, #fbbf24)' 
                    : color.toLowerCase()
                }}
                title={color}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-400"></div>
      </div>
    </Link>
  );
};

export default ProductCard;