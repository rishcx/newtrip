import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dimmed overlay for text readability while keeping background visible */}
      <div className="absolute inset-0 bg-black/20 md:bg-black/30 z-0"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl opacity-30"></div>
        <div className="floating-orb-delayed absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm font-medium">New Collection Drop</span>
        </div>

        <h1 className="hero-title text-4xl sm:text-6xl lg:text-8xl trippy-text mt-2">
          REALITY
          <span className="block trippy-text mt-2">IS</span>
          <span className="block text-3xl sm:text-5xl lg:text-7xl mt-2">Universe</span>
        </h1>

        <p className="text-lg sm:text-2xl text-gray-200 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
          Psychedelic streetwear that bends reality. Where neon dreams meet liquid swirls in wearable art.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] inline-flex items-center space-x-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/about"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
            <div className="text-gray-400 text-sm">Trippy Articles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-magenta-400 mb-2">10K+</div>
            <div className="text-gray-400 text-sm">Happy Vibers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
            <div className="text-gray-400 text-sm">Psychedelic</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;