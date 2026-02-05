import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

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
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Transform API data to match component expectations
        const transformedProducts = data.map(product => ({
          ...product,
          image: product.image_url || product.image // Support both field names
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
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      {/* Header */}
      <div className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 sm:mb-4">
            <span className="trippy-text">Shop</span> The Collection
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Discover our full range of psychedelic streetwear. Each piece is a portal to another dimension.
          </p>
          <p className="text-sm text-gray-500">
            Premium quality • Free shipping on orders $50+ • 30-day returns
          </p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800">
          {/* Categories */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-white font-medium text-sm sm:text-base">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 border-t border-zinc-700 pt-4 sm:border-t-0 sm:pt-0 sm:ml-auto">
            <span className="text-white font-medium text-sm sm:text-base">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-zinc-800 text-white rounded-full border border-zinc-700 focus:border-cyan-500 focus:outline-none transition-colors text-sm sm:text-base"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400 text-sm sm:text-base">
            {loading ? 'Loading products...' : `Showing ${sortedProducts.length} product${sortedProducts.length !== 1 ? 's' : ''}`}
          </p>
          {!loading && sortedProducts.length > 0 && (
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
              {selectedCategory !== 'all' && `Filtered by: ${selectedCategory}`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;