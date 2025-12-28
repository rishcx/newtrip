import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminId, setAdminId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [],
    stock_quantity: 0
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [newColor, setNewColor] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Verify and store credentials
  const handleLogin = async () => {
    if (!adminKey || !adminId) {
      toast({
        title: "Missing credentials",
        description: "Please enter both Admin Key and Admin ID",
        variant: "destructive"
      });
      return;
    }
    
    // Verify credentials by trying to access admin endpoint
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/products`, {
        headers: {
          'X-Admin-Key': adminKey,
          'X-Admin-ID': adminId
        }
      });

      // Try to parse JSON, but handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, create a generic error
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      } else {
        // If response is not JSON, read as text (but only once)
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText} - ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        // Credentials are invalid
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Invalid credentials",
            description: data.detail || data.message || "Admin Key or Admin ID is incorrect",
            variant: "destructive"
          });
          setAdminKey('');
          setAdminId('');
          return;
        }
        throw new Error(data.detail || data.message || `Server error: ${response.status}`);
      }

      // Credentials are valid - store them
      sessionStorage.setItem('admin_key', adminKey);
      sessionStorage.setItem('admin_id', adminId);
      setAuthenticated(true);
      toast({
        title: "Admin access granted",
        description: "You can now manage products"
      });
      
      // Load products
      loadProducts();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Could not verify credentials. Please check your connection and credentials.",
        variant: "destructive"
      });
      setAdminKey('');
      setAdminId('');
    } finally {
      setLoading(false);
    }
  };

  // Check if already authenticated and verify credentials
  React.useEffect(() => {
    const verifyStoredCredentials = async () => {
      const storedKey = sessionStorage.getItem('admin_key');
      const storedId = sessionStorage.getItem('admin_id');
      
      if (storedKey && storedId) {
        // Verify stored credentials are still valid
        try {
          const response = await fetch(`${BACKEND_URL}/admin/products`, {
            headers: {
              'X-Admin-Key': storedKey,
              'X-Admin-ID': storedId
            }
          });

          if (response.ok) {
            // Credentials are valid
            setAdminKey(storedKey);
            setAdminId(storedId);
            setAuthenticated(true);
          } else {
            // Credentials are invalid, clear them
            sessionStorage.removeItem('admin_key');
            sessionStorage.removeItem('admin_id');
            // Only show toast if it's an auth error, not a server error
            if (response.status === 401 || response.status === 403) {
              toast({
                title: "Session expired",
                description: "Please login again",
                variant: "destructive"
              });
            }
          }
        } catch (error) {
          // Network error - don't clear credentials, just don't auto-login
          console.warn('Could not verify stored credentials:', error);
        }
      }
    };

    verifyStoredCredentials();
  }, []);

  // Load products when authenticated
  React.useEffect(() => {
    if (authenticated && adminKey && adminId) {
      loadProducts();
    }
  }, [authenticated]);

  const loadProducts = async () => {
    const key = adminKey || sessionStorage.getItem('admin_key');
    const id = adminId || sessionStorage.getItem('admin_id');
    
    if (!key || !id) {
      console.warn('Cannot load products: missing admin credentials');
      return;
    }
    
    setLoadingProducts(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/products`, {
        headers: {
          'X-Admin-Key': key,
          'X-Admin-ID': id
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load products');
      }
      
      if (data.success && data.products) {
        console.log(`Loaded ${data.products.length} products:`, data.products.map(p => ({ id: p.id, name: p.name })));
        setProducts(data.products);
      } else {
        console.warn('Unexpected response format:', data);
        // Try to extract products from different response formats
        if (Array.isArray(data)) {
          console.log('Response is array, using directly');
          setProducts(data);
        } else if (data.products) {
          console.log('Found products in data.products');
          setProducts(data.products);
        } else {
          console.warn('No products found in response');
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error loading products",
        description: error.message || "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(`Are you sure you want to delete product "${productId}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(productId);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': adminKey,
          'X-Admin-ID': adminId
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete product');
      }

      toast({
        title: "Product deleted",
        description: `Product ${productId} has been removed`
      });

      // Reload products list
      loadProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 for preview and upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, image_url: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor]
      });
      setNewColor('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(c => c !== color)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authenticated) {
      toast({
        title: "Authentication required",
        description: "Please login with admin credentials",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (!formData.id || !formData.name || !formData.price) {
      toast({
        title: "Missing fields",
        description: "Please fill in ID, Name, and Price",
        variant: "destructive"
      });
      return;
    }

    if (formData.colors.length === 0) {
      toast({
        title: "No colors",
        description: "Please add at least one color",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey,
          'X-Admin-ID': adminId
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity) || 0
        })
      });

      const data = await response.json();
      
      console.log('Product creation response status:', response.status);
      console.log('Product creation response data:', data);
      
      if (!response.ok) {
        console.error('Product creation failed:', data);
        throw new Error(data.detail || 'Failed to create product');
      }

      console.log('Product created successfully:', data);
      
      // Verify the product was created by checking the response
      if (data.product && data.product.id) {
        console.log(`Product ${data.product.id} created:`, data.product);
      }
      
      toast({
        title: "Product created!",
        description: `${formData.name} has been added successfully`
      });

      // Reset form
      setFormData({
        id: '',
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'hoodies',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [],
        stock_quantity: 0
      });
      setImagePreview(null);
      
      // Reload products list immediately and again after delay
      loadProducts();
      setTimeout(() => {
        console.log('Refreshing products list after delay...');
        loadProducts();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_key');
    sessionStorage.removeItem('admin_id');
    setAuthenticated(false);
    setAdminKey('');
    setAdminId('');
    toast({
      title: "Logged out",
      description: "Admin session ended"
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-black trippy-text mb-2">Admin Access</h1>
              <p className="text-sm sm:text-base text-gray-400">Enter your admin credentials</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId" className="text-white">Admin ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="Your email or admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminKey" className="text-white">Admin Secret Key</Label>
                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Enter admin secret key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-600 hover:to-magenta-600 text-white font-bold py-4 sm:py-6 text-base sm:text-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Admin <span className="trippy-text">Panel</span>
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={loadProducts}
              variant="ghost"
              className="text-white hover:bg-cyan-500/10 hover:text-cyan-400"
              disabled={loadingProducts}
            >
              {loadingProducts ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-red-500/10 hover:text-red-400"
            >
              <X className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-cyan-500/20 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Existing Products ({products.length})</h2>
          {loadingProducts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No products found. Create your first product below!</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex-1 flex items-center gap-4">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-white font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-400">ID: {product.id} | ${product.price} | {product.category}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.colors?.join(', ') || 'No colors'}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300 flex-shrink-0"
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Product Form */}
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product ID */}
          <div className="space-y-2">
            <Label htmlFor="id" className="text-white">Product ID *</Label>
            <Input
              id="id"
              type="text"
              placeholder="e.g., 7, 8, 9..."
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Product Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Cosmic Vortex Hoodie"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <textarea
              id="description"
              rows="3"
              placeholder="Product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 text-white rounded-lg focus:border-cyan-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="89.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 text-white rounded-lg focus:border-cyan-500 focus:outline-none"
              >
                <option value="hoodies">Hoodies</option>
                <option value="tees">Tees</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">Product Image</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-black/50 border-cyan-500/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
              />
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-cyan-500/30">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">Or enter image URL:</p>
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url && !formData.image_url.startsWith('data:') ? formData.image_url : ''}
              onChange={(e) => {
                setFormData({ ...formData, image_url: e.target.value });
                if (e.target.value.startsWith('http')) {
                  setImagePreview(e.target.value);
                }
              }}
              className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label className="text-white">Colors *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add color (e.g., Black, Red, Multi)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
              />
              <Button
                type="button"
                onClick={handleAddColor}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stock" className="text-white">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="50"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
              className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-600 hover:to-magenta-600 text-white font-bold py-4 sm:py-6 text-base sm:text-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Product...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Create Product
              </>
            )}
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;

