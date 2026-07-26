import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, Sliders, Palette, FileText, ShoppingBag, Gift } from 'lucide-react';

export default function CustomBouquetBuilder() {
  const { formatPrice, addToCart } = useApp();

  // Customization State
  const [stemCount, setStemCount] = useState(50);
  const [selectedFlowers, setSelectedFlowers] = useState(['Grand Prix Red Roses']);
  const [packaging, setPackaging] = useState('Black Velvet Box');
  const [ribbon, setRibbon] = useState('24K Gold Foil Ribbon');
  const [cardMessage, setCardMessage] = useState('With endless devotion and love.');
  const [hasChampagne, setHasChampagne] = useState(false);
  const [hasTruffles, setHasTruffles] = useState(true);

  // Flower options
  const flowerOptions = [
    { name: 'Grand Prix Red Roses', pricePerStem: 5 },
    { name: 'White French Peonies', pricePerStem: 8 },
    { name: 'Rare Black Orchids', pricePerStem: 12 },
    { name: 'Golden Dutch Tulips', pricePerStem: 6 },
    { name: 'Snow Calla Lilies', pricePerStem: 7 },
  ];

  // Packaging options
  const packagingOptions = [
    { name: 'Black Velvet Box', price: 60, image: '/assets/images/luxury_rose_bouquet_1785002544191.png' },
    { name: 'Emerald Velvet Chest', price: 90, image: '/assets/images/luxury_gift_hamper_1785003431109.png' },
    { name: 'Italian Crystal Vase', price: 120, image: '/assets/images/royal_wedding_bouquet_1785002559950.png' },
    { name: 'Gold Foil Hand Wrapper', price: 40, image: '/assets/images/eternal_rose_cloche_1785003145770.png' },
  ];

  // Calculate Base Price
  const stemsCost = selectedFlowers.reduce((acc, flowerName) => {
    const f = flowerOptions.find((item) => item.name === flowerName);
    return acc + (f ? f.pricePerStem : 5) * (stemCount / selectedFlowers.length);
  }, 0);

  const selectedPack = packagingOptions.find((p) => p.name === packaging) || packagingOptions[0];
  const champagneCost = hasChampagne ? 180 : 0;
  const trufflesCost = hasTruffles ? 45 : 0;

  const totalCustomUSD = Math.round(stemsCost + selectedPack.price + champagneCost + trufflesCost);

  const toggleFlower = (name) => {
    if (selectedFlowers.includes(name)) {
      if (selectedFlowers.length > 1) {
        setSelectedFlowers(selectedFlowers.filter((f) => f !== name));
      }
    } else {
      setSelectedFlowers([...selectedFlowers, name]);
    }
  };

  const handleAddToCart = () => {
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `Bespoke Floral Sculpture (${stemCount} Stems)`,
      priceUSD: totalCustomUSD,
      image: selectedPack.image,
      category: 'Custom',
      occasion: 'Custom',
      badge: '1-of-1 Bespoke',
      description: `Bespoke arrangement containing ${selectedFlowers.join(', ')} presented in a ${packaging} with ${ribbon}.`,
    };
    const variantSpec = `${stemCount} Stems in ${packaging} | Card: "${cardMessage.slice(0, 20)}..."`;
    addToCart(customProduct, variantSpec);
  };

  return (
    <section id="builder" className="py-24 relative bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-serif uppercase tracking-widest">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive 3-Step Atelier</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pearl-50">
            Custom <span className="text-gold-gradient italic">Bouquet</span> Builder
          </h2>

          <p className="text-pearl-200/70 text-sm sm:text-base font-light">
            Architect your own 1-of-1 luxury floral arrangement. Select stems, hand-wrapped packaging, wax seal notes, and luxury extras in real time.
          </p>
        </div>

        {/* Builder Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Controls Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Stem Selector & Count */}
            <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-serif tracking-widest text-gold-400 font-bold">
                  Step 1: Select Flower Varieties
                </span>
                <span className="text-xs text-pearl-300">Choose 1 or more varieties</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flowerOptions.map((f) => {
                  const isSelected = selectedFlowers.includes(f.name);
                  return (
                    <button
                      key={f.name}
                      onClick={() => toggleFlower(f.name)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-gold-500/20 border-gold-400 text-pearl-50'
                          : 'bg-obsidian-900 border-gold-500/15 text-pearl-300 hover:border-gold-500/40'
                      }`}
                    >
                      <span className="text-xs font-medium">{f.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-gold-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Stem Count Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-pearl-300 font-medium">Stem Count Volume:</span>
                  <span className="font-serif font-bold text-gold-gradient text-sm">{stemCount} Stems</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="150"
                  step="25"
                  value={stemCount}
                  onChange={(e) => setStemCount(Number(e.target.value))}
                  className="w-full accent-gold-500 bg-obsidian-900 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-pearl-400">
                  <span>25 Stems</span>
                  <span>50 Stems</span>
                  <span>75 Stems</span>
                  <span>100 Stems (Sovereign)</span>
                  <span>150 Stems</span>
                </div>
              </div>
            </div>

            {/* Step 2: Packaging & Ribbon */}
            <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 space-y-5">
              <span className="text-xs uppercase font-serif tracking-widest text-gold-400 font-bold block">
                Step 2: Signature Packaging & Ribbon
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {packagingOptions.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPackaging(p.name)}
                    className={`p-3 rounded-2xl border text-center space-y-2 transition-all ${
                      packaging === p.name
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-bold'
                        : 'bg-obsidian-900 border-gold-500/15 text-pearl-300 hover:border-gold-500/30'
                    }`}
                  >
                    <span className="text-[11px] block">{p.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-xs text-pearl-300 font-medium block mb-2">Accent Velvet Ribbon:</span>
                <div className="flex flex-wrap gap-2">
                  {['24K Gold Foil Ribbon', 'Royal Navy Silk', 'Wine Crimson Velvet', 'Emerald Satin'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRibbon(r)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        ribbon === r
                          ? 'bg-gold-500 text-obsidian-950 font-bold'
                          : 'bg-obsidian-900 border border-gold-500/20 text-pearl-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Engraved Wax Seal Card & Addons */}
            <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 space-y-5">
              <span className="text-xs uppercase font-serif tracking-widest text-gold-400 font-bold block">
                Step 3: Calligraphy Note & Luxury Extras
              </span>

              <div>
                <label className="text-xs text-pearl-300 block mb-1">Wax-Sealed Greeting Card Message:</label>
                <textarea
                  rows="2"
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-2xl p-3 text-xs text-pearl-100 focus:border-gold-500 outline-none"
                  placeholder="Enter personalized note..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => setHasChampagne(!hasChampagne)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs ${
                    hasChampagne ? 'bg-gold-500/20 border-gold-400 text-gold-300' : 'bg-obsidian-900 border-gold-500/20 text-pearl-300'
                  }`}
                >
                  <span>Dom Pérignon Vintage (+{formatPrice(180)})</span>
                  {hasChampagne && <Check className="w-4 h-4 text-gold-400" />}
                </button>

                <button
                  onClick={() => setHasTruffles(!hasTruffles)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs ${
                    hasTruffles ? 'bg-gold-500/20 border-gold-400 text-gold-300' : 'bg-obsidian-900 border-gold-500/20 text-pearl-300'
                  }`}
                >
                  <span>Belgian Gold Truffles (+{formatPrice(45)})</span>
                  {hasTruffles && <Check className="w-4 h-4 text-gold-400" />}
                </button>
              </div>
            </div>

          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="glass-panel p-8 rounded-3xl border border-gold-500/40 space-y-6 shadow-gold-lg">
              
              <div className="relative h-64 rounded-2xl overflow-hidden bg-obsidian-900">
                <img
                  src={selectedPack.image}
                  alt="Custom Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold-500/40 text-gold-300 text-[10px] uppercase font-bold">
                  Live Custom Spec
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif font-bold text-2xl text-pearl-50">
                  Bespoke Arrangement
                </h3>

                <div className="space-y-1 text-xs text-pearl-200/80 font-light">
                  <p><strong>Stems:</strong> {stemCount} ({selectedFlowers.join(', ')})</p>
                  <p><strong>Packaging:</strong> {packaging}</p>
                  <p><strong>Ribbon:</strong> {ribbon}</p>
                  {hasChampagne && <p><strong>Extra:</strong> Dom Pérignon Champagne</p>}
                  {hasTruffles && <p><strong>Extra:</strong> Belgian Truffles Box</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-pearl-400 block uppercase">Real-Time Price</span>
                  <span className="text-3xl font-serif font-bold text-gold-gradient">
                    {formatPrice(totalCustomUSD)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Custom</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
