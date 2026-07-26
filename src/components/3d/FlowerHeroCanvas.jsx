import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

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
      <Sparkles count={120} scale={6} size={3} speed={0.3} color="#d4af37" opacity={0.6} />
      <Sparkles count={60} scale={4} size={2} speed={0.5} color="#ffffff" opacity={0.5} />
    </group>
  );
}

export default function FlowerHeroCanvas({ preset = 'gold' }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const imageForPreset = {
    gold: '/assets/images/luxury_rose_bouquet_1785002544191.png',
    emerald: '/assets/images/luxury_gift_hamper_1785003431109.png',
    crimson: '/assets/images/eternal_rose_cloche_1785003145770.png',
  }[preset] || '/assets/images/luxury_rose_bouquet_1785002544191.png';

  return (
    <div className="w-full h-[520px] lg:h-[680px] relative rounded-3xl overflow-hidden bg-charcoal-950/40 backdrop-blur-md border border-mutedGold-500/20 shadow-2xl group flex items-center justify-center">
      
      {/* 3D WebGL Canvas Layer */}
      {hasWebGL && (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#fff8e7" />
            <pointLight position={[-5, 4, -5]} intensity={1.5} color="#d4af37" />
            <spotLight position={[0, 8, 0]} intensity={1.8} color="#d4af37" angle={0.8} penumbra={1} />

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

      {/* Floating Center Product Visual Showcase Badge */}
      <div className="relative z-10 pointer-events-none w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center transition-all duration-700">
        <img
          src={imageForPreset}
          alt="Luxury Flower Bouquet"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(212,175,55,0.25)] animate-float scale-100 group-hover:scale-105 transition-transform duration-750"
        />
      </div>

      {/* Interactive Overlay Bottom Badge */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto bg-charcoal-950/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-mutedGold-500/20 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mutedGold-400 animate-ping"></span>
          <span className="text-ivory-100 font-medium tracking-wide">3D Interactive Stage: Drag to Rotate Sparks & Lights</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mutedGold-400 font-serif font-bold">Bloom Studio</span>
        </div>
      </div>

    </div>
  );
}

