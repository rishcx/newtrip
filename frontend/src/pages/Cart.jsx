import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } from '../mock';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const currentCart = getCart();
    setCart(currentCart);
    setTotal(getCartTotal());
  };

  const handleUpdateQuantity = (productId, size, color, newQuantity) => {
    updateCartQuantity(productId, size, color, newQuantity);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (productId, size, color, productName) => {
    removeFromCart(productId, size, color);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Removed from cart",
      description: productName
    });
  };

  const handleClearCart = () => {
    clearCart();
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Cart cleared",
      description: "All items removed from cart"
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-600" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added any trippy items to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 group"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-4">
            Shopping <span className="trippy-text">Cart</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.color}-${index}`}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {item.size} • {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.size, item.color, item.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-10 h-10 sm:w-8 sm:h-8 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors font-bold flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-base sm:text-lg font-bold text-white w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-10 h-10 sm:w-8 sm:h-8 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors font-bold flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs sm:text-sm text-gray-400">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleClearCart}
              className="w-full py-3 text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-zinc-800 lg:sticky lg:top-24">
              <h2 className="text-2xl font-black text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white font-bold">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-zinc-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-2xl font-black text-cyan-400">${(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/shop"
                className="block w-full py-4 bg-transparent border-2 border-zinc-700 text-white font-bold text-lg rounded-full hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300 text-center"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-zinc-700 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-magenta-400 rounded-full"></div>
                  <span>30-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;