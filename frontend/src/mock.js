// Mock data for TrippyDrip streetwear store

export const products = [
  {
    id: '1',
    name: 'Cosmic Vortex Hoodie',
    price: 89.99,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1579572331145-5e53b299c64e',
    description: 'Dive into the void with our signature cosmic vortex design. Ultra-soft fleece with trippy all-over print.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Purple', 'Cyan']
  },
  {
    id: '2',
    name: 'Neon Dreams Tee',
    price: 45.99,
    category: 'tees',
    image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5',
    description: 'Electric vibes only. Premium cotton tee with glow-in-the-dark psychedelic print.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'Black', 'White']
  },
  {
    id: '3',
    name: 'Acid Trip Hoodie',
    price: 95.99,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1609873814058-a8928924184a',
    description: 'Bold colors meet surreal patterns. This hoodie is a journey through liquid rainbows.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Yellow', 'Green', 'Multi']
  },
  {
    id: '4',
    name: 'Urban Mystic Hoodie',
    price: 92.99,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e',
    description: 'Street meets spiritual. Oversized fit with mystical mandala embroidery.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Brown', 'Tan', 'Olive']
  },
  {
    id: '5',
    name: 'Liquid Reality Tee',
    price: 42.99,
    category: 'tees',
    image: 'https://images.pexels.com/photos/1036396/pexels-photo-1036396.jpeg',
    description: 'Reality melts away. Distorted graphics that shift with every move.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal']
  },
  {
    id: '6',
    name: 'Dimension Shift Hoodie',
    price: 98.99,
    category: 'hoodies',
    image: 'https://images.pexels.com/photos/1868471/pexels-photo-1868471.jpeg',
    description: 'Step between worlds. Color-shifting fabric with holographic details.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Multi', 'Black', 'White']
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

// Cart utilities for localStorage
export const getCart = () => {
  const cart = localStorage.getItem('trippydrip_cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem('trippydrip_cart', JSON.stringify(cart));
};

export const addToCart = (product, size, color) => {
  const cart = getCart();
  const existingItem = cart.find(
    item => item.id === product.id && item.size === size && item.color === color
  );
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, size, color, quantity: 1 });
  }
  
  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId, size, color) => {
  let cart = getCart();
  cart = cart.filter(
    item => !(item.id === productId && item.size === size && item.color === color)
  );
  saveCart(cart);
  return cart;
};

export const updateCartQuantity = (productId, size, color, quantity) => {
  const cart = getCart();
  const item = cart.find(
    item => item.id === productId && item.size === size && item.color === color
  );
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId, size, color);
    }
    item.quantity = quantity;
  }
  
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem('trippydrip_cart');
  return [];
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};