import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { getCartCount } from '../mock';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Lock body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-cyan-500/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group hover:opacity-80 transition-opacity">
            <img 
              src="/trippydrip-logo.png" 
              alt="TrippyDrip Logo" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-lg"
              onError={(e) => {
                // Hide image and show text fallback if image not found
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) {
                  fallback.style.display = 'block';
                }
              }}
            />
            <div className="text-2xl sm:text-3xl font-bold trippy-text" style={{ display: 'none' }}>
              TrippyDrip
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-all duration-300 hover:text-cyan-400 ${
                  location.pathname === link.path
                    ? 'text-cyan-400'
                    : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              to="/cart"
              className="relative p-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-magenta-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-white text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 hidden lg:flex">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </span>
                <Button
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  variant="ghost"
                  className="text-white hover:bg-cyan-500/10 hover:text-cyan-400 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-600 hover:to-magenta-600 text-white text-xs sm:text-sm px-3 sm:px-6">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-magenta-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {!user && (
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-black font-semibold shadow-[0_0_20px_rgba(251,191,36,0.7)] hover:shadow-[0_0_28px_rgba(244,114,182,0.9)] hover:scale-105 transition-transform"
                >
                  Login
                </Button>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-cyan-500/10 rounded-lg transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

    </nav>
      {/* Trippy Full-Page Mobile Menu - Rendered outside nav for proper z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] trippy-menu-overlay"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the content
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="trippy-menu-orb-1 absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-40"></div>
            <div className="trippy-menu-orb-2 absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-40"></div>
            <div className="trippy-menu-orb-3 absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl opacity-30"></div>
          </div>

          {/* Menu Content */}
          <div 
            className="relative z-10 h-full flex flex-col items-center justify-center px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-all duration-300 border border-cyan-500/30 z-20"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Links */}
            <nav className="space-y-6 text-center">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-3xl sm:text-4xl font-black transition-all duration-500 trippy-menu-link ${
                    location.pathname === link.path
                      ? 'text-cyan-400 scale-110'
                      : 'text-white hover:text-cyan-400 hover:scale-105'
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            {user && (
              <div className="absolute bottom-20 left-0 right-0 px-6 text-center space-y-4">
                <div className="pt-6 border-t border-cyan-500/30">
                  <p className="text-sm text-gray-400 mb-4">{user.email}</p>
                  <Button
                    onClick={async () => {
                      await signOut();
                      setIsOpen(false);
                      navigate('/');
                    }}
                    variant="ghost"
                    className="w-full max-w-xs mx-auto text-white hover:bg-cyan-500/10 hover:text-cyan-400 border border-cyan-500/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2 text-cyan-400/50 text-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span>TrippyDrip</span>
                <div className="w-2 h-2 rounded-full bg-magenta-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;