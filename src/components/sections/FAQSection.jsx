import React, { useState } from 'react';
import { FAQS } from '../../data/products';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIdx(openIdx === index ? -1 : index);
  };

  return (
    <section className="py-24 relative bg-obsidian-950/70 border-t border-gold-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>VIP Client Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50">
            Frequently Asked <span className="text-gold-gradient italic">Questions</span>
          </h2>

          <p className="text-pearl-200/70 text-sm font-light">
            Everything you need to know about our VIP White-Glove delivery, custom consultations, and preserved rose care.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-gold-500/50 shadow-gold-sm' : 'border-gold-500/20 hover:border-gold-500/35'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-pearl-50">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 border-t border-gold-500/10">
                    <p className="text-xs sm:text-sm text-pearl-200/80 font-light leading-relaxed pt-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
