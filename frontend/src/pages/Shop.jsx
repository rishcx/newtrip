import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ScrollReveal } from '../hooks/useScrollReveal';
import MarqueeStrip from '../components/MarqueeStrip';
import { Loader2, Ghost } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['all', 'hoodies', 'tees', 'accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const transformedProducts = data.map(product => ({
          ...product,
          image: product.image_url || product.image
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen pt-28 relative z-[1]">

      {/* Hero Banner */}
      <div className="relative py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 px-4">
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight"
            style={{ fontFamily: "'Bungee', cursive" }}
          >
            <span className="trippy-text">SHOP</span> ALL
          </h1>
          <p
            className="text-xs sm:text-sm text-gray-500 mt-4 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
          >
            Premium quality &bull; Free shipping $50+ &bull; 30-day returns
          </p>
        </div>
      </div>

      {/* Marquee */}
      <MarqueeStrip
        messages={['FREE SHIPPING', 'NEW DROPS', 'LIMITED EDITION', 'COSMIC DRIP', 'PSYCHEDELIC ART', 'STAY TRIPPY']}
        className="text-white/30 border-y border-white/5"
        speed={35}
      />

      {/* Filters Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b-2 ${
                  selectedCategory === category
                    ? 'text-white border-white'
                    : 'text-gray-600 border-transparent hover:text-gray-300'
                }`}
                style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort + Count */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 tracking-wider uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {!loading && `${sortedProducts.length} products`}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-transparent text-gray-400 border border-white/10 focus:border-white/30 focus:outline-none transition-all text-xs font-bold tracking-wider uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <span className="text-xs text-gray-500 tracking-[0.2em] uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Loading...
            </span>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 sm:gap-x-8 sm:gap-y-14">
            {sortedProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i * 50, 300)}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Ghost className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p className="text-sm font-bold text-gray-500 tracking-[0.15em] uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              No products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
