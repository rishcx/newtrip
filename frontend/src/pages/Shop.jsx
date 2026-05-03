import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { Loader2, Ghost } from 'lucide-react';
import { cachedFetch } from '../lib/apiCache';

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
        const data = await cachedFetch(`${BACKEND_URL}/products`);
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
      <div className="relative py-10 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 px-5">
          <h1
            className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight"
            style={{ fontFamily: "'Vorcas', 'Bungee', cursive" }}
          >
            <span className="trippy-text">SHOP</span> ALL
          </h1>
          <p
            className="text-sm sm:text-base text-gray-200 mt-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 600 }}
          >
            The full collection
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Tabs — horizontally scrollable on mobile */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b-2 whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category
                    ? 'text-white border-white'
                    : 'text-gray-300 border-transparent hover:text-white'
                }`}
                style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 700 }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort + Count */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-sm text-gray-200 tracking-wider uppercase" style={{ fontFamily: "'Vorcas', sans-serif" }}>
              {!loading && `${sortedProducts.length} products`}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-transparent text-gray-100 border border-white/20 focus:border-white/40 focus:outline-none transition-all text-sm font-bold tracking-wider uppercase rounded-none"
              style={{ fontFamily: "'Vorcas', sans-serif" }}
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
            <span className="text-sm text-gray-200 tracking-[0.2em] uppercase" style={{ fontFamily: "'Vorcas', sans-serif" }}>
              Loading...
            </span>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-14">
            {sortedProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i * 50, 300)}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Ghost className="w-10 h-10 mx-auto mb-4 text-gray-500" />
            <p className="text-base font-bold text-gray-200 tracking-[0.15em] uppercase" style={{ fontFamily: "'Vorcas', sans-serif" }}>
              No products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
