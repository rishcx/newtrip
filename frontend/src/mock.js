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
  },
  {
    id: '7',
    name: 'Dreams Web Tee',
    price: 49.99,
    category: 'tees',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    description: 'In my dreams, I go... A dark, trippy spider web design with gothic vibes. Perfect for those who walk between dimensions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey', 'Red']
  },
  {
    id: '8',
    name: 'Mushroom Dreams Hoodie',
    price: 94.99,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e8f11',
    description: 'Nature meets psychedelia. Minimalist figures on mushrooms with warm orange and yellow cosmic vibes. Connect with the earth and beyond.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Orange', 'Yellow', 'Multi']
  },
  {
    id: '9',
    name: 'Kindred Spirits Tee',
    price: 47.99,
    category: 'tees',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2',
    description: 'Float through the cosmos with our astronaut design. For kindred spirits exploring the universe together. Space vibes, infinite possibilities.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Black', 'Deep Blue']
  },
  {
    id: '10',
    name: 'Tattoo Show Hoodie',
    price: 96.99,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3',
    description: 'Edgy tattoo-style design with traditional flash art vibes. Distressed, grunge aesthetic meets trippy streetwear. For the rebels and dreamers.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Grey']
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