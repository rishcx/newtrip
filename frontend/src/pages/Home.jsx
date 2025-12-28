import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Zap, Palette, Sparkles, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Get first 3 products for featured section
        setFeaturedProducts(transformedProducts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-sm relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-cyan-400 text-xs sm:text-sm font-medium">Featured Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-3 sm:mb-4">
              Latest <span className="trippy-text">Drops</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Fresh from the dimension. Limited edition pieces that define the vibe.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Vibes</h3>
              <p className="text-gray-400">
                Transform your wardrobe with pieces that radiate pure energy and creativity.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-magenta-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-magenta-500/10 flex items-center justify-center">
                <Palette className="w-8 h-8 text-magenta-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Psychedelic Art</h3>
              <p className="text-gray-400">
                Each piece is a wearable canvas featuring mind-bending designs and liquid swirls.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Limited Edition</h3>
              <p className="text-gray-400">
                Exclusive drops that sell out fast. Be part of the trippy drip movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trippy Tales Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm mb-6">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Stories & Insights</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-4">
            <span className="trippy-text">Trippy Tales</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dive into stories, insights, and cosmic wisdom from the world of psychedelic streetwear. 
            Where fashion meets consciousness.
          </p>
          <Link
            to="/trippy-tales"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 group"
          >
            <span>Read the Tales</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/20 via-magenta-500/20 to-yellow-500/20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6">
            Ready to <span className="trippy-text">Elevate</span> Your Style?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
            Join thousands of vibers rocking TrippyDrip worldwide.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 group"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;