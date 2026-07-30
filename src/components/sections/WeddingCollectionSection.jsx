import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Sparkles, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function WeddingCollectionSection() {
  const { products, formatPrice, addToCart, setIsBookingOpen } = useApp();
  const weddingProducts = (products || []).filter(
    (p) => p.status !== 'Inactive' && p.category?.toLowerCase() === 'wedding'
  );

  return (
    <section id="occasions" className="py-24 relative overflow-hidden bg-emerald-950/20">
      {/* Background Glow */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text & Bespoke Wedding Quote */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-gold-500/30 text-gold-300 text-xs uppercase tracking-widest font-serif">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Couture Weddings</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50 leading-tight">
              Royal Bridal <span className="text-gold-gradient italic">Artistry & Aisle</span> Florals
            </h2>

            <p className="text-pearl-200/80 text-sm sm:text-base font-light leading-relaxed">
              Designed for luxury estate weddings, grand cathedral aisles, and destination galas in Monaco, Amalfi, and Lake Como. Handcrafted with rare French white peonies, cascading orchids, and 24K gold eucalyptus sprigs.
            </p>

            <ul className="space-y-3 text-xs text-pearl-200/90 font-sans">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>Private Consultation with Master Floral Architect</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>On-Site Temperature Controlled Installation Team</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>Custom Monogrammed Velvet Stem Wraps & Wax Seals</span>
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-8 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Wedding Consultation</span>
              </button>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {weddingProducts.map((product) => (
              <div
                key={product.id}
                className="glass-panel glass-card-hover rounded-3xl p-5 flex flex-col justify-between border border-gold-500/20"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4 bg-obsidian-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[10px] uppercase font-bold">
                    Bridal Edition
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-base text-pearl-50">{product.name}</h3>
                  <p className="text-xs text-pearl-200/70 font-light line-clamp-2">{product.tagline}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gold-500/20 flex items-center justify-between">
                  <span className="font-serif font-bold text-lg text-gold-gradient">
                    {formatPrice(product.priceUSD)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 'Bridal Deluxe Edition')}
                    className="px-5 py-2.5 rounded-full bg-gold-gradient text-obsidian-950 hover:scale-105 shadow-gold-sm text-xs font-serif font-bold uppercase transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4 text-obsidian-950" />
                    <span>Acquire</span>
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
