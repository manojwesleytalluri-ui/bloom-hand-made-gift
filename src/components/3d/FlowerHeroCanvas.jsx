import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles as SparklesIcon, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Carousel Items data matching public/assets/images
const CAROUSEL_ITEMS = [
  {
    id: 'bouq-7', // unique id for active image shown in user screenshot
    name: 'Royal Eclipse Ecuadorian Gold Roses',
    tagline: 'Signature Bestseller Ecuadorian Blooms in Velvet wrap with Gold Accents',
    priceUSD: 450,
    image: '/assets/images/luxury_rose_bouquet_1785002544191.png',
    preset: 'gold',
  },
  {
    id: 'bouq-1',
    name: 'The Sovereign Imperial Red Velvet Roses',
    tagline: '100 Ecuadorian Grand Roses in Signature Black Velvet Box & 24K Gold Trim',
    priceUSD: 450,
    image: '/assets/images/sovereign_red_roses_1785005575575.png',
    preset: 'crimson',
  },
  {
    id: 'bouq-4',
    name: 'The Dior Grand Gala Champagne & Flowers Hamper',
    tagline: 'Vintage Dom Pérignon Champagne, Belgian Gold Truffles & Black Orchids',
    priceUSD: 1200,
    image: '/assets/images/luxury_gift_hamper_1785003431109.png',
    preset: 'emerald',
  },
  {
    id: 'bouq-3',
    name: 'L’Éternel Preserved Crimson Rose Cloche',
    tagline: 'Real Ecuadorian Rose Preserved for 5+ Years under Crystal Glass Cloche',
    priceUSD: 320,
    image: '/assets/images/eternal_rose_cloche_1785003145770.png',
    preset: 'crimson',
  },
  {
    id: 'bouq-2',
    name: 'Royal Palais Bridal Orchid & Peony Cascade',
    tagline: 'Rare White Orchids, Plush French Peonies & Gold Leafed Eucalyptus Stems',
    priceUSD: 680,
    image: '/assets/images/royal_bridal_orchids_1785005589455.png',
    preset: 'emerald',
  },
  {
    id: 'bouq-5',
    name: 'Monaco Sunburst Golden Tulips & Cashmere Silk',
    tagline: '50 Rare Golden Dutch Tulips with Hand-Tied Italian Gold Silk Ribbon',
    priceUSD: 390,
    image: '/assets/images/monaco_golden_tulips.png',
    preset: 'gold',
  },
  {
    id: 'bouq-6',
    name: 'Versailles Diamond White Hydrangea & Calla Lily',
    tagline: 'Architectural Floral Sculpture for Presidential Suites & Luxury Estates',
    priceUSD: 850,
    image: '/assets/images/versailles_white_hydrangeas.png',
    preset: 'gold',
  },
  {
    id: 'bouq-8', // unique id for remaining wedding bouquet asset
    name: 'Royal Romance Bridal Rose Bouquet',
    tagline: 'Premium Ivory Roses with Hand-Tied Satin Ribbon Cascade & Gold Accents',
    priceUSD: 580,
    image: '/assets/images/royal_wedding_bouquet_1785002559950.png',
    preset: 'gold',
  }
];

// A realistic, soft organic floating petal component
function FloatingPetal({ color, position, speedMultiplier = 1 }) {
  const meshRef = useRef();
  const [initialRot] = useState(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ]);
  const [wobbleSpeed] = useState(() => 0.5 + Math.random() * 0.5);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = initialRot[0] + time * 0.1 * speedMultiplier;
      meshRef.current.rotation.y = initialRot[1] + time * 0.15 * speedMultiplier;
      meshRef.current.position.y = position[1] + Math.sin(time * wobbleSpeed) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={[0.15, 0.25, 0.03]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Particle stage with floating elements
function Scene3DArrangement({ preset = 'gold' }) {
  const groupRef = useRef();

  const colors = {
    gold: ['#d4af37', '#f3e5ab', '#b8860b'],
    emerald: ['#1c8266', '#d4af37', '#062c22'],
    crimson: ['#991b1b', '#e11d48', '#f43f5e'],
  }[preset] || ['#d4af37', '#f3e5ab', '#b8860b'];

  const sparkColor = {
    gold: '#d4af37',
    emerald: '#34d399',
    crimson: '#f43f5e',
  }[preset] || '#d4af37';

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Floating petals coordinates
  const petalPositions = [
    { pos: [-1.5, 1, -1], col: colors[0] },
    { pos: [1.8, 0.5, -2], col: colors[1] },
    { pos: [-1.2, -1, 1], col: colors[2] },
    { pos: [1.4, -1.2, -0.5], col: colors[0] },
    { pos: [0, 1.6, -1.5], col: colors[1] },
  ];

  return (
    <group ref={groupRef}>
      {/* Floating Petals */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {petalPositions.map((p, i) => (
          <FloatingPetal key={i} color={p.col} position={p.pos} speedMultiplier={1 + i * 0.2} />
        ))}
      </Float>

      {/* Floating Golden Dust Particles */}
      <Sparkles count={120} scale={6} size={3} speed={0.3} color={sparkColor} opacity={0.6} />
      <Sparkles count={60} scale={4} size={2} speed={0.5} color="#ffffff" opacity={0.5} />
    </group>
  );
}

export default function FlowerHeroCanvas({ preset = 'gold', setPreset }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const toggleSound = () => setIsPlayingSound(!isPlayingSound);
  const { formatPrice, addToCart } = useApp();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  // Sync internal activeIndex when parent's preset changes from outside button triggers
  useEffect(() => {
    // Find first item matching parent's preset
    const matchingIndex = CAROUSEL_ITEMS.findIndex(item => item.preset === preset);
    if (matchingIndex !== -1 && matchingIndex !== activeIndex) {
      // Determine movement direction for visual transition
      setDirection(matchingIndex > activeIndex ? 1 : -1);
      setActiveIndex(matchingIndex);
    }
  }, [preset]);

  const handleNext = () => {
    setDirection(1);
    const nextIndex = (activeIndex + 1) % CAROUSEL_ITEMS.length;
    setActiveIndex(nextIndex);
    // Sync back to parent preset state
    if (setPreset) {
      setPreset(CAROUSEL_ITEMS[nextIndex].preset);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    const prevIndex = (activeIndex - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length;
    setActiveIndex(prevIndex);
    // Sync back to parent preset state
    if (setPreset) {
      setPreset(CAROUSEL_ITEMS[prevIndex].preset);
    }
  };

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    if (setPreset) {
      setPreset(CAROUSEL_ITEMS[index].preset);
    }
  };

  const currentItem = CAROUSEL_ITEMS[activeIndex];

  // Colors for drop-shadow glow based on active item preset
  const glowShadowStyle = {
    gold: 'drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)]',
    emerald: 'drop-shadow-[0_20px_50px_rgba(16,185,129,0.25)]',
    crimson: 'drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)]',
  }[currentItem.preset] || 'drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)]';

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  return (
    <div className="w-full h-[340px] sm:h-[500px] lg:h-[680px] relative rounded-3xl overflow-hidden bg-charcoal-950/40 backdrop-blur-md border border-mutedGold-500/20 shadow-2xl group flex flex-col justify-between p-6 sm:p-8 select-none">
      
      {/* Lighting Preset Selector Controls */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 bg-obsidian-950/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-gold-500/30">
        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gold-400 px-1.5 sm:px-2">3D Aura:</span>
        <button
          onClick={() => setPreset('gold')}
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-medium transition-all ${
            preset === 'gold' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-pearl-300 hover:text-gold-300'
          }`}
        >
          Gold
        </button>
        <button
          onClick={() => setPreset('emerald')}
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-medium transition-all ${
            preset === 'emerald' ? 'bg-emerald-700 text-pearl-50 font-bold' : 'text-pearl-300 hover:text-gold-300'
          }`}
        >
          Emerald
        </button>
        <button
          onClick={() => setPreset('crimson')}
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-medium transition-all ${
            preset === 'crimson' ? 'bg-red-900 text-pearl-50 font-bold' : 'text-pearl-300 hover:text-gold-300'
          }`}
        >
          Crimson
        </button>
      </div>

      {/* Audio Ambience Toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-obsidian-950/90 backdrop-blur-md border border-gold-500/30 text-gold-400 hover:text-pearl-100 transition-colors"
        title="Toggle Luxury Ambient Sound"
      >
        {isPlayingSound ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pearl-400" />}
      </button>

      {/* 3D WebGL Canvas Layer (Background environment) */}
      {hasWebGL && (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={2} 
              color={preset === 'crimson' ? '#ffebee' : preset === 'emerald' ? '#e6f4ea' : '#fff8e7'} 
            />
            <pointLight position={[-5, 4, -5]} intensity={1.5} color={preset === 'crimson' ? '#f43f5e' : preset === 'emerald' ? '#34d399' : '#d4af37'} />
            <spotLight position={[0, 8, 0]} intensity={1.8} color={preset === 'crimson' ? '#f43f5e' : preset === 'emerald' ? '#34d399' : '#d4af37'} angle={0.8} penumbra={1} />

            <Scene3DArrangement preset={preset} />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={Math.PI / 3}
              rotateSpeed={0.4}
            />
          </Canvas>
        </div>
      )}

      {/* Top Tagline Indicator */}
      <div className="relative z-10 w-full flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-mutedGold-400 mt-10 sm:mt-8">
        <div className="flex items-center gap-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-mutedGold-400 animate-pulse" />
          <span>Interactive Art Stage</span>
        </div>
        <div>
          <span>Slide {activeIndex + 1} of {CAROUSEL_ITEMS.length}</span>
        </div>
      </div>

      {/* Main Image Slider Layer */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center">
        <div className="relative w-44 h-44 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, { offset, velocity }) => {
                const swipeThreshold = 50;
                if (offset.x < -swipeThreshold) {
                  handleNext();
                } else if (offset.x > swipeThreshold) {
                  handlePrev();
                }
              }}
              className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
            >
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className={`w-full h-full object-contain filter ${glowShadowStyle} animate-float select-none`}
                draggable="false"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left/Right Arrow Navigation Overlays */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-[40%] -translate-y-1/2 z-20 pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-mutedGold-500/20 bg-charcoal-950/40 backdrop-blur-md text-mutedGold-400 hover:text-pearl-50 hover:bg-mutedGold-500/10 hover:scale-110 active:scale-95 transition-all shadow-md animate-fade-in"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-[40%] -translate-y-1/2 z-20 pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-mutedGold-500/20 bg-charcoal-950/40 backdrop-blur-md text-mutedGold-400 hover:text-pearl-50 hover:bg-mutedGold-500/10 hover:scale-110 active:scale-95 transition-all shadow-md animate-fade-in"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slider Pagination Dots (Above details, below image) */}
      <div className="relative z-20 flex justify-center items-center gap-2 mb-2 pointer-events-auto">
        {CAROUSEL_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handleDotClick(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-6 bg-gold-400'
                : 'w-1.5 bg-mutedGold-500/40 hover:bg-mutedGold-400/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Product Details & Order Banner */}
      <div className="relative z-10 w-full bg-charcoal-950/70 border border-mutedGold-500/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center shadow-lg gap-2 pointer-events-auto">
        
        {/* Dynamic Details Fade Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <h3 className="font-serif text-base sm:text-lg font-bold text-gold-gradient tracking-wide mb-1 leading-snug">
              {currentItem.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-pearl-300/80 line-clamp-1 max-w-sm sm:max-w-md mb-3 font-light leading-relaxed">
              {currentItem.tagline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Action Button & Price Display */}
        <div className="w-full flex items-center justify-between gap-4 pt-1 border-t border-mutedGold-500/10">
          <div className="text-left">
            <span className="block text-[8px] uppercase tracking-widest text-pearl-400 font-bold">Price</span>
            <span className="font-serif text-sm sm:text-base font-bold text-gold-400">
              {formatPrice ? formatPrice(currentItem.priceUSD) : `$${currentItem.priceUSD}`}
            </span>
          </div>

          <button
            onClick={() => addToCart({
              id: currentItem.id,
              name: currentItem.name,
              priceUSD: currentItem.priceUSD,
              image: currentItem.image,
              category: 'Featured'
            })}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gold-gradient text-obsidian-950 hover:scale-105 active:scale-95 transition-all text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:shadow-gold-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-obsidian-950" />
            <span>Order Now</span>
          </button>
        </div>

      </div>

    </div>
  );
}
