import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { addToCart } from '../mock';
import { ShoppingCart, Heart, Share2, Check, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setProduct(null);
            return;
          }
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        // Transform API data to match component expectations
        const transformedProduct = {
          ...data,
          image: data.image_url || data.image // Support both field names
        };
        setProduct(transformedProduct);
        if (transformedProduct.sizes && transformedProduct.sizes.length > 0) {
          setSelectedSize(transformedProduct.sizes[0]);
        }
        if (transformedProduct.colors && transformedProduct.colors.length > 0) {
          setSelectedColor(transformedProduct.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select size and color",
        variant: "destructive"
      });
      return;
    }

    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to cart!",
      description: `${product.name} - ${selectedSize} - ${selectedColor}`
    });

    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Product not found</p>
          <Link to="/shop" className="text-cyan-400 hover:text-cyan-300">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8 flex items-center space-x-2 text-xs sm:text-sm flex-wrap">
          <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</Link>
          <span className="text-gray-600">/</span>
          <Link to="/shop" className="text-gray-400 hover:text-cyan-400 transition-colors">Shop</Link>
          <span className="text-gray-600">/</span>
          <span className="text-white truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative group">
            <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                src={product.image || product.image_url}
                alt={product.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              />
            </div>
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button className="p-3 bg-black/70 backdrop-blur-sm rounded-full hover:bg-cyan-500 transition-colors group">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-black/70 backdrop-blur-sm rounded-full hover:bg-cyan-500 transition-colors group">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 text-sm font-bold rounded-full border border-cyan-500/30">
                {product.category.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">{product.name}</h1>
            
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-white">${product.price}</span>
              <span className="text-base sm:text-lg text-gray-400 line-through">$129.99</span>
              <span className="px-2 sm:px-3 py-1 bg-green-500/10 text-green-400 text-xs sm:text-sm font-bold rounded-full">SAVE 30%</span>
            </div>

            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Size</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Color</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                      selectedColor === color
                        ? 'bg-magenta-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-white font-bold mb-2 sm:mb-3 text-sm sm:text-base">Quantity</label>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xl sm:text-2xl font-bold text-white w-10 sm:w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                added
                  ? 'bg-green-500 text-white shadow-[0_0_24px_rgba(34,197,94,0.8)]'
                  : 'bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-black shadow-[0_0_30px_rgba(251,191,36,0.8)] hover:shadow-[0_0_40px_rgba(244,114,182,0.9)] hover:scale-105'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Product Features */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Premium Quality</p>
                  <p className="text-sm text-gray-400">Ultra-soft, heavyweight fabric</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Check className="w-5 h-5 text-magenta-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Unique Design</p>
                  <p className="text-sm text-gray-400">Limited edition psychedelic print</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Fast Shipping</p>
                  <p className="text-sm text-gray-400">Free worldwide delivery on orders over $100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;