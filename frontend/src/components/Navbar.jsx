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

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-cyan-500/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold trippy-text">
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
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-magenta-500 text-white">
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

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-cyan-500/20">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-lg font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-cyan-400'
                    : 'text-white hover:text-cyan-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <>
                <div className="pt-4 border-t border-cyan-500/20">
                  <p className="text-sm text-gray-400 mb-2">{user.email}</p>
                  <Button
                    onClick={async () => {
                      await signOut();
                      setIsOpen(false);
                      navigate('/');
                    }}
                    variant="ghost"
                    className="w-full text-white hover:bg-cyan-500/10 hover:text-cyan-400 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;