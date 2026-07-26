import React, { useState } from 'react';
import { TESTIMONIALS } from '../../data/products';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? TESTIMONIALS.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === TESTIMONIALS.length - 1 ? 0 : prevIdx + 1));
  };

  const active = TESTIMONIALS[currentIndex];

  return (
    <section id="reviews" className="py-24 relative bg-obsidian-950/90 border-t border-gold-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Sovereign Patron Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50">
            Endorsed by <span className="text-gold-gradient italic">Royalty & VIPs</span>
          </h2>

          <p className="text-pearl-200/70 text-sm sm:text-base font-light">
            Read authentic reviews from global patrons, fashion editors, and royal estate clients.
          </p>
        </div>

        {/* Testimonial Card Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold-500/40 relative shadow-gold-lg">
            
            <Quote className="w-12 h-12 text-gold-500/20 absolute top-6 right-8 pointer-events-none" />

            <div className="space-y-6">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Quote Comment */}
              <p className="text-lg sm:text-2xl font-serif font-normal text-pearl-100 italic leading-relaxed">
                "{active.comment}"
              </p>

              {/* Author Details */}
              <div className="flex items-center justify-between pt-6 border-t border-gold-500/20">
                <div className="flex items-center gap-4">
                  <img
                    src={active.avatar}
                    alt={active.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold-400 shadow-gold-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-pearl-50 flex items-center gap-1.5">
                      <span>{active.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    </h4>
                    <p className="text-xs text-gold-300 font-medium">{active.role}</p>
                    <p className="text-[11px] text-pearl-400">{active.location}</p>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="p-3 rounded-full border border-gold-500/30 text-pearl-200 hover:text-gold-400 hover:border-gold-500 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="p-3 rounded-full border border-gold-500/30 text-pearl-200 hover:text-gold-400 hover:border-gold-500 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
