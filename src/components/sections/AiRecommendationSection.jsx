import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Compass, Check, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';

export default function AiRecommendationSection() {
  const { products, formatPrice, addToCart } = useApp();

  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('Anniversary');
  const [vibe, setVibe] = useState('Royal Sovereign');
  const [budget, setBudget] = useState('Haute Couture VIP');
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const occasions = ['Wedding', 'Anniversary', 'Birthday', 'Gala Event', 'Romantic Gift'];
  const vibes = ['Royal Sovereign', 'Romantic Crimson', 'Minimalist Elegance', 'Extravagant Glamour'];
  const budgets = ['Luxury Standard ($300 - $500)', 'Haute Couture VIP ($500 - $1,000)', 'Unlimited Sovereign ($1,000+)'];

  const handleGenerate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      let matched = products[0];
      if (occasion === 'Wedding') matched = products.find((p) => p.category.toLowerCase() === 'wedding') || products[1];
      else if (vibe.includes('Romantic')) matched = products.find((p) => p.id === 'bouq-3') || products[2];
      else if (budget.includes('1,000')) matched = products.find((p) => p.category.toLowerCase() === 'hampers') || products[3];

      setRecommendation(matched);
      setIsCalculating(false);
      setStep(4);
    }, 1200);
  };

  const resetQuiz = () => {
    setStep(1);
    setRecommendation(null);
  };

  return (
    <section className="py-24 relative bg-emerald-950/20 border-t border-gold-500/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gold-500/40 relative shadow-gold-lg space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>AI Floral Concierge Assistant</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-pearl-50">
              Find Your <span className="text-gold-gradient italic">Perfect Bouquet</span> Match
            </h2>

            <p className="text-xs sm:text-sm text-pearl-200/70 max-w-lg mx-auto font-light">
              Answer 3 quick aesthetic questions and our neural floral engine will curate the ideal haute couture arrangement for your recipient.
            </p>
          </div>

          {/* Wizard Step 1: Occasion */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <span className="text-xs uppercase font-serif tracking-widest text-gold-400 font-bold block text-center">
                Step 1 of 3: What is the Occasion?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setOccasion(occ)}
                    className={`p-4 rounded-2xl border text-xs font-serif font-bold transition-all ${
                      occasion === occ
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-gold-sm'
                        : 'bg-obsidian-900 border-gold-500/15 text-pearl-300 hover:border-gold-500/30'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
              <div className="text-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 2: Vibe */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <span className="text-xs uppercase font-serif tracking-widest text-gold-400 font-bold block text-center">
                Step 2 of 3: Recipient’s Vibe & Style
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vibes.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVibe(v)}
                    className={`p-4 rounded-2xl border text-xs font-serif font-bold transition-all ${
                      vibe === v
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-gold-sm'
                        : 'bg-obsidian-900 border-gold-500/15 text-pearl-300 hover:border-gold-500/30'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full border border-gold-500/30 text-pearl-300 text-xs font-serif"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 3: Budget */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <span className="text-xs uppercase font-serif tracking-widest text-gold-400 font-bold block text-center">
                Step 3 of 3: Preferred Investment Tier
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {budgets.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`p-4 rounded-2xl border text-xs font-serif font-bold transition-all ${
                      budget === b
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-gold-sm'
                        : 'bg-obsidian-900 border-gold-500/15 text-pearl-300 hover:border-gold-500/30'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full border border-gold-500/30 text-pearl-300 text-xs font-serif"
                >
                  ← Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isCalculating}
                  className="px-8 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-obsidian-950" />
                      <span>Synthesizing Match...</span>
                    </>
                  ) : (
                    <span>Generate AI Recommendation ✨</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Wizard Step 4: Result */}
          {step === 4 && recommendation && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 text-xs font-serif uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>99.4% AI Match Score</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-left bg-obsidian-900/80 p-6 rounded-2xl border border-gold-500/30">
                <img
                  src={recommendation.image}
                  alt={recommendation.name}
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-gold-400">
                    Recommended for {occasion} • {vibe}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-pearl-50">{recommendation.name}</h3>
                  <p className="text-xs text-pearl-200/80 font-light">{recommendation.description}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-serif font-bold text-2xl text-gold-gradient">
                      {formatPrice(recommendation.priceUSD)}
                    </span>
                    <button
                      onClick={() => addToCart(recommendation, `AI Tailored for ${occasion}`)}
                      className="px-6 py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Acquire Match</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={resetQuiz}
                className="text-xs text-pearl-300 hover:text-gold-400 underline font-serif"
              >
                ↻ Retake AI Recommendation Quiz
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
