import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import MarqueeStrip from '../components/MarqueeStrip';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, Zap, Loader2, BookOpen, Ghost, Eye } from 'lucide-react';
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-magenta-500/5 to-yellow-500/5"></div>
        <MarqueeStrip
          className="border-y border-white/5 text-white/40 relative z-10"
        />
      </div>

      {/* ===== BEST SELLERS ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2
                className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9]"
                style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}
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
                style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 700 }}
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-magenta-400 mb-3" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif" }}>Why TrippyDrip?</h3>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white" style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}>
                THE <span className="trippy-text">VIBES</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Zap, color: 'cyan', gradient: 'from-cyan-500/20 to-cyan-500/5', title: 'INSTANT ENERGY', desc: 'Pieces that radiate pure energy and make heads turn every single time.' },
              { icon: Eye, color: 'magenta', gradient: 'from-magenta-500/20 to-magenta-500/5', title: 'PSYCHEDELIC ART', desc: 'Wearable canvas featuring mind-bending designs and liquid swirl patterns.' },
              { icon: Ghost, color: 'yellow', gradient: 'from-yellow-500/20 to-yellow-500/5', title: 'LIMITED RUNS', desc: 'Exclusive drops that sell out fast. Once gone, they\'re gone forever.' },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 150}>
                <div className={`glow-card group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b ${feature.gradient} backdrop-blur-sm border border-white/5 hover:border-${feature.color}-500/30 transition-all duration-500 text-center overflow-hidden`}>
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className={`w-14 h-14 mx-auto mb-5 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white mb-2 tracking-wider" style={{ fontFamily: "'Another Nothing', 'Righteous', cursive" }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed tracking-wide" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 500 }}>
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reverse Marquee */}
      <MarqueeStrip
        direction="right"
        messages={['STAY TRIPPY', 'DROP CULTURE', 'NEON GLOW', 'MIND EXPANSION', 'COSMIC DRIP', 'BREAK THE MOLD', 'ACID DREAMS', 'PURE ENERGY']}
        className="border-y border-white/5 text-white/30"
        speed={35}
      />

      {/* ===== NEW COLLECTION ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-16">
              <h2
                className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9]"
                style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}
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
              <div className="col-span-full text-center text-gray-500 py-8">
                <Ghost className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                <p className="font-medium tracking-wider uppercase text-sm" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif" }}>More dropping soon...</p>
              </div>
            )}
          </div>

          <ScrollReveal>
            <div className="text-center">
              <Link
                to="/shop"
                className="group inline-flex items-center space-x-3 px-8 py-3.5 border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300"
                style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 700 }}
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/[0.03] rounded-full blur-[120px]"></div>
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20 backdrop-blur-sm mb-6">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-amber-400" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif" }}>
                Stories & Insights
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-4" style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}>
              <span className="trippy-text">TRIPPY TALES</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-10 max-w-2xl mx-auto tracking-wide" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 500 }}>
              Dive into stories, insights, and cosmic wisdom from the world of psychedelic streetwear. Where fashion meets consciousness.
            </p>

            <Link
              to="/trippy-tales"
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-black text-base sm:text-lg rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300 tracking-wider uppercase"
              style={{ fontFamily: "'Another Nothing', 'Righteous', cursive" }}
            >
              <span>Read the Tales</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {[
              { symbol: '◆', color: 'cyan', title: 'Premium Quality', desc: 'High-grade materials' },
              { symbol: '⚡', color: 'magenta', title: 'Free Shipping', desc: 'Orders over $50' },
              { symbol: '↻', color: 'yellow', title: 'Easy Returns', desc: '30-day policy' },
              { symbol: '◈', color: 'green', title: 'Secure Pay', desc: 'SSL encrypted' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="text-center p-4 sm:p-5 bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className={`text-xl sm:text-2xl text-${item.color}-400 mb-2`}>{item.symbol}</div>
                  <h3 className="text-white text-xs sm:text-sm font-black tracking-wider uppercase mb-0.5" style={{ fontFamily: "'Another Nothing', 'Righteous', cursive" }}>{item.title}</h3>
                  <p className="text-gray-600 text-[10px] sm:text-xs tracking-wide" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif" }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-magenta-500/20 to-yellow-500/20"></div>
        </div>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-[0.95]" style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}>
              READY TO{' '}<span className="trippy-text inline-block">ELEVATE</span>{' '}YOUR STYLE?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 tracking-wide" style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 500 }}>
              Join thousands of vibers rocking TrippyDrip worldwide.
            </p>
            <Link
              to="/shop"
              className="group inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-black text-base sm:text-lg rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 tracking-wider uppercase"
              style={{ fontFamily: "'Another Nothing', 'Righteous', cursive" }}
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
