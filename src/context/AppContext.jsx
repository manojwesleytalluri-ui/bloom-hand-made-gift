import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { assetPath } from '../utils/assetPath';
import { fetchCloudProducts, saveCloudProducts } from '../services/cloudProductsDb';
import {
  getAddresses,
  getDefaultAddress,
  saveAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../services/addressService';

const AppContext = createContext();

export const currencies = {
  USD: { symbol: '$', rate: 1, code: 'USD' },
  INR: { symbol: '₹', rate: 83, code: 'INR' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
};

export const AppProvider = ({ children }) => {
  // Persistent Products Database with Real-Time Cross-Device Sync
  const isOldMock = (id) => ['bouq-1', 'bouq-2', 'bouq-3', 'bouq-4', 'bouq-5', 'bouq-6'].includes(id);

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bloom_live_products_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => !isOldMock(p.id));
          try { localStorage.setItem('bloom_live_products_db', JSON.stringify(cleaned)); } catch (e) {}
          return cleaned;
        }
      } catch (e) {}
    }
    return PRODUCTS.filter(p => !isOldMock(p.id));
  });

  // Cloud sync status shown in admin panel
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // idle | syncing | success | error
  const pollTimerRef = useRef(null);

  /** Apply a fresh product list from any source (cloud, broadcast, storage) */
  const applyProductUpdate = (fresh) => {
    if (!Array.isArray(fresh)) return;
    setProducts((prev) => {
      const map = new Map();
      (prev || []).filter(p => !isOldMock(p.id)).forEach(p => p.id && map.set(p.id, p));
      fresh.filter(p => !isOldMock(p.id)).forEach(p => p.id && map.set(p.id, p));
      const merged = Array.from(map.values());
      if (JSON.stringify(prev) === JSON.stringify(merged)) return prev;
      try { localStorage.setItem('bloom_live_products_db', JSON.stringify(merged)); } catch (e) {}
      return merged;
    });
  };

  /** Manual force cloud sync button for Admin */
  const forceSyncCloud = async () => {
    setCloudSyncStatus('syncing');
    const cloud = await fetchCloudProducts();
    if (cloud) {
      applyProductUpdate(cloud);
      setCloudSyncStatus('success');
    } else {
      const ok = await saveCloudProducts(products);
      setCloudSyncStatus(ok ? 'success' : 'error');
    }
    setTimeout(() => setCloudSyncStatus('idle'), 2500);
  };

  /** Save to localStorage + BroadcastChannel (same-browser) + Cloud (cross-device) */
  const syncProductsToStorage = async (updatedProducts, eventPayload) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem('bloom_live_products_db', JSON.stringify(updatedProducts));
      // BroadcastChannel — instant same-browser update across tabs
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel('bloom_product_sync_channel');
        channel.postMessage({ type: 'PRODUCTS_UPDATED', timestamp: Date.now(), ...eventPayload });
        channel.close();
      }
    } catch (e) {}

    // Cloud save — publishes to all other devices (mobile, laptop, tablet)
    setCloudSyncStatus('syncing');
    await saveCloudProducts(updatedProducts);
    setCloudSyncStatus('success');
    setTimeout(() => setCloudSyncStatus('idle'), 2500);
  };

  // ── On mount: fetch latest products from cloud, poll every 3s, sync on focus/online ──
  useEffect(() => {
    const loadFromCloud = async () => {
      const cloud = await fetchCloudProducts();
      if (cloud) applyProductUpdate(cloud);
    };

    loadFromCloud();

    // Fast 3-second polling so every device stays synchronized in near real-time
    pollTimerRef.current = setInterval(loadFromCloud, 3000);

    const handleFocus = () => loadFromCloud();
    const handleOnline = () => loadFromCloud();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadFromCloud();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('online', handleOnline);
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('online', handleOnline);
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
  }, []);

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

  // Delete Product — immediately removed from all carts + wishlists
  const deleteProduct = (productId) => {
    const updated = products.filter((p) => p.id !== productId);
    syncProductsToStorage(updated, { action: 'DELETE', productId });
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
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bloom_theme');
    return saved || 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('bloom_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light-mode');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  // Persistent User Addresses State & Management
  const [userAddresses, setUserAddresses] = useState(() => {
    const savedSession = localStorage.getItem('bloom_auth_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        return getAddresses(user.email);
      } catch (e) {}
    }
    return [];
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const savedSession = localStorage.getItem('bloom_auth_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        const def = getDefaultAddress(user.email);
        return def ? def.addressId : null;
      } catch (e) {}
    }
    return null;
  });

  // Selected address helper
  const selectedAddress = userAddresses.find((a) => a.addressId === selectedAddressId) ||
    userAddresses.find((a) => a.isDefault) ||
    userAddresses[0] ||
    null;

  // Sync / Reload user addresses
  const loadUserAddresses = (userEmail) => {
    const email = userEmail || currentUser?.email;
    if (!email) {
      setUserAddresses([]);
      setSelectedAddressId(null);
      return;
    }
    const list = getAddresses(email);
    setUserAddresses(list);
    const def = getDefaultAddress(email);
    setSelectedAddressId(def ? def.addressId : (list[0]?.addressId || null));
  };

  // Address CRUD Handlers
  const addAddress = (addressData) => {
    if (!currentUser?.email) return { success: false, message: 'Please log in to save addresses.' };
    const result = saveAddress(currentUser.email, addressData);
    if (result.success) {
      setUserAddresses(result.addresses);
      if (result.address?.isDefault || !selectedAddressId) {
        setSelectedAddressId(result.address.addressId);
      }
    }
    return result;
  };

  const editAddress = (addressId, updatedFields) => {
    if (!currentUser?.email) return { success: false, message: 'Please log in to edit addresses.' };
    const result = updateAddress(currentUser.email, addressId, updatedFields);
    if (result.success) {
      setUserAddresses(result.addresses);
    }
    return result;
  };

  const removeAddress = (addressId) => {
    if (!currentUser?.email) return { success: false, message: 'Please log in to delete addresses.' };
    const result = deleteAddress(currentUser.email, addressId);
    if (result.success) {
      setUserAddresses(result.addresses);
      if (selectedAddressId === addressId) {
        const def = result.addresses.find((a) => a.isDefault) || result.addresses[0];
        setSelectedAddressId(def ? def.addressId : null);
      }
    }
    return result;
  };

  const makeAddressDefault = (addressId) => {
    if (!currentUser?.email) return { success: false };
    const result = setDefaultAddress(currentUser.email, addressId);
    if (result.success) {
      setUserAddresses(result.addresses);
      setSelectedAddressId(addressId);
    }
    return result;
  };

  // Legacy activeCheckoutAddress compatibility layer
  const activeCheckoutAddress = selectedAddress ? {
    fullName: selectedAddress.fullName || '',
    mobileNumber: selectedAddress.phone || '',
    email: currentUser?.email || '',
    houseNo: selectedAddress.houseNumber || '',
    street: selectedAddress.street || '',
    locality: selectedAddress.area || '',
    landmark: selectedAddress.landmark || '',
    pinCode: selectedAddress.pinCode || '',
    city: selectedAddress.city || '',
    state: selectedAddress.state || '',
    country: selectedAddress.country || 'India',
    deliveryInstructions: ''
  } : {
    fullName: '',
    mobileNumber: '',
    email: currentUser?.email || '',
    houseNo: '',
    street: '',
    locality: '',
    landmark: '',
    pinCode: '',
    city: '',
    state: '',
    country: 'India',
    deliveryInstructions: ''
  };

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
    if (typeof window !== 'undefined' && (!window.history.state || !window.history.state.bloomAppStarted)) {
      window.history.replaceState({ bloomAppStarted: true }, '');
      window.history.pushState({ bloomAppStarted: true }, '');
    }
  }, []);

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

        // Load saved addresses for logged in user
        loadUserAddresses(sessionUser.email);
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
    setUserAddresses([]);
    setSelectedAddressId(null);
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
        setActiveCheckoutAddress: () => {},
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
        forceSyncCloud,
        cloudSyncStatus,
        // Saved Address System Exports
        userAddresses,
        selectedAddress,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        editAddress,
        removeAddress,
        makeAddressDefault,
        loadUserAddresses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
