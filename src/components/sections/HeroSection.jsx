import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import FlowerHeroCanvas from '../3d/FlowerHeroCanvas';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Award, Truck, Compass } from 'lucide-react';

export default function HeroSection() {
  const { setIsBookingOpen, setIsAiModalOpen } = useApp();
  const [lightingPreset, setLightingPreset] = useState('gold');

  return (
    <section id="home" className="relative min-h-screen pt-32 lg:pt-36 pb-16 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Glass & Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold-glow pointer-events-none blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Top Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-gold-500/40 text-gold-300 text-[10px] sm:text-xs font-medium uppercase tracking-widest shadow-gold-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span>Haute Couture Floral Atelier</span>
              <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-gold-400"></span>
              <span className="hidden sm:inline text-pearl-300/80">Paris • Dubai • London • Mumbai</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-pearl-50 leading-[1.15] tracking-tight">
              Crafting <span className="text-gold-gradient italic font-normal">Unforgettable</span> Expressions of Luxury
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-pearl-200/80 max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed font-light">
              Bespoke Ecuadorian rose arrangements, 24K gold foil stem dipping, and preserved 5-year eternal blooms. Hand-delivered via private VIP white-glove concierge.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#collections"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-gold-md"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 text-obsidian-950" />
              </a>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border-gold-500/50 text-gold-300 hover:text-pearl-50 hover:bg-gold-500/10 font-serif font-medium text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Book VIP Consultation</span>
              </button>
            </div>

            {/* AI Assistant Teaser CTA */}
            <div className="pt-2">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs text-gold-400 hover:text-pearl-100 transition-colors underline decoration-gold-500/40 underline-offset-4"
              >
                <Compass className="w-4 h-4 text-gold-400 animate-spin-slow" />
                <span>Unsure what to gift? Try our AI Floral Concierge Recommendation Quiz</span>
              </button>
            </div>

            {/* Brand Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-6 border-t border-gold-500/20 text-center lg:text-left">
              <div>
                <span className="block font-serif text-2xl lg:text-3xl font-bold text-gold-gradient">100%</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-pearl-300/70">Farm Fresh Rare Stems</span>
              </div>
              <div>
                <span className="block font-serif text-2xl lg:text-3xl font-bold text-gold-gradient">2-Hour</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-pearl-300/70">VIP White Glove Delivery</span>
              </div>
              <div>
                <span className="block font-serif text-2xl lg:text-3xl font-bold text-gold-gradient">5 Years</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-pearl-300/70">Eternal Rose Cloches</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Canvas & Lighting Controls */}
          <div className="lg:col-span-6 relative">
            {/* 3D Canvas */}
            <FlowerHeroCanvas preset={lightingPreset} setPreset={setLightingPreset} />
          </div>

        </div>
      </div>
    </section>
  );
}
