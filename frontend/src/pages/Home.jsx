import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products } from '../mock';
import { ArrowRight, Zap, Palette, Sparkles, BookOpen } from 'lucide-react';

const Home = () => {
  const featuredProducts = products.slice(0, 3);

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
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Featured Collection</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-4">
              Latest <span className="trippy-text">Drops</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Fresh from the dimension. Limited edition pieces that define the vibe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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

      {/* New Design Collection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">New Collection</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-4">
              Limited <span className="trippy-text">Designs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Exclusive drops featuring trippy art, cosmic vibes, and mind-bending aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.slice(6, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 group"
            >
              <span>View All Designs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Design Collection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">New Collection</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-4">
              Limited <span className="trippy-text">Designs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Exclusive drops featuring trippy art, cosmic vibes, and mind-bending aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.slice(6, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 group"
            >
              <span>View All Designs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
            Ready to <span className="trippy-text">Elevate</span> Your Style?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of vibers rocking TrippyDrip worldwide.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 group"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;