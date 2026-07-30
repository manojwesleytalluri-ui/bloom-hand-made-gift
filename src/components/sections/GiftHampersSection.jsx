import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Sparkles, Award, ShoppingBag } from 'lucide-react';
import { assetPath } from '../../utils/assetPath';

export default function GiftHampersSection() {
  const { products, formatPrice, addToCart } = useApp();
  const hamperProducts = (products || []).filter(
    (p) => p.status !== 'Inactive' && p.category?.toLowerCase() === 'hampers'
  );

  return (
    <section className="py-24 relative bg-emerald-950/30 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>Grand Gifting Excellence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50">
            Premium <span className="text-gold-gradient italic">Luxury Gift</span> Hampers
          </h2>

          <p className="text-pearl-200/70 text-sm sm:text-base font-light">
            Curated combinations pairing rare Ecuadorian flowers with Dom Pérignon Vintage Champagne, gold-dusted Belgian truffles, crystal vases, and scented candles.
          </p>
        </div>

        {/* Hampers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 relative">
            <div className="glass-panel p-4 rounded-3xl border border-gold-500/40 shadow-gold-lg">
              <img
                src={assetPath('/assets/images/luxury_gift_hamper_1785003431109.png')}
                alt="Luxury Gift Hamper"
                className="w-full h-[420px] object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {hamperProducts.map((h) => (
              <div key={h.id} className="glass-panel p-6 rounded-3xl border border-gold-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-[10px] uppercase font-bold tracking-widest">
                    {h.badge}
                  </span>
                  <span className="text-xs text-pearl-300 font-serif">Includes Dom Pérignon</span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-pearl-50">{h.name}</h3>
                <p className="text-xs text-pearl-200/80 font-light leading-relaxed">{h.description}</p>

                <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-pearl-400 block uppercase tracking-wider">Complete VIP Box</span>
                    <span className="text-2xl font-serif font-bold text-gold-gradient">
                      {formatPrice(h.priceUSD)}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(h, 'Sovereign Hamper Chest')}
                    className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Acquire Hamper</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
