import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { assetPath } from '../../utils/assetPath';

// Carousel Items
const CAROUSEL_ITEMS = [
  {
    id: 'bouq-7',
    name: 'Royal Eclipse Ecuadorian Gold Roses',
    tagline: 'Signature Bestseller Ecuadorian Blooms in Velvet wrap with Gold Accents',
    priceUSD: 450,
    image: assetPath('/assets/images/luxury_rose_bouquet_1785002544191.png'),
  },
  {
    id: 'bouq-1',
    name: 'The Sovereign Imperial Red Velvet Roses',
    tagline: '100 Ecuadorian Grand Roses in Signature Black Velvet Box & 24K Gold Trim',
    priceUSD: 450,
    image: assetPath('/assets/images/sovereign_red_roses_1785005575575.png'),
  },
  {
    id: 'bouq-4',
    name: 'The Dior Grand Gala Champagne & Flowers Hamper',
    tagline: 'Vintage Dom Pérignon Champagne, Belgian Gold Truffles & Black Orchids',
    priceUSD: 1200,
    image: assetPath('/assets/images/luxury_gift_hamper_1785003431109.png'),
  },
  {
    id: 'bouq-3',
    name: "L\u2019\u00c9ternel Preserved Crimson Rose Cloche",
    tagline: 'Real Ecuadorian Rose Preserved for 5+ Years under Crystal Glass Cloche',
    priceUSD: 320,
    image: assetPath('/assets/images/eternal_rose_cloche_1785003145770.png'),
  },
  {
    id: 'bouq-2',
    name: 'Royal Palais Bridal Orchid & Peony Cascade',
    tagline: 'Rare White Orchids, Plush French Peonies & Gold Leafed Eucalyptus Stems',
    priceUSD: 680,
    image: assetPath('/assets/images/royal_bridal_orchids_1785005589455.png'),
  },
  {
    id: 'bouq-5',
    name: 'Monaco Sunburst Golden Tulips & Cashmere Silk',
    tagline: '50 Rare Golden Dutch Tulips with Hand-Tied Italian Gold Silk Ribbon',
    priceUSD: 390,
    image: assetPath('/assets/images/monaco_golden_tulips.png'),
  },
  {
    id: 'bouq-6',
    name: 'Versailles Diamond White Hydrangea & Calla Lily',
    tagline: 'Architectural Floral Sculpture for Presidential Suites & Luxury Estates',
    priceUSD: 850,
    image: assetPath('/assets/images/versailles_white_hydrangeas.png'),
  },
  {
    id: 'bouq-8',
    name: 'Royal Romance Bridal Rose Bouquet',
    tagline: 'Premium Ivory Roses with Hand-Tied Satin Ribbon Cascade & Gold Accents',
    priceUSD: 580,
    image: assetPath('/assets/images/royal_wedding_bouquet_1785002559950.png'),
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 220 : -220, opacity: 0, scale: 0.94 }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: { x: { type: 'spring', stiffness: 300, damping: 28 }, opacity: { duration: 0.22 } }
  },
  exit: (dir) => ({
    x: dir < 0 ? 220 : -220, opacity: 0, scale: 0.94,
    transition: { x: { type: 'spring', stiffness: 300, damping: 28 }, opacity: { duration: 0.22 } }
  }),
};

export default function FlowerHeroCanvas() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { formatPrice, addToCart } = useApp();

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const currentItem = CAROUSEL_ITEMS[activeIndex];

  return (
    <div className="w-full h-[340px] sm:h-[500px] lg:h-[680px] relative rounded-3xl overflow-hidden border border-mutedGold-500/20 shadow-2xl flex flex-col justify-between p-6 sm:p-8 select-none"
      style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.10) 0%, rgba(10,10,15,0.97) 70%)' }}
    >
      {/* Subtle animated glow orb — pure CSS, no 3D lib */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gold-400/5 blur-2xl" />
      </div>

      {/* Header Row */}
      <div className="relative z-10 w-full flex items-center justify-end text-[10px] uppercase font-bold tracking-widest text-mutedGold-400">
        <span>Slide {activeIndex + 1} of {CAROUSEL_ITEMS.length}</span>
      </div>

      {/* Main Image Slider */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center">
        <div className="relative w-44 h-44 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -50) handleNext();
                else if (offset.x > 50) handlePrev();
              }}
              className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
            >
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.35)] select-none"
                draggable="false"
                onError={(e) => { e.target.src = assetPath('/assets/images/sovereign_red_roses_1785005575575.png'); }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left / Right Arrow Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-4 top-[48%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-mutedGold-500/25 bg-obsidian-950/60 backdrop-blur-md text-mutedGold-400 hover:text-pearl-50 hover:bg-mutedGold-500/15 hover:scale-110 active:scale-95 transition-all shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-4 top-[48%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-mutedGold-500/25 bg-obsidian-950/60 backdrop-blur-md text-mutedGold-400 hover:text-pearl-50 hover:bg-mutedGold-500/15 hover:scale-110 active:scale-95 transition-all shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="relative z-20 flex justify-center items-center gap-2 mb-2 pointer-events-auto">
        {CAROUSEL_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handleDotClick(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-6 bg-gold-400'
                : 'w-1.5 bg-mutedGold-500/40 hover:bg-mutedGold-400/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Product Details & Order Button */}
      <div className="relative z-10 w-full bg-obsidian-950/75 border border-mutedGold-500/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center shadow-lg gap-2 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <h3 className="font-serif text-base sm:text-lg font-bold text-gold-gradient tracking-wide mb-1 leading-snug">
              {currentItem.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-pearl-300/80 line-clamp-1 max-w-sm sm:max-w-md mb-3 font-light leading-relaxed">
              {currentItem.tagline}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="w-full flex items-center justify-between gap-4 pt-1 border-t border-mutedGold-500/10">
          <div className="text-left">
            <span className="block text-[8px] uppercase tracking-widest text-pearl-400 font-bold">Price</span>
            <span className="font-serif text-sm sm:text-base font-bold text-gold-400">
              {formatPrice ? formatPrice(currentItem.priceUSD) : `₹${currentItem.priceUSD}`}
            </span>
          </div>
          <button
            onClick={() => addToCart({
              id: currentItem.id,
              name: currentItem.name,
              priceUSD: currentItem.priceUSD,
              image: currentItem.image,
              category: 'Featured'
            })}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gold-gradient text-obsidian-950 hover:scale-105 active:scale-95 transition-all text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-gold-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-obsidian-950" />
            <span>Order Now</span>
          </button>
        </div>
      </div>

    </div>
  );
}
