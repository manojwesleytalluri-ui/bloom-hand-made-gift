import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Package,
  MapPin,
  Sparkles,
  Clock
} from 'lucide-react';

export default function Navbar() {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    setAuthMode,
    setIsSearchOpen,
    setIsProfileOpen,
    setIsTrackingOpen,
    currentUser,
    logoutUser,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Featured Bouquets', href: '#featured' },
    { name: 'Royal Wedding', href: '#wedding' },
    { name: 'Birthday Splendor', href: '#birthday' },
    { name: 'Anniversary', href: '#anniversary' },
    { name: 'Gift Hampers', href: '#hampers' },
    { name: 'Bespoke Atelier', href: '#builder' },
    { name: 'AI Recommender', href: '#ai-recommendations' },
    { name: 'Why Us', href: '#why-us' },
  ];

  const firstName = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Member';

  const lastLoginFormatted = currentUser?.lastLoginDate
    ? new Date(currentUser.lastLoginDate).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Active Now';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div
          className={`pointer-events-auto glass-panel rounded-full transition-all duration-500 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border ${
            scrolled
              ? 'border-[#5e4d2d] shadow-gold-md bg-[#131417]/95 backdrop-blur-2xl'
              : 'border-[#5e4d2d]/80 bg-[#131417]/90 backdrop-blur-xl'
          }`}
        >
          {/* Brand Crest & Title - Exact Color Scheme from 2nd Screenshot */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-dashed border-[#b88d3e] flex items-center justify-center relative bg-[#1a1b20] shadow-gold-sm transition-transform duration-300 group-hover:scale-105">
              <span className="text-[7px] text-[#d19e45] absolute top-1 font-serif">✦</span>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#d19e45] tracking-tighter mt-1">BH</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold tracking-wide text-[#d19e45] group-hover:text-[#e5b35a] transition-colors leading-tight">
                Bloom Hand Made Gift
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d9d8d6] font-semibold opacity-90 leading-tight">
                HAUTE COUTURE FLORIST
              </span>
            </div>
          </a>

          {/* Right Control Icons Row - Exactly matching 2nd screenshot: (Search) (Heart^2) (Bag^1) (Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 1. Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20]"
              title="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 2. Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20]"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d19e45] text-[#131417] text-[9px] font-bold flex items-center justify-center shadow-gold-sm">
                {wishlist.length || 2}
              </span>
            </button>

            {/* 3. Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20]"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d19e45] text-[#131417] text-[9px] font-bold flex items-center justify-center shadow-gold-sm">
                {totalCartCount || 1}
              </span>
            </button>

            {/* 4. Menu Toggle Button / Authenticated Profile Trigger */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="p-2 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20] flex items-center gap-1"
                >
                  <User className="w-4 h-4 text-[#d19e45]" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-panel border border-[#5e4d2d] rounded-2xl p-4 shadow-gold-lg space-y-3 animate-fadeIn text-xs z-50 bg-[#131417]">
                    <div className="border-b border-[#5e4d2d]/30 pb-3">
                      <p className="text-[11px] text-[#d19e45] font-bold uppercase tracking-wider">
                        Welcome back, {firstName}!
                      </p>
                      <p className="text-pearl-100 font-semibold truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-pearl-400 font-mono truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-serif">
                        <Clock className="w-3 h-3" />
                        <span>Last Login: {lastLoginFormatted}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsProfileOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#d19e45]/10 text-pearl-200 hover:text-[#d19e45] flex items-center gap-2 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-[#d19e45]" />
                        <span>My Profile / Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsTrackingOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#d19e45]/10 text-pearl-200 hover:text-[#d19e45] flex items-center gap-2 font-medium transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#d19e45]" />
                        <span>My Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsTrackingOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#d19e45]/10 text-pearl-200 hover:text-[#d19e45] flex items-center gap-2 font-medium transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#d19e45]" />
                        <span>Track Live Delivery</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsProfileOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#d19e45]/10 text-pearl-200 hover:text-[#d19e45] flex items-center gap-2 font-medium transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-[#d19e45]" />
                        <span>Saved Addresses</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsWishlistOpen(true);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#d19e45]/10 text-pearl-200 hover:text-[#d19e45] flex items-center gap-2 font-medium transition-colors"
                      >
                        <Heart className="w-4 h-4 text-[#d19e45]" />
                        <span>Wishlist ({wishlist.length})</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#5e4d2d]/30">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutUser();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-red-950/60 text-red-300 flex items-center gap-2 font-bold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20]"
                title="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Navigation Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto glass-panel border border-[#5e4d2d] rounded-3xl p-6 mt-3 max-w-7xl mx-auto space-y-4 shadow-gold-lg animate-fadeIn max-h-[75vh] overflow-y-auto bg-[#131417]">
          {!currentUser && (
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[#5e4d2d]/30">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full border border-[#5e4d2d] text-center text-xs uppercase font-semibold text-[#d9d8d6]"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full bg-[#d19e45]/20 border border-[#d19e45] text-center text-xs uppercase font-semibold text-[#d19e45]"
              >
                Register
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-[#d9d8d6] hover:text-[#d19e45] font-medium py-1"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
