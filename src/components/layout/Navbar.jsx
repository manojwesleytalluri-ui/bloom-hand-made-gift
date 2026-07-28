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
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div
          className={`pointer-events-auto rounded-full transition-all duration-500 px-2.5 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between border shadow-2xl ${
            scrolled
              ? 'border-[#5e4d2d] bg-[#131417] backdrop-blur-2xl'
              : 'border-[#5e4d2d]/90 bg-[#131417]/95 backdrop-blur-xl'
          }`}
          style={{ backgroundColor: '#131417', borderColor: '#5e4d2d' }}
        >
          {/* Brand Crest & Title - Compact Sizing to prevent collision on phone ratio */}
          <a href="#" className="flex items-center gap-1.5 sm:gap-3 group shrink min-w-0 pr-1">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-dashed border-[#b88d3e] flex items-center justify-center relative bg-[#1a1b20] shadow-gold-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
              <span className="text-[5px] sm:text-[7px] text-[#d19e45] absolute top-0.5 sm:top-1 font-serif">✦</span>
              <span className="font-serif font-bold text-[9px] sm:text-xs sm:text-sm text-[#d19e45] tracking-tighter mt-0.5 sm:mt-1">BH</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[10px] min-[360px]:text-[11px] sm:text-base font-bold tracking-wide text-[#d19e45] group-hover:text-[#e5b35a] transition-colors leading-tight truncate">
                Bloom Hand Made Gift
              </span>
              <span className="text-[6px] min-[360px]:text-[7px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.25em] text-[#d9d8d6] font-semibold opacity-90 leading-tight truncate">
                HAUTE COUTURE FLORIST
              </span>
            </div>
          </a>

          {/* Right Control Icons Row - Exactly aligned on both Phone & Laptop */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            
            {/* 1. Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20] flex items-center justify-center"
              style={{ backgroundColor: '#1a1b20', borderColor: '#5e4d2d' }}
              title="Search Catalog"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d9d8d6]" />
            </button>

            {/* 2. Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20] flex items-center justify-center"
              style={{ backgroundColor: '#1a1b20', borderColor: '#5e4d2d' }}
              title="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d9d8d6]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#d19e45] text-[#131417] text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-gold-sm">
                {wishlist.length || 2}
              </span>
            </button>

            {/* 3. Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20] flex items-center justify-center"
              style={{ backgroundColor: '#1a1b20', borderColor: '#5e4d2d' }}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d9d8d6]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#d19e45] text-[#131417] text-[8px] sm:text-[9px] font-bold flex items-center justify-center shadow-gold-sm">
                {totalCartCount || 1}
              </span>
            </button>

            {/* 4. User Profile / Account Trigger Icon (👤) - Matches laptop behavior */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="p-1.5 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20] flex items-center justify-center"
                  style={{ backgroundColor: '#1a1b20', borderColor: '#5e4d2d' }}
                  title="My Account"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d19e45]" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 sm:w-64 border border-[#5e4d2d] rounded-2xl p-4 shadow-2xl space-y-3 animate-fadeIn text-xs z-50 bg-[#131417]">
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
                className="p-1.5 sm:p-2.5 rounded-full border border-[#5e4d2d] text-[#d9d8d6] hover:text-[#d19e45] hover:border-[#d19e45] transition-all bg-[#1a1b20]"
                style={{ backgroundColor: '#1a1b20', borderColor: '#5e4d2d' }}
                title="Account / Menu"
              >
                {mobileMenuOpen ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d9d8d6]" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d9d8d6]" />}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Navigation Drawer Menu for Mobile */}
      {mobileMenuOpen && (
        <div
          className="pointer-events-auto border border-[#5e4d2d] rounded-3xl p-5 mt-2.5 max-w-7xl mx-3 sm:mx-auto space-y-4 shadow-2xl animate-fadeIn max-h-[75vh] overflow-y-auto bg-[#131417]"
          style={{ backgroundColor: '#131417', borderColor: '#5e4d2d' }}
        >
          {!currentUser && (
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#5e4d2d]/30">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-full border border-[#5e4d2d] text-center text-xs uppercase font-semibold text-[#d9d8d6]"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-full bg-[#d19e45]/20 border border-[#d19e45] text-center text-xs uppercase font-semibold text-[#d19e45]"
              >
                Register
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-2.5 pt-1">
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
