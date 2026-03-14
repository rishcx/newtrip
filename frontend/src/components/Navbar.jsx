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
  const [logoError, setLogoError] = useState(false);
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
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 sm:h-28">

          {/* LEFT: Logo + Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            {!logoError ? (
              <img
                src="/trippydrip-logo.png"
                alt="TrippyDrip"
                className="h-[55px] sm:h-[85px] w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-400 via-magenta-500 to-yellow-400 shadow-[0_0_25px_rgba(236,72,153,0.4)]">
                <span className="text-white font-black text-2xl sm:text-3xl" style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}>T</span>
              </div>
            )}
            <div className="flex flex-col leading-none">
              <span
                className="text-xl sm:text-2xl font-black tracking-wide trippy-text"
                style={{ fontFamily: "'Another Nothing', 'Bungee', cursive" }}
              >
                TRIPPYDRIP
              </span>
              <span
                className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-gray-400 font-semibold mt-0.5"
                style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif" }}
              >
                EST. 2025
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 xl:px-6 py-2.5 text-base font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 700 }}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Cart + Login */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-white/[0.08] rounded-lg transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-magenta-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="max-w-[120px] truncate text-gray-300 text-sm hidden xl:block">{user.email}</span>
                </div>
                <Button
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/[0.08] text-sm px-3 py-2 rounded-lg transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  className="bg-white text-black font-black text-sm tracking-[0.15em] uppercase px-7 py-2.5 rounded-sm hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-105"
                  style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif", fontWeight: 800 }}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Cart + Login + Hamburger */}
          <div className="lg:hidden flex items-center space-x-3 ml-auto">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-magenta-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {!user && (
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-white text-black font-black text-[11px] tracking-[0.12em] uppercase px-5 py-2 rounded-sm hover:bg-cyan-400 transition-all"
                  style={{ fontFamily: "'Another Nothing', 'Rajdhani', sans-serif" }}
                >
                  Login
                </Button>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Full-Page Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] trippy-menu-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="trippy-menu-orb-1 absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-40"></div>
            <div className="trippy-menu-orb-2 absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-40"></div>
          </div>

          <div
            className="relative z-10 h-full flex flex-col items-center justify-center px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full border border-white/20 z-20"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {!logoError && (
              <div className="mb-10">
                <img
                  src="/trippydrip-logo.png"
                  alt="TrippyDrip"
                  className="h-20 w-auto object-contain "
                  onError={() => setLogoError(true)}
                />
              </div>
            )}

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
                    fontFamily: "'Another Nothing', 'Bungee', cursive",
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {user && (
              <div className="absolute bottom-20 left-0 right-0 px-6 text-center space-y-4">
                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-4">{user.email}</p>
                  <Button
                    onClick={async () => {
                      await signOut();
                      setIsOpen(false);
                      navigate('/');
                    }}
                    variant="ghost"
                    className="w-full max-w-xs mx-auto text-white hover:bg-white/10 border border-white/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
