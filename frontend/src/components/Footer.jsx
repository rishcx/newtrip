import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black/85 backdrop-blur-lg border-t border-zinc-800 mt-20">
      <div className="h-[1px] bg-white/10"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-10">
          {/* Brand */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-black trippy-text">TrippyDrip</h2>
            </Link>
            <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
              Premium streetwear that blends bold psychedelic art with everyday comfort.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-zinc-800/60 text-gray-300 hover:text-white hover:bg-white/10 transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800/60 text-gray-300 hover:text-white hover:bg-white/10 transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800/60 text-gray-300 hover:text-white hover:bg-white/10 transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {[
                { to: '/shop', label: 'Shop' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
                { to: '/trippy-tales', label: 'Trippy Tales' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-200 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Get in Touch</h3>
            <a
              href="mailto:support@trippydrip.co.in"
              className="inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors text-sm"
            >
              <Mail className="w-4 h-4 text-white" />
              support@trippydrip.co.in
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-300 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} TrippyDrip. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-5 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
