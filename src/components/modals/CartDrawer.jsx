import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotalUSD,
    formatPrice,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-gold-500/40 p-6 flex flex-col justify-between shadow-gold-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif font-bold text-lg text-pearl-50">Sovereign Cart</h3>
              <span className="text-xs text-gold-300 font-serif">
                ({cart.reduce((a, c) => a + c.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-pearl-300 hover:text-gold-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gold-500/30 mx-auto" />
                <p className="font-serif text-pearl-200 text-base">Your cart is currently empty.</p>
                <p className="text-xs text-pearl-400 font-light">Explore our Haute Couture collections to acquire your first arrangement.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="p-3 rounded-2xl bg-obsidian-900/80 border border-gold-500/20 flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-gold-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs text-pearl-50 truncate">{item.name}</h4>
                    <p className="text-[10px] text-gold-400 truncate">{item.variant}</p>
                    <span className="text-xs font-serif font-bold text-gold-gradient block mt-1">
                      {formatPrice(item.priceUSD * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-obsidian-950 border border-gold-500/20 rounded-full px-2 py-1 text-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.variant, -1)}
                      className="text-pearl-300 hover:text-gold-400 font-bold px-1"
                    >
                      -
                    </button>
                    <span className="text-pearl-100 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.variant, 1)}
                      className="text-pearl-300 hover:text-gold-400 font-bold px-1"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.variant)}
                    className="text-pearl-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-gold-500/20 space-y-4">
              <div className="flex items-center justify-between text-xs text-pearl-300">
                <span>VIP White-Glove Hand Delivery:</span>
                <span className="text-emerald-400 font-bold uppercase">Complimentary</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-base text-pearl-50">Total Investment:</span>
                <span className="font-serif font-bold text-2xl text-gold-gradient">
                  {formatPrice(cartTotalUSD)}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-4 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-sm hover:scale-[1.02] transition-transform"
              >
                <span>Proceed to VIP Checkout</span>
                <ArrowRight className="w-4 h-4 text-obsidian-950" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
