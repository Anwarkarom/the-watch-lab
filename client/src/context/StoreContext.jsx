import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { initialProducts } from '../data/initialProducts';

const StoreContext = createContext();

export const currencies = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  MAD: { symbol: 'DH ', rate: 10, label: 'MAD (DH)' }
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [gender, setGender] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('twl_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('twl_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrency] = useState('USD');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('twl_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('twl_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch Products from Backend API or local fallback
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products', {
        params: { category, gender, search: searchQuery, sort: sortBy }
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
      } else {
        filterFallbackProducts();
      }
    } catch (err) {
      console.warn('API offline/error, using internal products:', err.message);
      filterFallbackProducts();
    } finally {
      setLoading(false);
    }
  };

  const filterFallbackProducts = () => {
    let filtered = [...initialProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (gender && gender !== 'All') {
      filtered = filtered.filter(p => p.gender === gender);
    }
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    setProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, [category, gender, searchQuery, sortBy]);

  // Price formatting according to selected currency
  const formatPrice = (priceInUSD) => {
    const cur = currencies[currency] || currencies.USD;
    const converted = (priceInUSD * cur.rate).toFixed(0);
    return `${cur.symbol}${converted}`;
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev =>
      prev.map(item => {
        if ((item._id || item.id) === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product) => {
    const pId = product._id || product.id;
    setWishlist(prev => {
      const exists = prev.some(item => (item._id || item.id) === pId);
      if (exists) {
        return prev.filter(item => (item._id || item.id) !== pId);
      } else {
        return [...prev, product];
      }
    });
  };

  // Cart Calculations
  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmountUSD = appliedCoupon ? cartSubtotalUSD * 0.2 : 0; // 20% OFF for coupons like WATCHLAB20
  const cartTotalUSD = Math.max(0, cartSubtotalUSD - discountAmountUSD);

  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === 'WATCHLAB20') {
      setAppliedCoupon({ code: 'WATCHLAB20', discountPercent: 20 });
      return { success: true, message: '🎉 Promo coupon applied! 20% OFF your order.' };
    }
    return { success: false, message: 'Invalid promo code. Try: WATCHLAB20' };
  };

  // Place Order API call
  const placeOrder = async (customerDetails, paymentMethod = 'COD') => {
    const orderPayload = {
      customer: customerDetails,
      items: cart.map(i => ({
        product: i._id || i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      })),
      totalAmount: cartTotalUSD,
      currency,
      paymentMethod
    };

    try {
      const res = await axios.post('/api/orders', orderPayload);
      const newOrder = res.data.order;
      setLastPlacedOrder(newOrder);
      clearCart();
      setIsCheckoutOpen(false);
      return { success: true, trackingNumber: res.data.trackingNumber, order: newOrder };
    } catch (err) {
      console.warn('API error placing order, generating client fallback order code...');
      const fallbackCode = `TWL-${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackOrder = {
        trackingNumber: fallbackCode,
        customer: customerDetails,
        items: cart,
        totalAmount: cartTotalUSD,
        currency,
        paymentMethod,
        status: 'Order Placed',
        createdAt: new Date().toISOString()
      };
      setLastPlacedOrder(fallbackOrder);
      clearCart();
      setIsCheckoutOpen(false);
      return { success: true, trackingNumber: fallbackCode, order: fallbackOrder };
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      setProducts,
      loading,
      category, setCategory,
      gender, setGender,
      searchQuery, setSearchQuery,
      sortBy, setSortBy,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      currency, setCurrency,
      formatPrice,
      isCartOpen, setIsCartOpen,
      selectedProduct, setSelectedProduct,
      isCheckoutOpen, setIsCheckoutOpen,
      isTrackingOpen, setIsTrackingOpen,
      isAdminOpen, setIsAdminOpen,
      lastPlacedOrder, setLastPlacedOrder,
      cartSubtotalUSD,
      discountAmountUSD,
      cartTotalUSD,
      appliedCoupon,
      applyCoupon,
      placeOrder,
      fetchProducts
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
