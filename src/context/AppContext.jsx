import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { assetPath } from '../utils/assetPath';

const AppContext = createContext();

export const currencies = {
  USD: { symbol: '$', rate: 1, code: 'USD' },
  INR: { symbol: '₹', rate: 83, code: 'INR' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
};

export const AppProvider = ({ children }) => {
  // Persistent Products Database with Real-Time Cross-Tab Broadcast Synchronization
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bloom_live_products_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return PRODUCTS;
  });

  // Sync products database and broadcast across all active browser windows & tabs
  const syncProductsToStorage = (updatedProducts, eventPayload) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem('bloom_live_products_db', JSON.stringify(updatedProducts));
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel('bloom_product_sync_channel');
        channel.postMessage({ type: 'PRODUCTS_UPDATED', timestamp: Date.now(), ...eventPayload });
        channel.close();
      }
    } catch (e) {}
  };

  // Add New Product
  const addProduct = (newProduct) => {
    const formatted = {
      ...newProduct,
      sku: newProduct.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [formatted, ...products];
    syncProductsToStorage(updated, { action: 'ADD', productId: formatted.id });
  };

  // Update / Edit Existing Product
  const updateProduct = (productId, updatedFields) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() } : p
    );
    syncProductsToStorage(updated, { action: 'UPDATE', productId });

    // Instantly sync cart items matching this product ID
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              name: updatedFields.name || item.name,
              priceUSD: updatedFields.priceUSD !== undefined ? updatedFields.priceUSD : item.priceUSD,
              image: updatedFields.image || item.image
            }
          : item
      )
    );
  };

  // Delete Product
  const deleteProduct = (productId) => {
    const updated = products.filter((p) => p.id !== productId);
    syncProductsToStorage(updated, { action: 'DELETE', productId });

    // Instantly remove deleted product from cart and wishlist across active sessions
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== productId));
  };

  // Cross-tab real-time listener for multi-window synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === 'bloom_live_products_db' && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          if (Array.isArray(fresh)) setProducts(fresh);
        } catch (err) {}
      }
    };

    let channel = null;
    if (window.BroadcastChannel) {
      channel = new BroadcastChannel('bloom_product_sync_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'PRODUCTS_UPDATED') {
          const saved = localStorage.getItem('bloom_live_products_db');
          if (saved) {
            try {
              const fresh = JSON.parse(saved);
              if (Array.isArray(fresh)) setProducts(fresh);
            } catch (err) {}
          }
        }
      };
    }

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  // Theme State
  const [theme, setTheme] = useState('dark');

  // Currency State
  const [currency, setCurrency] = useState('INR'); // Default to ₹ for Indian luxury market

  // Persistent Authentication State & User Session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bloom_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });

  const isAuthenticated = !!currentUser;

  // Cart State (Clean empty session for new visitors; loaded per user when logged in)
  const [cart, setCart] = useState(() => {
    const savedSession = localStorage.getItem('bloom_auth_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        const userCart = localStorage.getItem(`bloom_cart_${user.email}`);
        if (userCart) return JSON.parse(userCart);
      } catch (e) {}
    }
    return [];
  });

  // Wishlist State (Clean empty session for new visitors; loaded per user when logged in)
  const [wishlist, setWishlist] = useState(() => {
    const savedSession = localStorage.getItem('bloom_auth_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        const userWishlist = localStorage.getItem(`bloom_wishlist_${user.email}`);
        if (userWishlist) return JSON.parse(userWishlist);
      } catch (e) {}
    }
    return [];
  });

  // Saved Shipping Address State (Starts completely empty)
  const [activeCheckoutAddress, setActiveCheckoutAddress] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    houseNo: '',
    street: '',
    locality: '',
    landmark: '',
    pinCode: '',
    city: '',
    state: '',
    country: 'India',
    deliveryInstructions: ''
  });

  // Persistent Orders State (Only 100% Verified Paid Orders stored for current user)
  const [orders, setOrders] = useState(() => {
    const savedSession = localStorage.getItem('bloom_auth_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        const userOrders = localStorage.getItem(`bloom_orders_${user.email}`);
        if (userOrders) {
          const parsed = JSON.parse(userOrders);
          return parsed.filter(ord => ord.id !== 'BLM-889421' && ord.paymentId && ord.paymentId !== 'UNCONFIRMED');
        }
      } catch (e) {}
    }
    return [];
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  // Sync Cart, Wishlist, and Orders per User Account
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`bloom_cart_${currentUser.email}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`bloom_wishlist_${currentUser.email}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`bloom_orders_${currentUser.email}`, JSON.stringify(orders));
    }
  }, [orders, currentUser]);

  const addOrder = (newOrder) => {
    // SECURITY CHECK: Strictly prohibit placing order if payment is not confirmed
    if (!newOrder || !newOrder.paymentId || newOrder.paymentId === 'UNCONFIRMED' || !newOrder.status?.includes('Confirmed')) {
      console.error('⚠️ REJECTED ORDER PLACEMENT: Payment was not confirmed!', newOrder);
      return false;
    }
    const orderWithUser = {
      ...newOrder,
      userEmail: currentUser?.email || newOrder.userEmail
    };
    setOrders((prev) => [orderWithUser, ...prev]);
    setActiveTrackingOrder(orderWithUser);
    return true;
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser?.email) {
      localStorage.removeItem(`bloom_cart_${currentUser.email}`);
    }
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Pending Protected Action State (for resuming action post login)
  const [pendingAction, setPendingAction] = useState(null);

  // Execute pending action after login/registration
  const executePendingAction = () => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);

    if (action.type === 'ADD_TO_CART' && action.product) {
      addToCart(action.product, action.variant || 'Signature Luxury Edition');
    } else if (action.type === 'OPEN_CHECKOUT') {
      setIsCheckoutOpen(true);
    } else if (action.type === 'TRACK_ORDER') {
      setIsTrackingOpen(true);
    } else if (action.type === 'OPEN_BOOKING') {
      setIsBookingOpen(true);
    }
  };

  // Back button modal history management
  const isAnyModalOpen =
    isCartOpen ||
    isWishlistOpen ||
    isAuthOpen ||
    isBookingOpen ||
    isSearchOpen ||
    isCheckoutOpen ||
    isTrackingOpen ||
    isProfileOpen ||
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
        setIsProfileOpen(false);
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

  // Registered Users Database in LocalStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('bloom_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'usr_demo_1',
        fullName: 'Manoj Kumar',
        email: 'manoj@bloom.com',
        mobileNumber: '9876543210',
        passwordHash: 'bWVtYmVyMTIz', // Base64 hash of 'member123'
        tier: 'VIP Sovereign Member',
        currentLoginDate: new Date().toISOString(),
        lastLoginDate: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bloom_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Register User Handler
  const registerUser = ({ fullName, mobileNumber, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobileNumber.trim();

    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.mobileNumber === cleanMobile
    );

    if (existing) {
      return {
        success: false,
        message: 'An account with this email address or mobile number already exists.'
      };
    }

    const now = new Date().toISOString();
    const newUser = {
      id: `usr_${Date.now()}`,
      fullName,
      email: cleanEmail,
      mobileNumber: cleanMobile,
      passwordHash: btoa(password),
      tier: 'VIP Sovereign Member',
      createdAt: now,
      currentLoginDate: now,
      lastLoginDate: null
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    return { success: true };
  };

  // Login User Handler
  const loginUser = (emailOrMobile, password) => {
    const cleanInput = emailOrMobile.trim().toLowerCase();
    const hash = btoa(password);

    const userMatch = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === cleanInput || u.mobileNumber === cleanInput) &&
        u.passwordHash === hash
    );

    if (userMatch) {
      const now = new Date().toISOString();
      const lastLogin = userMatch.currentLoginDate || new Date(Date.now() - 86400000).toISOString();

      const sessionUser = {
        id: userMatch.id,
        fullName: userMatch.fullName,
        email: userMatch.email,
        mobileNumber: userMatch.mobileNumber,
        tier: userMatch.tier || 'VIP Sovereign Member',
        currentLoginDate: now,
        lastLoginDate: lastLogin
      };

      // Update user login timestamp in registered database
      setRegisteredUsers((prev) =>
        prev.map((u) =>
          u.id === userMatch.id
            ? { ...u, lastLoginDate: u.currentLoginDate || lastLogin, currentLoginDate: now }
            : u
        )
      );

      setCurrentUser(sessionUser);
      localStorage.setItem('bloom_auth_session', JSON.stringify(sessionUser));

      // Load user isolated data & merge guest wishlist seamlessly
      try {
        const guestWishlistRaw = localStorage.getItem('bloom_guest_wishlist');
        const guestWishlist = guestWishlistRaw ? JSON.parse(guestWishlistRaw) : [];

        const userWishlistRaw = localStorage.getItem(`bloom_wishlist_${sessionUser.email}`);
        const userWishlist = userWishlistRaw ? JSON.parse(userWishlistRaw) : [];

        // Merge without duplicates
        const mergedWishlist = Array.from(new Set([...userWishlist, ...guestWishlist]));
        setWishlist(mergedWishlist);
        localStorage.setItem(`bloom_wishlist_${sessionUser.email}`, JSON.stringify(mergedWishlist));
        localStorage.removeItem('bloom_guest_wishlist');

        const userCart = localStorage.getItem(`bloom_cart_${sessionUser.email}`);
        setCart(userCart ? JSON.parse(userCart) : []);

        const userOrders = localStorage.getItem(`bloom_orders_${sessionUser.email}`);
        if (userOrders) {
          const parsed = JSON.parse(userOrders);
          setOrders(parsed.filter(ord => ord.id !== 'BLM-889421' && ord.paymentId && ord.paymentId !== 'UNCONFIRMED'));
        } else {
          setOrders([]);
        }
      } catch (e) {}

      return { success: true };
    }

    return { success: false, message: 'Invalid email or password.' };
  };

  // Logout Handler (Strictly clears session data & returns to clean guest mode)
  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setActiveCheckoutAddress({
      fullName: '',
      mobileNumber: '',
      email: '',
      houseNo: '',
      street: '',
      locality: '',
      landmark: '',
      pinCode: '',
      city: '',
      state: '',
      country: 'India',
      deliveryInstructions: ''
    });
    localStorage.removeItem('bloom_auth_session');
  };

  // User State (backed by auth session)
  const user = currentUser || {
    fullName: 'Guest Visitor',
    email: '',
    tier: 'Guest'
  };

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
  const formatPrice = (priceVal) => {
    const value = Math.round(parseFloat(priceVal) || 0);
    return `₹${value.toLocaleString('en-IN')}`;
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

  // Wishlist Handlers with Deduplication & Guest Storage Support
  const toggleWishlist = (productOrId) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId?.id;
    if (!id) return;

    setWishlist((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : Array.from(new Set([...prev, id]));
      
      const storageKey = currentUser?.email ? `bloom_wishlist_${currentUser.email}` : 'bloom_guest_wishlist';
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });
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
        clearCart,
        cartTotalUSD,
        wishlist,
        toggleWishlist,
        activeCheckoutAddress,
        setActiveCheckoutAddress,
        activeTrackingOrder,
        setActiveTrackingOrder,
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
        isProfileOpen,
        setIsProfileOpen,
        pendingAction,
        setPendingAction,
        executePendingAction,
        isAiModalOpen,
        setIsAiModalOpen,
        isChatOpen,
        setIsChatOpen,
        isAdminOpen,
        setIsAdminOpen,
        quickViewProduct,
        setQuickViewProduct,
        user,
        setUser: setCurrentUser,
        currentUser,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
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
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
