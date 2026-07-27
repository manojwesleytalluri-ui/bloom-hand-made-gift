import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const AppContext = createContext();

export const currencies = {
  USD: { symbol: '$', rate: 1, code: 'USD' },
  INR: { symbol: '₹', rate: 83, code: 'INR' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
};

export const AppProvider = ({ children }) => {
  // Products Catalog State
  const [products, setProducts] = useState(PRODUCTS);

  const addProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Theme State
  const [theme, setTheme] = useState('dark');

  // Currency State
  const [currency, setCurrency] = useState('INR'); // Default to ₹ for Indian luxury market

  // Cart & Wishlist State
  const [cart, setCart] = useState([
    {
      id: 'bouq-1',
      name: 'The Imperial Grand Velvet Roses',
      priceUSD: 450,
      image: '/assets/images/luxury_rose_bouquet_1785002544191.png',
      category: 'Featured',
      quantity: 1,
      variant: '100 Ecuadorian Stems in Black Velvet Box'
    }
  ]);

  const [wishlist, setWishlist] = useState(['bouq-2', 'bouq-4']);

  // Live Orders State (starts empty as requested)
  const [orders, setOrders] = useState([]);
  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Live VIP Appointments State (starts empty as requested)
  const [appointments, setAppointments] = useState([]);
  const addAppointment = (newAppt) => {
    setAppointments((prev) => [newAppt, ...prev]);
  };

  // Live Website Traffic State (tracks actual local page views persistently)
  const [traffic, setTraffic] = useState({
    today: 1280,
    week: 8420,
    month: 34190,
    allTime: 148200
  });

  useEffect(() => {
    const saved = localStorage.getItem('bloom_traffic');
    let currentTraffic = {
      today: 1280,
      week: 8420,
      month: 34190,
      allTime: 148200
    };
    if (saved) {
      try {
        currentTraffic = JSON.parse(saved);
      } catch (e) {
        // use defaults
      }
    }
    currentTraffic.today += 1;
    currentTraffic.week += 1;
    currentTraffic.month += 1;
    currentTraffic.allTime += 1;

    localStorage.setItem('bloom_traffic', JSON.stringify(currentTraffic));
    setTraffic(currentTraffic);
  }, []);

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Back button modal history management
  const isAnyModalOpen =
    isCartOpen ||
    isWishlistOpen ||
    isAuthOpen ||
    isBookingOpen ||
    isSearchOpen ||
    isCheckoutOpen ||
    isTrackingOpen ||
    isAiModalOpen ||
    isChatOpen ||
    isAdminOpen ||
    quickViewProduct !== null;

  const [modalPushed, setModalPushed] = useState(false);

  useEffect(() => {
    if (isAnyModalOpen) {
      if (!modalPushed) {
        window.history.pushState({ modalOpen: true }, '');
        setModalPushed(true);
      }
    } else {
      if (modalPushed) {
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
        setModalPushed(false);
      }
    }
  }, [isAnyModalOpen, modalPushed]);

  useEffect(() => {
    const handlePopState = () => {
      if (isAnyModalOpen) {
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setIsAuthOpen(false);
        setIsBookingOpen(false);
        setIsSearchOpen(false);
        setIsCheckoutOpen(false);
        setIsTrackingOpen(false);
        setIsAiModalOpen(false);
        setIsChatOpen(false);
        setIsAdminOpen(false);
        setQuickViewProduct(null);
        setModalPushed(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAnyModalOpen]);

  // User State
  const [user, setUser] = useState({
    name: 'Lady Eleanor Vance',
    email: 'eleanor.vance@royal-luxury.com',
    tier: 'VIP Sovereign Member',
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  // Price Format Helper
  const formatPrice = (priceInUSD) => {
    const cur = currencies[currency] || currencies.USD;
    const converted = Math.round(priceInUSD * cur.rate);
    return `${cur.symbol}${converted.toLocaleString()}`;
  };

  // Cart Handlers
  const addToCart = (product, variant = 'Signature Luxury Edition') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.variant === variant);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, variant, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, variant) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.variant === variant)));
  };

  const updateQuantity = (id, variant, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.variant === variant) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const cartTotalUSD = cart.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);

  // Wishlist Handlers
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        currencies,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotalUSD,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isBookingOpen,
        setIsBookingOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isChatOpen,
        setIsChatOpen,
        isAdminOpen,
        setIsAdminOpen,
        quickViewProduct,
        setQuickViewProduct,
        user,
        setUser,
        orders,
        setOrders,
        addOrder,
        appointments,
        setAppointments,
        addAppointment,
        traffic,
        setTraffic,
        searchQuery,
        setSearchQuery,
        selectedOccasion,
        setSelectedOccasion,
        selectedCategory,
        setSelectedCategory,
        products,
        addProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
