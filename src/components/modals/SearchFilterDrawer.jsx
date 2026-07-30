import React from 'react';
import { useApp } from '../../context/AppContext';
import { assetPath } from '../../utils/assetPath';
import { X, Search, Filter, ShoppingBag } from 'lucide-react';

export default function SearchFilterDrawer() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    formatPrice,
    addToCart,
    products,
    setQuickViewProduct
  } = useApp();

  if (!isSearchOpen) return null;

  const filtered = (products || []).filter((p) => {
    if (p.status === 'Inactive') return false;
    const matchesQuery = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/85 backdrop-blur-xl animate-fadeIn p-4 sm:p-8 flex justify-center">
      <div className="max-w-3xl w-full glass-panel border border-gold-500/40 rounded-3xl p-6 flex flex-col space-y-6 relative shadow-gold-lg max-h-[90vh]">
        
        {/* Top Search Bar Input */}
        <div className="flex items-center justify-between gap-4 border-b border-gold-500/20 pb-4">
          <div className="flex-1 flex items-center gap-3 bg-obsidian-900 border border-gold-500/30 rounded-full px-5 py-3">
            <Search className="w-5 h-5 text-gold-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by flower type, occasion, or velvet box..."
              className="w-full bg-transparent text-pearl-100 placeholder-pearl-400 outline-none text-sm"
            />
          </div>
          <button onClick={() => setIsSearchOpen(false)} className="p-2 text-pearl-300 hover:text-gold-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['All', 'Featured', 'Wedding', 'Birthday', 'Anniversary', 'Hampers'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-900 border border-gold-500/20 text-pearl-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-pearl-300 text-sm">No luxury arrangements matched your search query.</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 flex items-center justify-between gap-4 hover:border-gold-500/40 transition-colors">
                <img
                  src={p.image || assetPath('/assets/images/sovereign_red_roses_1785005575575.png')}
                  alt={p.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = assetPath('/assets/images/sovereign_red_roses_1785005575575.png');
                  }}
                  className="w-16 h-16 object-cover rounded-xl border border-gold-500/20 cursor-pointer shrink-0"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setQuickViewProduct(p);
                  }}
                />
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setQuickViewProduct(p);
                  }}
                >
                  <h4 className="font-serif font-bold text-sm text-pearl-50 hover:text-[#d19e45] transition-colors">{p.name}</h4>
                  <p className="text-xs text-pearl-300/70 line-clamp-1">{p.tagline}</p>
                  <span className="font-serif font-bold text-xs text-gold-gradient">{formatPrice(p.priceUSD)}</span>
                </div>
                <button
                  onClick={() => {
                    addToCart(p);
                    setIsSearchOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
