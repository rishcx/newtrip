import React from 'react';
import { Sparkles, Zap, Heart, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl sm:text-7xl font-black text-white mb-6">
            About <span className="trippy-text">TrippyDrip</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're not just a streetwear brand. We're a movement, a vibe, a portal to another dimension where fashion meets psychedelic art.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">Our Story</h2>
            <p className="text-lg text-gray-300 mb-4 leading-relaxed">
              Born from the fusion of street culture and psychedelic art, TrippyDrip emerged in 2024 as a response to the ordinary. We saw a world craving color, craving expression, craving that perfect blend of comfort and mind-bending aesthetics.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every piece we create is a canvas, every design a journey through liquid rainbows and neon dreams. We're here to make you stand out, feel confident, and embrace the trippy side of life.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1566909/pexels-photo-1566909.jpeg"
                alt="Psychedelic art"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                style={{ transform: 'translateZ(0)' }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-3xl blur-3xl opacity-30"></div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Creativity</h3>
            <p className="text-gray-400">Pushing boundaries with every design</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-magenta-500/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-magenta-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Energy</h3>
            <p className="text-gray-400">Infusing vibes into every piece</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Passion</h3>
            <p className="text-gray-400">Love for art and self-expression</p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Community</h3>
            <p className="text-gray-400">Building a tribe of vibers</p>
          </div>
        </div>

        {/* Mission */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-black text-white mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            To transform everyday streetwear into wearable art that inspires, energizes, and connects people who dare to be different. We're creating a universe where fashion isn't just about looking good—it's about feeling the energy, embracing the vibes, and expressing your truest, trippiest self.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-16 px-6 rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-400"></div>
          <h2 className="text-4xl font-black text-white mb-4">
            Join the <span className="trippy-text">Movement</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of a community that celebrates creativity, individuality, and all things trippy.
          </p>
          <a
            href="/shop"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;