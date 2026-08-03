import React, { useState } from 'react';
import { Sprout, Leaf, Sun, Droplets, Globe, ShieldCheck, ExternalLink, Trees, Award } from 'lucide-react';

export default function SustainableAgricultureSection() {
  const [selectedFarm, setSelectedFarm] = useState(null);

  const agriculturePillars = [
    {
      id: 'ecuador',
      title: 'High-Altitude Ecuadorian Rose Estates',
      location: 'Cotopaxi Volcano Valley, Ecuador (2,800m elevation)',
      icon: Sun,
      stat: '100% Solar-Powered',
      desc: 'Nurtured in mineral-rich volcanic soil with 12 hours of natural equatorial sunlight daily. Yields 70cm+ extra-large rose blooms with velvety texture.',
      practices: ['Rainwater Harvesting', 'Zero Chemical Pesticides', 'Direct Trade Fair Wages', 'Biodegradable Compost']
    },
    {
      id: 'holland',
      title: 'Dutch Hydroponic Flora Tech Farms',
      location: 'Aalsmeer & Westland, Netherlands',
      icon: Droplets,
      stat: '95% Water Recycled',
      desc: 'Next-generation closed-loop geothermal greenhouses creating optimal climate micro-environments for exotic orchids, tulips, and rare peonies.',
      practices: ['Geothermal Heating', 'Biocontrol Pest Defense', 'AI Climate Optimization', 'Zero Runoff Waste']
    },
    {
      id: 'karnataka',
      title: 'Organic Heritage Jasmine & Tuberose Fields',
      location: 'Mysuru & Nilgiri Foothills, India',
      icon: Sprout,
      stat: '100% Regenerative',
      desc: 'Heritage organic farms cultivating fragrant royal jasmine and night-blooming tuberose using ancient Vedic bio-dynamic farming traditions.',
      practices: ['Soil Regeneration', 'Pollinator Sanctuaries', 'Women Farmer Cooperatives', 'Natural Essential Extracts']
    }
  ];

  return (
    <section id="agriculture" className="py-24 relative bg-obsidian-950 border-t border-gold-500/20 text-pearl-200">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-obsidian-950 to-obsidian-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-serif uppercase tracking-widest">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Farm-to-Vase Eco Standards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50">
            Sustainable <span className="text-gold-gradient italic">Agriculture & Sourcing</span>
          </h2>

          <p className="text-pearl-200/70 text-sm sm:text-base font-light leading-relaxed">
            Every stem crafted by Bloom Hand Made Gift originates from certified eco-friendly agricultural estates. 
            We champion regenerative farming, fair-trade labor, and zero-carbon floral logistics worldwide.
          </p>
        </div>

        {/* Farm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {agriculturePillars.map((farm) => {
            const Icon = farm.icon;
            return (
              <div
                key={farm.id}
                className="glass-panel glass-card-hover p-8 rounded-3xl border border-emerald-500/30 relative flex flex-col justify-between group space-y-6 bg-obsidian-900/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                      {farm.stat}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-pearl-50 group-hover:text-gold-300 transition-colors">
                    {farm.title}
                  </h3>

                  <p className="text-xs text-emerald-400/90 font-medium flex items-center gap-1 mt-1 mb-3">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{farm.location}</span>
                  </p>

                  <p className="text-xs text-pearl-200/70 font-light leading-relaxed">
                    {farm.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gold-500/15 space-y-2">
                    <p className="text-[11px] font-serif font-bold uppercase tracking-wider text-gold-400">
                      Eco Practices:
                    </p>
                    <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-pearl-300/80">
                      {farm.practices.map((practice, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFarm(farm)}
                  className="w-full py-2.5 rounded-full border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 text-xs font-serif uppercase tracking-wider flex items-center justify-center gap-2 transition-colors mt-4"
                >
                  <span>Explore Estate Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Commitment Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold-500/30 bg-gradient-to-r from-emerald-950/40 via-obsidian-900 to-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-serif font-bold text-gold-400 uppercase tracking-widest">
              <Award className="w-4 h-4 text-gold-400" />
              <span>Certified Sustainable Floristry Standard</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-pearl-50">
              100% Organic, Ethical & Earth-Friendly
            </h3>
            <p className="text-xs sm:text-sm text-pearl-200/70 max-w-xl font-light">
              We pledge 2% of every luxury arrangement purchase to global reforestation and sustainable smallholder farming initiatives.
            </p>
          </div>

          <a
            href="#agriculture"
            className="px-8 py-3.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-serif font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/30 transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>Farm Sourcing Charter</span>
          </a>
        </div>

      </div>

      {/* Farm Detail Modal */}
      {selectedFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl">
          <div className="glass-panel border border-emerald-500/50 rounded-3xl max-w-xl w-full p-6 relative space-y-5 animate-fadeIn bg-obsidian-900">
            <button
              onClick={() => setSelectedFarm(null)}
              className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400 font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-pearl-50">{selectedFarm.title}</h4>
                <p className="text-xs text-emerald-400">{selectedFarm.location}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-emerald-500/20 space-y-2">
              <p className="text-xs font-bold text-gold-400 uppercase tracking-wider">Estate Overview</p>
              <p className="text-xs text-pearl-200/80 font-light leading-relaxed">{selectedFarm.desc}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Sustainable Agricultural Certifications:</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-pearl-200">
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Rainforest Alliance Certified</span>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>FairTrade International</span>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>GlobalGAP Eco Standard</span>
                </div>
                <div className="p-2.5 rounded-xl bg-obsidian-950 border border-emerald-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Carbon Neutral Farm</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gold-500/20 flex justify-end">
              <button
                onClick={() => setSelectedFarm(null)}
                className="px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-serif font-bold text-xs uppercase tracking-wider hover:bg-emerald-500/30"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
