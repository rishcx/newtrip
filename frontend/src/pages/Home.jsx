import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, Loader2, Ghost } from 'lucide-react';
import { cachedFetch } from '../lib/apiCache';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await cachedFetch(`${BACKEND_URL}/products`);
        const transformedProducts = data.map(product => ({
          ...product,
          image: product.image_url || product.image
        }));
        setFeaturedProducts(transformedProducts.slice(0, 3));
        setAllProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen relative z-[1]">
      <Hero />

      {/* Marquee Strip */}
      <MarqueeStrip className="border-y border-white/10 text-white/50" />

      {/* ===== BEST SELLERS ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2
                className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9]"
                style={{ fontFamily: "'Vorcas', 'Bungee', cursive" }}
              >
                BEST <span className="trippy-text inline-block">SELLERS</span>
              </h2>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-14 mb-12">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal>
            <div className="text-center">
              <Link
                to="/shop"
                className="group inline-flex items-center space-x-3 px-8 py-3.5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 700 }}
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* ===== VIBES SECTION ===== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-300 mb-3">Why TrippyDrip?</h3>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white" style={{ fontFamily: "'Vorcas', 'Bungee', cursive" }}>
                THE <span className="trippy-text">VIBES</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { num: '01', title: 'INSTANT ENERGY', desc: 'Pieces that radiate pure energy and make heads turn every single time.' },
              { num: '02', title: 'PSYCHEDELIC ART', desc: 'Wearable canvas featuring mind-bending designs and liquid swirl patterns.' },
              { num: '03', title: 'LIMITED RUNS', desc: 'Exclusive drops that sell out fast. Once gone, they\'re gone forever.' },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 120}>
                <div className="relative p-7 sm:p-9 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 hover:border-white/40 transition-colors duration-300">
                  <span className="block text-white text-sm font-bold tracking-[0.3em] mb-3">
                    {feature.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-wider" style={{ fontFamily: "'Vorcas', 'Righteous', cursive" }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed" style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 500 }}>
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEW COLLECTION ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-16">
              <h2
                className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9]"
                style={{ fontFamily: "'Vorcas', 'Bungee', cursive" }}
              >
                NEW <span className="trippy-text inline-block">COLLECTION</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-14 mb-12">
            {allProducts.length > 6 ? allProducts.slice(6, 10).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            )) : allProducts.length > 3 ? allProducts.slice(0, 4).map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            )) : (
              <div className="col-span-full text-center text-gray-300 py-8">
                <Ghost className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                <p className="font-medium tracking-wider uppercase text-sm" style={{ fontFamily: "'Vorcas', sans-serif" }}>More dropping soon...</p>
              </div>
            )}
          </div>

          <ScrollReveal>
            <div className="text-center">
              <Link
                to="/shop"
                className="group inline-flex items-center space-x-3 px-8 py-3.5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 700 }}
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* ===== TRIPPY TALES ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
        <div className="absolute inset-0">
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="block text-sm font-bold tracking-[0.3em] uppercase text-gray-300 mb-4">
              Stories & Insights
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-4" style={{ fontFamily: "'Vorcas', 'Bungee', cursive" }}>
              <span className="trippy-text">TRIPPY TALES</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 500 }}>
              Stories, insights, and cosmic wisdom from the world of psychedelic streetwear.
            </p>

            <Link
              to="/trippy-tales"
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-black text-base sm:text-lg rounded-full hover:bg-zinc-200 transition-colors duration-300 tracking-wider uppercase"
              style={{ fontFamily: "'Vorcas', 'Righteous', cursive" }}
            >
              <span>Read the Tales</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white/5"></div>
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-[0.95]" style={{ fontFamily: "'Vorcas', 'Bungee', cursive" }}>
              READY TO{' '}<span className="trippy-text inline-block">ELEVATE</span>{' '}YOUR STYLE?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-8 leading-relaxed" style={{ fontFamily: "'Vorcas', sans-serif", fontWeight: 500 }}>
              Join thousands of vibers rocking TrippyDrip worldwide.
            </p>
            <Link
              to="/shop"
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-black text-base sm:text-lg rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 tracking-wider uppercase"
              style={{ fontFamily: "'Vorcas', 'Righteous', cursive" }}
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Home;
