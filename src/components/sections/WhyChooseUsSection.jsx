import React from 'react';
import { ShieldCheck, Truck, Award, Sparkles, Clock, Globe } from 'lucide-react';

export default function WhyChooseUsSection() {
  const pillars = [
    {
      icon: Sparkles,
      title: '100% Farm-Fresh Rare Stems',
      desc: 'Sourced directly from private high-altitude organic estates in Ecuador and Holland. Hand-selected for stem length, petal volume, and longevity.'
    },
    {
      icon: Truck,
      title: '2-Hour VIP White-Glove Hand Delivery',
      desc: 'Transported in private climate-controlled luxury vans with uniformed concierges. Shock-resistant glass casing preserves exact temperature and humidity.'
    },
    {
      icon: Award,
      title: 'Signature Velvet & 24K Gold Packaging',
      desc: 'Handcrafted Italian velvet boxes embossed with 24K gold leaf monogramming, silk ribbons, and custom engraved wax seal letters.'
    },
    {
      icon: Clock,
      title: 'Master Floral Architect Atelier',
      desc: 'Every bouquet is individually sculpted by award-winning floral designers who have arranged galas for luxury houses across Paris and Dubai.'
    }
  ];

  return (
    <section className="py-24 relative bg-obsidian-950/80 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pillars of Haute Couture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50">
            Why Choose <span className="text-gold-gradient italic">Bloom Hand Made Gift</span>
          </h2>

          <p className="text-pearl-200/70 text-sm sm:text-base font-light">
            We do not sell mere flowers. We craft unforgettable emotional monuments for those who demand absolute perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-card-hover p-8 rounded-3xl border border-gold-500/20 space-y-4 text-center group"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-gold-400/20 via-emerald-900/30 to-obsidian-900 flex items-center justify-center border border-gold-500/40 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>

                <h3 className="font-serif font-bold text-lg text-pearl-50 group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-pearl-200/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
