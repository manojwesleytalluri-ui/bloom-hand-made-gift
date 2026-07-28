import React from 'react';
import { useApp } from '../../context/AppContext';
import { assetPath } from '../../utils/assetPath';
import { X, Heart, ShoppingBag, Trash2, ExternalLink, Sparkles } from 'lucide-react';

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    products,
    setQuickViewProduct
  } = useApp();

  if (!isWishlistOpen) return null;

  // Resolve wishlisted items by matching product ID (supports both string IDs and object items)
  const wishlistedProducts = products.filter((p) =>
    wishlist.some((item) => (typeof item === 'string' ? item === p.id : item.id === p.id))
  );

  const defaultFallbackImage = assetPath('/assets/images/sovereign_red_roses_1785005575575.png');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-gold-500/40 p-6 flex flex-col justify-between shadow-gold-lg relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
            <div className="flex items-center gap-2 text-gold-400">
              <Heart className="w-5 h-5 fill-current text-[#d19e45]" />
              <h3 className="font-serif font-bold text-lg text-pearl-50">Saved Wishlist</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 font-mono font-bold">
                ({wishlistedProducts.length})
              </span>
            </div>
            <button onClick={() => setIsWishlistOpen(false)} className="text-pearl-300 hover:text-gold-400 p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2 pr-1">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="font-serif text-pearl-200 text-base">Your saved wishlist is empty.</p>
                <p className="text-xs text-pearl-400 font-light max-w-xs mx-auto">
                  Click the heart icon on any haute couture bouquet to save items for future celebrations.
                </p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div key={product.id} className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-gold-500/20 flex gap-3.5 items-center hover:border-gold-500/40 transition-colors">
                  {/* Image with onError Fallback Protection */}
                  <img
                    src={product.image || defaultFallbackImage}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultFallbackImage;
                    }}
                    className="w-16 h-16 object-cover rounded-xl border border-gold-500/20 shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setQuickViewProduct(product);
                    }}
                  />

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-gold-400 font-bold block">
                      {product.category}
                    </span>
                    <h4
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setQuickViewProduct(product);
                      }}
                      className="font-serif font-bold text-xs text-pearl-50 truncate hover:text-[#d19e45] cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-serif font-bold text-gold-gradient">
                        {formatPrice(product.priceUSD)}
                      </span>
                      {product.originalPriceUSD && (
                        <span className="text-[10px] text-pearl-400 line-through">
                          {formatPrice(product.originalPriceUSD)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 rounded-xl bg-gold-gradient text-obsidian-950 font-bold hover:scale-105 transition-transform"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 rounded-xl bg-obsidian-950 border border-red-500/30 text-red-400 hover:bg-red-950 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {wishlistedProducts.length > 0 && (
            <div className="pt-4 border-t border-gold-500/20 space-y-2">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => addToCart(p));
                }}
                className="w-full py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Shopping Cart ({wishlistedProducts.length})</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
