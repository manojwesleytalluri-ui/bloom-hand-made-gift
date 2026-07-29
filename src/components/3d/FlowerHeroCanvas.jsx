import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { assetPath } from '../../utils/assetPath';

// Single Static Luxury Featured Product
const FEATURED_PRODUCT = {
  id: 'bouq-7',
  name: 'Royal Eclipse Ecuadorian Gold Roses',
  tagline: 'Signature Bestseller Ecuadorian Blooms in Velvet wrap with Gold Accents',
  priceUSD: 450,
  image: assetPath('/assets/images/luxury_rose_bouquet_1785002544191.png'),
};

export default function FlowerHeroCanvas() {
  const { formatPrice, addToCart } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] relative rounded-3xl overflow-hidden border border-mutedGold-500/20 shadow-2xl flex flex-col justify-between p-6 sm:p-8 select-none"
      style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.10) 0%, rgba(10,10,15,0.97) 70%)' }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gold-400/5 blur-2xl" />
      </div>

      {/* Static Luxury Product Showcase Image */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center py-4">
        <div className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px] flex items-center justify-center">
          <img
            src={FEATURED_PRODUCT.image}
            alt={FEATURED_PRODUCT.name}
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.35)] select-none rounded-2xl"
            draggable="false"
            onError={(e) => { e.target.src = assetPath('/assets/images/sovereign_red_roses_1785005575575.png'); }}
          />
        </div>
      </div>

      {/* Product Details & Action */}
      <div className="relative z-10 w-full bg-obsidian-950/75 border border-mutedGold-500/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center shadow-lg gap-2">
        <div className="flex flex-col items-center max-w-md">
          <h3 className="font-serif text-base sm:text-lg font-bold text-gold-gradient tracking-wide mb-1 leading-snug">
            {FEATURED_PRODUCT.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-pearl-300/80 mb-3 font-light leading-relaxed">
            {FEATURED_PRODUCT.tagline}
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-4 pt-2 border-t border-mutedGold-500/10">
          <div className="text-left">
            <span className="block text-[8px] uppercase tracking-widest text-pearl-400 font-bold">Price</span>
            <span className="font-serif text-sm sm:text-base font-bold text-gold-400">
              {formatPrice ? formatPrice(FEATURED_PRODUCT.priceUSD) : `₹${FEATURED_PRODUCT.priceUSD}`}
            </span>
          </div>
          <button
            onClick={() => addToCart({
              id: FEATURED_PRODUCT.id,
              name: FEATURED_PRODUCT.name,
              priceUSD: FEATURED_PRODUCT.priceUSD,
              image: FEATURED_PRODUCT.image,
              category: 'Featured'
            })}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gold-gradient text-obsidian-950 hover:scale-105 active:scale-95 transition-all text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-gold-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-obsidian-950" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
