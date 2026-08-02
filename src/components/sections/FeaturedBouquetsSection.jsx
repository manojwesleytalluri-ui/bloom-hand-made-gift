import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Eye, Crown, Sparkles, Gem, Heart, Star } from 'lucide-react';
import { assetPath } from '../../utils/assetPath';

export default function FeaturedBouquetsSection() {
  const { products, formatPrice, addToCart, wishlist, toggleWishlist } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});

  const activeProducts = (products || []).filter((p) => p.status !== 'Inactive');

  const categories = ['All', 'Featured', 'Wedding', 'Anniversary', 'Birthday', 'Hampers'];

  const filteredProducts =
    activeCategory === 'All'
      ? activeProducts
      : activeProducts.filter((p) => p.category === activeCategory || p.occasion === activeCategory);

  const handleImageLoad = (id) => {
    setImageLoadStates((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="bouquets" className="py-28 relative bg-charcoal-950 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-mutedGold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-deepRed-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mutedGold-500/10 border border-mutedGold-500/30 text-mutedGold-400 text-[11px] font-serif uppercase tracking-[0.25em]">
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
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-500 ${
                  activeCategory === cat
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
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-3xl border border-mutedGold-500/20 max-w-xl mx-auto">
            <Sparkles className="w-12 h-12 text-mutedGold-500/40 mx-auto mb-3" />
            <p className="text-pearl-50 font-serif text-lg font-bold">No Products or Images Available</p>
            <p className="text-pearl-300/70 text-xs mt-1">Website data and images have been cleared.</p>
          </div>
        ) : (
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
                      {!isLoaded && !(product.image && product.image.startsWith('data:')) && (
                        <div className="absolute inset-0 bg-charcoal-800 animate-pulse flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-mutedGold-500/30 animate-spin" />
                        </div>
                      )}

                      {/* Main Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        onLoad={() => handleImageLoad(product.id)}
                        onError={(e) => {
                          handleImageLoad(product.id);
                        }}
                        className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 ${
                          isLoaded || (product.image && product.image.startsWith('data:')) ? 'opacity-100' : 'opacity-0'
                        }`}
                      />

                      {/* Premium Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                      {/* Top Left Badge */}
                      {product.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3.5 py-1.5 rounded-full bg-charcoal-950/70 backdrop-blur-xl border border-mutedGold-500/30 text-mutedGold-300 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 shadow-lg">
                            <Crown className="w-3 h-3 text-mutedGold-400" />
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Top Right Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-xl border transition-all duration-300 flex items-center justify-center ${
                          isWishlisted
                            ? 'bg-deepRed-900/80 border-deepRed-500/50 text-deepRed-300 scale-110 shadow-lg'
                            : 'bg-charcoal-950/50 border-mutedGold-500/20 text-ivory-300 hover:text-deepRed-400 hover:border-deepRed-500/40 hover:scale-110'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      {/* Bottom Image Actions */}
                      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="px-3.5 py-2 rounded-full bg-charcoal-950/80 backdrop-blur-xl border border-mutedGold-500/30 text-ivory-200 hover:text-mutedGold-300 text-[10px] font-serif uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:border-mutedGold-500/60 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Rating & Category */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-1 text-mutedGold-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-medium text-[11px]">{product.rating || '5.0'}</span>
                            <span className="text-ivory-400/50 text-[10px]">({product.reviewsCount || 0})</span>
                          </div>
                          <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-mutedGold-400/80 font-medium">
                            {product.occasion || product.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg font-bold text-ivory-50 group-hover:text-mutedGold-300 transition-colors duration-300 line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Tagline */}
                        <p className="text-xs text-ivory-300/70 font-light mt-1.5 line-clamp-2 leading-relaxed">
                          {product.tagline || product.description}
                        </p>

                        {/* Flower Types Tags */}
                        {product.flowerTypes && product.flowerTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {product.flowerTypes.slice(0, 2).map((ft, i) => (
                              <span key={i} className="px-2.5 py-0.5 rounded-full bg-mutedGold-500/8 border border-mutedGold-500/15 text-mutedGold-400/70 text-[9px] uppercase tracking-wider font-medium">
                                {ft}
                              </span>
                            ))}
                          </div>
                        )}
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
                          className="group/btn relative px-5 py-2.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-gold-sm overflow-hidden"
                        >
                          <ShoppingBag className="w-4 h-4 text-obsidian-950 relative z-10" />
                          <span className="relative z-10 font-bold">Acquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-2xl"
            onClick={(e) => e.target === e.currentTarget && setQuickViewProduct(null)}
          >
            <div className="relative max-w-3xl w-full rounded-[2rem] overflow-hidden bg-charcoal-900/90 backdrop-blur-xl border border-mutedGold-500/30 shadow-2xl shadow-gold-500/10 max-h-[90vh] overflow-y-auto">

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

                  <div className="pt-4 border-t border-mutedGold-500/15 flex items-center justify-between">
                    <span className="text-2xl font-serif font-bold text-mutedGold-gradient">
                      {formatPrice(quickViewProduct.priceUSD)}
                    </span>

                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
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
