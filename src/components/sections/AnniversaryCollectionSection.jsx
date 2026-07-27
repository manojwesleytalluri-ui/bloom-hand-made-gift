import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Sparkles, Shield, Clock } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function AnniversaryCollectionSection() {
  const { products, formatPrice, addToCart } = useApp();
  const eternalProducts = products.filter((p) => p.category.toLowerCase() === 'anniversary' || p.occasion.toLowerCase() === 'anniversary');

  return (
    <section className="py-24 relative bg-obsidian-950/90 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Highlight */}
          <div className="lg:col-span-6 relative">
            <div className="glass-panel p-4 rounded-3xl border border-gold-500/40 relative shadow-gold-lg overflow-hidden group">
              <img
                src="/assets/images/eternal_rose_cloche_1785003145770.png"
                alt="Eternal Rose Cloche"
                className="w-full h-[320px] sm:h-[450px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 glass-panel p-4 sm:p-6 rounded-2xl border border-gold-500/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1.5 sm:gap-0">
                  <span className="text-[10px] sm:text-xs uppercase font-serif tracking-widest text-gold-400 font-bold">5-Year Preserved Craftsmanship</span>
                  <span className="text-[10px] sm:text-xs text-pearl-300">100% Genuine Ecuadorian</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-pearl-50">L’Éternel Cloche Edition</h3>
                <p className="text-xs text-pearl-200/80 font-light mt-1">Real Ecuadorian rose organic preservation under hand-blown Italian crystal.</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-serif uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
              <span>Timeless Romance & Passion</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50 leading-tight">
              Anniversary <span className="text-gold-gradient italic">Eternal Rose</span> Cloches & 100 Stems
            </h2>

            <p className="text-pearl-200/80 text-sm sm:text-base font-light leading-relaxed">
              Express undying devotion with eternal roses preserved to remain fresh for over half a decade. Accompanied by wax-sealed love letter calligraphy and private candlelight setup.
            </p>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="glass-panel p-4 rounded-2xl border border-gold-500/20">
                <Shield className="w-5 h-5 text-gold-400 mb-2" />
                <h4 className="font-serif font-bold text-sm text-pearl-50">5-Year Guarantee</h4>
                <p className="text-[11px] text-pearl-300/70 font-light mt-0.5">Zero watering or sunlight required.</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-gold-500/20">
                <Clock className="w-5 h-5 text-gold-400 mb-2" />
                <h4 className="font-serif font-bold text-sm text-pearl-50">Private Candlelight</h4>
                <p className="text-[11px] text-pearl-300/70 font-light mt-0.5">Complimentary rose petal setup available.</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {eternalProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-gold-500/20">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-pearl-50">{p.name}</h4>
                    <span className="text-xs text-gold-gradient font-bold">{formatPrice(p.priceUSD)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(p, 'Eternal Cloche Edition')}
                    className="px-5 py-2 rounded-full bg-gold-gradient text-obsidian-950 text-xs font-serif font-bold uppercase tracking-wider"
                  >
                    Acquire
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
