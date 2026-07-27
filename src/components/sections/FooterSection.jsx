import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Sparkles, Globe, Shield, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FooterSection() {
  const { isAdminOpen } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  if (isAdminOpen) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="contact" className="relative bg-obsidian-950 pt-20 pb-12 border-t border-gold-500/20 text-pearl-200">
      
      {/* Newsletter Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold-500/40 relative overflow-hidden text-center space-y-6 shadow-gold-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Sovereign Club</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-pearl-50">
            Subscribe for <span className="text-gold-gradient italic">VIP Invitations & Privileges</span>
          </h3>

          <p className="text-xs sm:text-sm text-pearl-200/70 max-w-xl mx-auto font-light">
            Receive exclusive seasonal bloom releases, private galas invitations, and a complimentary 24K gold rose voucher.
          </p>

          {isSubscribed ? (
            <div className="p-4 rounded-2xl bg-gold-500/20 border border-gold-400 text-gold-300 text-xs uppercase font-serif font-bold tracking-widest animate-fadeIn">
              ✨ Welcome to the Sovereign Club. Check your inbox for your VIP voucher #BLOOM-GOLD-100.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your VIP email address..."
                className="w-full bg-obsidian-900 border border-gold-500/30 rounded-full px-5 py-3 text-xs text-pearl-100 placeholder-pearl-400 outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform shrink-0"
              >
                <span>Join</span>
                <Send className="w-3.5 h-3.5 text-obsidian-950" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-gold-500/15">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-emerald-900 flex items-center justify-center border border-gold-400/40">
              <span className="font-serif text-lg font-bold text-obsidian-950">BH</span>
            </div>
            <span className="font-serif text-2xl font-bold text-gold-gradient">Bloom Hand Made Gift</span>
          </div>

          <p className="text-xs text-pearl-300/70 font-light leading-relaxed max-w-sm">
            Haute Couture floral design atelier dedicated to crafting unforgettable luxury experiences, grand Ecuadorian rose boxes, and 5-year preserved eternal blooms.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setShowMapModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 text-gold-400 text-xs font-serif hover:bg-gold-500/10 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Locate Flagship Boutiques (Google Maps)</span>
            </button>
          </div>
        </div>

        {/* Global Flagship Boutiques */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-gold-400">
            Global Flagships
          </h4>
          <ul className="space-y-2 text-xs text-pearl-300/80 font-light">
            <li>Paris • 14 Place Vendôme</li>
            <li>London • 82 Mayfair Street</li>
            <li>Dubai • Downtown Palace Boulevard</li>
            <li>New York • 740 Fifth Avenue</li>
            <li>Mumbai • Bandra Luxury Quarter</li>
          </ul>
        </div>

        {/* Collections Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-gold-400">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-pearl-300/80 font-light">
            <li><a href="#collections" className="hover:text-gold-300">Grand Velvet Roses</a></li>
            <li><a href="#occasions" className="hover:text-gold-300">Haute Couture Bridal</a></li>
            <li><a href="#collections" className="hover:text-gold-300">L’Éternel Cloches</a></li>
            <li><a href="#builder" className="hover:text-gold-300">Custom Atelier Builder</a></li>
            <li><a href="#collections" className="hover:text-gold-300">Champagne Hampers</a></li>
          </ul>
        </div>

        {/* VIP Concierge Support */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-gold-400">
            VIP Support
          </h4>
          <ul className="space-y-2 text-xs text-pearl-300/80 font-light">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>+1 (800) 888-BLOOM</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <span>concierge@bloomhandmadegift.com</span>
            </li>
            <li>Same-Day VIP Delivery Guarantee</li>
            <li>24/7 Personal Florist Desk</li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-pearl-400 gap-4">
        <p>
          © 2026 Bloom Hand Made Gift. All Rights Reserved. Designed for ₹10 Lakh Luxury Standard.
          <button
            onClick={() => setIsAdminOpen(true)}
            className="ml-2 text-[9px] text-pearl-500/15 hover:text-gold-400/80 transition-colors cursor-default select-none font-sans"
            title="Sovereign VIP Admin Atelier"
          >
            • Atelier
          </button>
        </p>
        
        {/* Payment Icons Simulation */}
        <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-pearl-300 font-serif">
          <span>VISA</span> • <span>MASTERCARD</span> • <span>AMEX</span> • <span>APPLE PAY</span> • <span>UPI</span>
        </div>
      </div>

      {/* Google Maps Flagship Store Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-xl">
          <div className="glass-panel border border-gold-500/40 rounded-3xl max-w-3xl w-full p-6 relative space-y-4 animate-fadeIn">
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400 font-bold"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              <span>Global Flagship Boutiques Locator</span>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden border border-gold-500/30 relative bg-obsidian-900">
              <iframe
                title="Boutique Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.329241!3d48.867374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e33f191b9bf%3A0xa69d2d0b678c1875!2sPlace%20Vend%C3%B4me%2C%20Paris!5e0!3m2!1sen!2s!4v1625000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] text-pearl-200">
              <div className="p-2 rounded-xl bg-obsidian-900 border border-gold-500/20">Paris • Place Vendôme</div>
              <div className="p-2 rounded-xl bg-obsidian-900 border border-gold-500/20">London • Mayfair</div>
              <div className="p-2 rounded-xl bg-obsidian-900 border border-gold-500/20">Dubai • Downtown</div>
              <div className="p-2 rounded-xl bg-obsidian-900 border border-gold-500/20">Mumbai • Bandra</div>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}
