import React from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    products
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-gold-500/40 p-6 flex flex-col justify-between shadow-gold-lg">
          
          <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
            <div className="flex items-center gap-2 text-gold-400">
              <Heart className="w-5 h-5 fill-current" />
              <h3 className="font-serif font-bold text-lg text-pearl-50">Saved Wishlist</h3>
              <span className="text-xs text-pearl-300">({wishlistedProducts.length})</span>
            </div>
            <button onClick={() => setIsWishlistOpen(false)} className="text-pearl-300 hover:text-gold-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Heart className="w-12 h-12 text-gold-500/30 mx-auto" />
                <p className="font-serif text-pearl-200 text-base">Your wishlist is empty.</p>
                <p className="text-xs text-pearl-400 font-light">Save your favorite haute couture arrangements for future occasions.</p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div key={product.id} className="p-3 rounded-2xl bg-obsidian-900/80 border border-gold-500/20 flex gap-3 items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-gold-500/20" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs text-pearl-50 truncate">{product.name}</h4>
                    <span className="text-xs font-serif font-bold text-gold-gradient block mt-0.5">
                      {formatPrice(product.priceUSD)}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-full bg-gold-gradient text-obsidian-950 font-bold"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 text-pearl-400 hover:text-red-400"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
