import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import MarqueeStrip from './MarqueeStrip';

const Footer = () => {
  return (
    <footer className="relative bg-black/80 backdrop-blur-lg border-t border-zinc-800 mt-20">
      {/* Gradient top line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

      {/* Mini marquee */}
      <MarqueeStrip
        messages={['TRIPPY DRIP', 'BEND REALITY', 'STAY COSMIC', 'DRIP HARDER', 'NEON DREAMS']}
        speed={40}
        className="text-white/20 py-2 border-b border-zinc-800/50"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-black trippy-text">TrippyDrip</h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium trippy streetwear that blends psychedelic art with everyday comfort. Express yourself with bold designs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-zinc-800/50 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800/50 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800/50 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/shop', label: 'Shop All' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/trippy-tales', label: 'Trippy Tales' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm inline-flex items-center group">
                    <span className="w-0 group-hover:w-3 h-[1px] bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-2">
              {['Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ', 'Track Order'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm inline-flex items-center group">
                    <span className="w-0 group-hover:w-3 h-[1px] bg-cyan-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@trippydrip.co.in" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  support@trippydrip.co.in
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Worldwide Shipping</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-zinc-800 pt-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { Icon: Shield, color: 'cyan', title: 'Secure Payment', desc: 'SSL Encrypted' },
              { Icon: Truck, color: 'magenta', title: 'Free Shipping', desc: 'On orders $50+' },
              { Icon: RotateCcw, color: 'yellow', title: 'Easy Returns', desc: '30-day policy' },
              { Icon: CreditCard, color: 'green', title: 'Multiple Payment', desc: 'Options available' },
            ].map(badge => (
              <div key={badge.title} className="flex items-center space-x-3">
                <badge.Icon className={`w-5 h-5 text-${badge.color}-400 flex-shrink-0`} />
                <div>
                  <p className="text-white font-semibold text-sm">{badge.title}</p>
                  <p className="text-gray-400 text-xs">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} TrippyDrip. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
