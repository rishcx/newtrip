import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getCartTotal, clearCart } from '../mock';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// For Vercel: use relative path since API is on same domain (/api)
// For local dev: use full URL (backend runs on port 8000, routes prefixed with /api)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || '';

const Checkout = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadCart();
    loadRazorpayScript();
  }, []);

  const loadCart = () => {
    const currentCart = getCart();
    if (currentCart.length === 0) {
      navigate('/cart');
      return;
    }
    setCart(currentCart);
    setTotal(getCartTotal());
  };

  const loadRazorpayScript = () => {
    if (window.Razorpay) return;
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const getAuthToken = () => {
    // Get JWT token from Supabase session
    // Authentication is required for checkout
    return session?.access_token || '';
  };

  const handleCheckout = async () => {
    // Require authentication
    if (!session || !user) {
      toast({
        title: "Authentication required",
        description: "Please login or sign up to proceed with checkout",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast({
        title: "Payment not configured",
        description: "Razorpay key is missing. Please configure it in environment variables.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get auth token (required)
      const token = getAuthToken();
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to proceed with checkout",
          variant: "destructive"
        });
        navigate('/login');
        setLoading(false);
        return;
      }

      // Prepare order items
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));

      // Create order via backend (authentication required)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await axios.post(
        `${BACKEND_URL}/payments/create-order`,
        {
          amount: total * 1.1, // Include tax
          items: orderItems
        },
        { headers }
      );

      const { order_id, razorpay_order, amount } = response.data;

      // Initialize Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpay_order.amount,
        currency: razorpay_order.currency,
        name: 'TrippyDrip',
        description: `Order #${order_id}`,
        order_id: razorpay_order.id,
        handler: async (response) => {
          setProcessing(true);
          await handlePaymentSuccess(response, order_id);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#06b6d4'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.response?.data?.detail || error.message || "Something went wrong",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (razorpayResponse, orderId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Prepare headers (authentication required)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Verify payment with backend
      const verifyResponse = await axios.post(
        `${BACKEND_URL}/payments/verify`,
        {
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          order_id: orderId
        },
        { headers }
      );

      if (verifyResponse.data.success) {
        // Clear cart
        clearCart();
        window.dispatchEvent(new Event('cartUpdated'));
        
        toast({
          title: "Payment successful!",
          description: "Your order has been placed successfully.",
        });

        // Redirect to order confirmation
        navigate(`/order/${orderId}`);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment verification failed",
        description: error.response?.data?.detail || "Please contact support",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
          <p className="text-gray-400">Please wait while we verify your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.size} • {item.color} • Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 sticky top-24">
              <h2 className="text-2xl font-black text-white mb-6">Payment Summary</h2>
              
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
                  <span>Tax (10%)</span>
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
                disabled={loading || cart.length === 0}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

