import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Sparkles, ShoppingBag, Star } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function BirthdayCollectionSection() {
  const { products, formatPrice, addToCart } = useApp();
  const birthdayProducts = products.filter((p) => p.category.toLowerCase() === 'birthday' || p.occasion.toLowerCase() === 'birthday');

  return (
    <section className="py-24 relative bg-obsidian-950/80 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
              <Gift className="w-3.5 h-3.5" />
              <span>Celebration & Jubilation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pearl-50">
              The <span className="text-gold-gradient italic">Birthday Sovereign</span> Collection
            </h2>
            <p className="text-pearl-200/70 text-sm font-light">
              Vibrant high-altitude Dutch tulips, velvet box arrangements, champagne pairings, and custom wax-sealed birthday greeting notes.
            </p>
          </div>
          <a
            href="#builder"
            className="self-start md:self-auto px-6 py-3 rounded-full border border-gold-500/40 text-gold-300 hover:bg-gold-500/20 text-xs font-serif font-bold uppercase tracking-wider transition-all"
          >
            Build Custom Birthday Box →
          </a>
        </div>

        {/* Birthday Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {birthdayProducts.map((product) => (
            <div
              key={product.id}
              className="glass-panel glass-card-hover rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border border-gold-500/20"
            >
              <div className="sm:col-span-5 h-56 rounded-2xl overflow-hidden bg-obsidian-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="sm:col-span-7 space-y-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-pearl-400">({product.reviewsCount} VIP reviews)</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-pearl-50">{product.name}</h3>
                  <p className="text-xs text-pearl-200/70 font-light mt-2">{product.tagline}</p>
                </div>

                <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between">
                  <span className="font-serif font-bold text-xl text-gold-gradient">
                    {formatPrice(product.priceUSD)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 'Birthday Velvet Gift Box')}
                    className="px-5 py-2.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Acquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
