import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Sun,
  Moon,
  Calendar,
  Sparkles,
  Menu,
  X,
  Globe,
  User
} from 'lucide-react';

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    currency,
    setCurrency,
    currencies,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    setAuthMode,
    setIsBookingOpen,
    setIsSearchOpen,
    setIsAdminOpen,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Collections', href: '#collections' },
    { name: 'Occasions', href: '#occasions' },
    { name: 'Custom Atelier', href: '#builder' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-3 px-3 sm:px-6 max-w-7xl mx-auto pointer-events-none">
      <div
        className={`pointer-events-auto rounded-full transition-all duration-500 border ${
          scrolled
            ? 'bg-charcoal-950/90 backdrop-blur-2xl border-mutedGold-500/40 py-2 px-5 shadow-gold-lg'
            : 'bg-charcoal-950/80 backdrop-blur-xl border-mutedGold-500/25 py-2.5 px-6 shadow-gold-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <a href="#home" className="flex items-center gap-3.5 shrink-0 group">
            <div className="relative w-11 h-11 flex items-center justify-center transition-all duration-700 group-hover:scale-105">
              {/* Spinning/glowing light ring in the background on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mutedGold-500 to-mutedGold-700 opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-700 animate-pulse" />
              
              {/* Outer SVG Crest Logo */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dashed Gold Circular Orbit Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="url(#bhGoldGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  className="origin-center group-hover:rotate-180 transition-transform duration-10000 ease-linear"
                />
                
                {/* Thin Inner Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="url(#bhBurgundyGradient)"
                  strokeWidth="1"
                />
                
                {/* Royal Leaf Crest / Crown Motif */}
                <path
                  d="M50 20C47.5 24 41 24 41 24C41 24 47.5 26 50 30C52.5 26 59 24 59 24C59 24 52.5 24 50 20Z"
                  fill="url(#bhGoldGradient)"
                />
                
                {/* Monogram letters */}
                <text
                  x="50"
                  y="62"
                  fontFamily="'Cormorant Garamond', Georgia, serif"
                  fontSize="28"
                  fontWeight="bold"
                  fill="url(#bhGoldGradient)"
                  textAnchor="middle"
                  letterSpacing="-0.5"
                >
                  BH
                </text>
                
                <defs>
                  {/* Gold Gradient */}
                  <linearGradient id="bhGoldGradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="var(--logo-gold-1)" />
                    <stop offset="50%" stopColor="var(--logo-gold-2)" />
                    <stop offset="100%" stopColor="var(--logo-gold-3)" />
                  </linearGradient>
                  
                  {/* Burgundy Gradient */}
                  <linearGradient id="bhBurgundyGradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="var(--logo-burgundy-1)" />
                    <stop offset="100%" stopColor="var(--logo-burgundy-2)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm sm:text-base font-bold tracking-wide text-gold-gradient whitespace-nowrap leading-none">
                Bloom Hand Made Gift
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-mutedGold-400 font-medium mt-1 leading-none">
                Haute Couture Florist
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-widest text-ivory-200/90 hover:text-mutedGold-400 font-medium transition-colors whitespace-nowrap relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-mutedGold-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            
            {/* Currency Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[11px] text-ivory-200/80 hover:text-mutedGold-400 px-2.5 py-1 rounded-full border border-mutedGold-500/20 hover:border-mutedGold-500/40 transition-colors">
                <Globe className="w-3.5 h-3.5 text-mutedGold-400" />
                <span>{currency}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-28 py-2 bg-charcoal-900 border border-mutedGold-500/30 rounded-2xl shadow-glass-card opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                {Object.keys(currencies).map((code) => (
                  <button
                    key={code}
                    onClick={() => setCurrency(code)}
                    className={`w-full text-left px-3 py-1 text-[11px] transition-colors ${
                      currency === code ? 'text-mutedGold-400 font-bold bg-mutedGold-500/10' : 'text-ivory-200 hover:text-mutedGold-300'
                    }`}
                  >
                    {code} ({currencies[code].symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-mutedGold-500/20 text-ivory-200 hover:text-mutedGold-400 hover:border-mutedGold-500/40 transition-all"
              title="Toggle Luxury Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-mutedGold-400" /> : <Moon className="w-3.5 h-3.5 text-emerald-700" />}
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full border border-mutedGold-500/20 text-ivory-200 hover:text-mutedGold-400 hover:border-mutedGold-500/40 transition-all"
              title="Search Catalog"
            >
              <Search className="w-3.5 h-3.5 text-mutedGold-400" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 rounded-full border border-mutedGold-500/20 text-ivory-200 hover:text-mutedGold-400 hover:border-mutedGold-500/40 transition-all"
              title="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 text-mutedGold-400" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mutedGold-500 text-charcoal-950 text-[9px] font-bold flex items-center justify-center shadow-gold-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full border border-mutedGold-500/20 text-ivory-200 hover:text-mutedGold-400 hover:border-mutedGold-500/40 transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-mutedGold-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-pearl-50 text-[9px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Login & Register Buttons */}
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full border border-mutedGold-500/30 text-ivory-100 hover:text-mutedGold-400 hover:border-mutedGold-500/60 text-[11px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap"
            >
              Login
            </button>
 
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-charcoal-800 border border-mutedGold-500/40 text-mutedGold-300 hover:bg-mutedGold-500/20 text-[11px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap"
            >
              Register
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 text-[11px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap flex items-center gap-1"
              title="Open VIP Admin Portal"
            >
              <span>👑 Admin</span>
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="glow-gold-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-mutedGold-gradient text-charcoal-950 font-serif font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 shadow-gold-sm transition-all animate-pulse-slow whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-charcoal-950" />
              <span>Book Now</span>
            </button>

          </div>

          {/* Mobile & Tablet Trigger */}
          <div className="flex 2xl:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full border border-gold-500/30 text-gold-400"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-obsidian-950 text-[9px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full border border-gold-500/30 text-gold-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Mid-Screen Menu Drawer */}
      {mobileMenuOpen && (
        <div className="2xl:hidden pointer-events-auto glass-panel border border-gold-500/40 rounded-3xl p-6 mt-3 space-y-4 shadow-gold-lg animate-fadeIn">
          
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gold-500/20">
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-full border border-gold-500/40 text-center text-xs uppercase font-semibold text-pearl-100"
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-gold-500/20 border border-gold-500 text-center text-xs uppercase font-semibold text-gold-300"
            >
              Register
            </button>
          </div>

          <button
            onClick={() => {
              setIsBookingOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest text-center shadow-gold-sm"
          >
            ✨ Book VIP Consultation Now
          </button>

          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-pearl-200 hover:text-gold-400 font-medium py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between text-xs">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-pearl-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-pearl-400">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-obsidian-900 border border-gold-500/30 text-gold-400 text-xs rounded-lg px-2 py-1"
              >
                {Object.keys(currencies).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
