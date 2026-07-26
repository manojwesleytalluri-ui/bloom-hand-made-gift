import React, { useState } from 'react';
import { PRODUCTS } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check, Crown, Gem } from 'lucide-react';

export default function FeaturedBouquetsSection() {
  const { products, formatPrice, addToCart, wishlist, toggleWishlist, setIsCartOpen, quickViewProduct, setQuickViewProduct } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [imageLoadStates, setImageLoadStates] = useState({});

  const categories = ['All', 'Featured', 'Wedding', 'Birthday', 'Anniversary', 'Hampers'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const handleImageLoad = (id) => {
    setImageLoadStates(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="collections" className="py-28 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-charcoal-950/80" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mutedGold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-mutedGold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mutedGold-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-5 max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-mutedGold-500/10 border border-mutedGold-500/30 text-mutedGold-400 text-xs font-serif uppercase tracking-[0.2em]">
            <Crown className="w-3.5 h-3.5" />
            <span>Curated Haute Couture Collection</span>
            <Gem className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-charcoal-900 leading-tight">
            Featured <span className="text-gold-gradient italic">Luxury</span> Bouquets
          </h2>

          <p className="text-charcoal-800/60 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            Handcrafted by master floral architects using grand Ecuadorian stems, 24K gold foil trim, and Italian velvet packaging.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-500 ${activeCategory === cat
                  ? 'bg-mutedGold-gradient text-charcoal-950 font-bold shadow-gold-sm scale-105'
                  : 'bg-charcoal-900/60 backdrop-blur-md text-ivory-300 hover:text-mutedGold-300 border border-mutedGold-500/15 hover:border-mutedGold-500/40 hover:bg-charcoal-800/40'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product, index) => {
            const isWishlisted = wishlist.includes(product.id);
            const isLoaded = imageLoadStates[product.id];

            return (
              <div
                key={product.id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card */}
                <div className="relative rounded-[2rem] overflow-hidden bg-charcoal-900/50 backdrop-blur-xl border border-mutedGold-500/10 hover:border-mutedGold-500/30 transition-all duration-700 flex flex-col shadow-2xl hover:shadow-gold-500/10">

                  {/* Image Container */}
                  <div className="relative h-[380px] overflow-hidden">
                    {/* Image Skeleton Loader */}
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-charcoal-800 animate-pulse flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-mutedGold-500/30 animate-spin" />
                      </div>
                    )}

                    {/* Main Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      onLoad={() => handleImageLoad(product.id)}
                      className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />

                    {/* Premium Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                    {/* Golden Shine Sweep Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mutedGold-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                    {/* Top Left Badge */}
                    <div className="absolute top-5 left-5 z-10">
                      <span className="px-3.5 py-1.5 rounded-full bg-charcoal-950/70 backdrop-blur-xl border border-mutedGold-500/40 text-mutedGold-300 text-[10px] uppercase tracking-[0.15em] font-semibold shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {product.badge}
                      </span>
                    </div>

                    {/* 3D Indicator */}
                    {product.is3D && (
                      <div className="absolute top-5 right-5 z-10">
                        <span className="px-3 py-1.5 rounded-full bg-mutedGold-500/20 backdrop-blur-xl border border-mutedGold-400/50 text-mutedGold-300 text-[9px] uppercase tracking-[0.2em] font-serif shadow-lg">
                          ✨ 3D View
                        </span>
                      </div>
                    )}

                    {/* Bottom Image Actions */}
                    <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between">
                      {/* Quick View */}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-3 rounded-2xl bg-charcoal-950/60 backdrop-blur-xl border border-ivory-50/10 text-ivory-200 hover:text-mutedGold-400 hover:border-mutedGold-500/40 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:scale-110"
                        title="Quick View"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>

                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-3 rounded-2xl backdrop-blur-xl border transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:scale-110 ${isWishlisted
                          ? 'bg-red-950/60 border-red-500/60 text-red-400'
                          : 'bg-charcoal-950/60 border-ivory-50/10 text-ivory-200 hover:text-mutedGold-400 hover:border-mutedGold-500/40'
                          }`}
                        title="Toggle Wishlist"
                      >
                        <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* New Badge Ribbon */}
                    {product.isNew && (
                      <div className="absolute top-16 left-0 z-10">
                        <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-[8px] uppercase tracking-[0.2em] font-bold px-4 py-1 shadow-lg"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
                          New Arrival
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Rating & Occasion */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="uppercase tracking-[0.2em] text-[10px] text-mutedGold-400/80 font-medium flex items-center gap-1.5">
                          <Crown className="w-3 h-3" />
                          {product.occasion}
                        </span>
                        <div className="flex items-center gap-1.5 text-mutedGold-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current text-mutedGold-400' : 'text-mutedGold-500/30'}`}
                            />
                          ))}
                          <span className="font-semibold text-ivory-200 ml-1">{product.rating}</span>
                          <span className="text-ivory-400/50">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-serif font-bold text-ivory-50 group-hover:text-mutedGold-300 transition-colors duration-500 line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Tagline */}
                      <p className="text-xs text-ivory-200/50 font-light mt-2 line-clamp-2 leading-relaxed">
                        {product.tagline}
                      </p>

                      {/* Flower Types Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {product.flowerTypes.slice(0, 2).map((ft, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-mutedGold-500/8 border border-mutedGold-500/15 text-mutedGold-400/70 text-[9px] uppercase tracking-wider font-medium">
                            {ft}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-5 border-t border-mutedGold-500/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-ivory-400/60 block uppercase tracking-[0.2em] font-medium">VIP Price</span>
                        <span className="text-2xl font-serif font-bold text-mutedGold-gradient">
                          {formatPrice(product.priceUSD)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="group/btn relative px-6 py-3 rounded-2xl bg-mutedGold-gradient text-charcoal-950 font-serif font-bold text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-gold-500/20 overflow-hidden"
                      >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                        <ShoppingBag className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Acquire</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-2xl"
            onClick={(e) => e.target === e.currentTarget && setQuickViewProduct(null)}
          >
            <div className="relative max-w-3xl w-full rounded-[2rem] overflow-hidden bg-charcoal-900/90 backdrop-blur-xl border border-mutedGold-500/30 shadow-2xl shadow-gold-500/10">

              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-charcoal-950/60 backdrop-blur-xl border border-mutedGold-500/30 text-ivory-300 hover:text-mutedGold-400 hover:border-mutedGold-500/60 transition-all flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Modal Image */}
                <div className="relative h-72 md:h-full overflow-hidden">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal-900/60 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent md:hidden" />

                  {/* Badge on Image */}
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1.5 rounded-full bg-charcoal-950/70 backdrop-blur-xl border border-mutedGold-500/40 text-mutedGold-300 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Crown className="w-3 h-3" />
                      {quickViewProduct.badge}
                    </span>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-5 flex flex-col justify-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-mutedGold-400 font-semibold flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3 h-3" />
                      {quickViewProduct.occasion}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-ivory-50 leading-snug">{quickViewProduct.name}</h3>
                  </div>

                  <p className="text-xs text-ivory-200/70 font-light leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-mutedGold-400" />
                      ))}
                    </div>
                    <span className="text-xs text-ivory-300 font-medium">{quickViewProduct.rating}</span>
                    <span className="text-xs text-ivory-400/50">({quickViewProduct.reviewsCount} reviews)</span>
                  </div>

                  {/* Composition */}
                  <div className="space-y-2 py-4 border-t border-b border-mutedGold-500/10">
                    <span className="text-[10px] text-mutedGold-300 uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5">
                      <Gem className="w-3 h-3" />
                      Floral Composition
                    </span>
                    <ul className="text-xs text-ivory-300/80 space-y-1.5">
                      {quickViewProduct.flowerTypes.map((ft, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400/80" />
                          <span>{ft}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-ivory-400/50 block uppercase tracking-[0.2em]">VIP Price</span>
                      <span className="text-3xl font-serif font-bold text-mutedGold-gradient">
                        {formatPrice(quickViewProduct.priceUSD)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="px-7 py-3.5 rounded-2xl bg-mutedGold-gradient text-charcoal-950 font-serif font-bold text-[10px] uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold-500/20 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
