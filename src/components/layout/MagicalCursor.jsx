import React, { useEffect, useRef } from 'react';

/**
 * MagicalCursor — Particles-only cursor effect.
 * No custom cursor image. Just beautiful flowing sparkle trails,
 * click bursts, and idle orbiting particles following the default cursor.
 */
export default function MagicalCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let targetX = -100, targetY = -100;
    let currentX = -100, currentY = -100;
    let prevX = -100, prevY = -100;
    let lastMoveTime = 0;
    const particles = [];
    let lastTrailTime = 0;
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      lastMoveTime = performance.now();
    };

    const onMouseDown = () => {
      spawnBurst(currentX, currentY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    // Colour palettes
    const trailColors = ['#c084fc', '#a855f7', '#818cf8', '#6366f1', '#e9d5ff', '#ffffff'];
    const burstColors = ['#fbbf24', '#f59e0b', '#fef3c7', '#ffffff', '#e9d5ff', '#c084fc', '#e879f9'];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Trail sparkles while moving
    function spawnTrail(x, y, count) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9 - 0.35,
          life: 1,
          decay: 0.014 + Math.random() * 0.014,
          size: 1.2 + Math.random() * 2.5,
          color: pick(trailColors),
          type: 'trail',
        });
      }
    }

    // Radial burst on click
    function spawnBurst(x, y) {
      for (let i = 0; i < 26; i++) {
        const angle = (Math.PI * 2 * i) / 26 + (Math.random() - 0.5) * 0.35;
        const speed = 1.8 + Math.random() * 4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.017 + Math.random() * 0.015,
          size: 1.5 + Math.random() * 3,
          color: pick(burstColors),
          type: 'star',
        });
      }
      // Expanding rings
      particles.push(
        { x, y, vx: 0, vy: 0, life: 1, decay: 0.025, size: 4, color: '#a855f7', type: 'ring' },
        { x, y, vx: 0, vy: 0, life: 1, decay: 0.035, size: 2, color: '#818cf8', type: 'ring' },
      );
    }

    // Idle orbiting sparkles
    function spawnOrbit() {
      particles.push({
        x: 0, y: 0, vx: 0, vy: 0,
        life: 1,
        decay: 0.005,
        size: 1 + Math.random() * 1.5,
        color: pick(trailColors),
        type: 'orbit',
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 15 + Math.random() * 15,
        orbitSpeed: (0.02 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // 4-point star shape
    function drawStar(cx, cy, r) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? r * 1.5 : r * 0.5;
        const a = (Math.PI * i) / 4 - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      }
      ctx.closePath();
    }

    // 60fps animation loop
    function animate(timestamp) {
      animId = requestAnimationFrame(animate);
      const now = timestamp || 0;

      // Smooth easing
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      const speed = Math.hypot(currentX - prevX, currentY - prevY);
      const isIdle = (now - lastMoveTime) > 500;

      // Trail while moving
      if (speed > 1.2) {
        if (now - lastTrailTime > 35) {
          spawnTrail(currentX, currentY, 1);
          lastTrailTime = now;
        }
      }

      // Orbit while idle
      if (isIdle) {
        const orbitCount = particles.filter(p => p.type === 'orbit').length;
        if (orbitCount < 5 && Math.random() < 0.06) {
          spawnOrbit();
        }
      }

      // Scatter orbits when mouse moves
      if (!isIdle && speed > 1) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          if (p.type === 'orbit') {
            p.type = 'trail';
            p.x = currentX + Math.cos(p.orbitAngle) * p.orbitRadius;
            p.y = currentY + Math.sin(p.orbitAngle) * p.orbitRadius;
            p.vx = Math.cos(p.orbitAngle) * 1.3;
            p.vy = Math.sin(p.orbitAngle) * 1.3;
            p.decay = 0.03;
          }
        }
      }

      prevX = currentX;
      prevY = currentY;

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        if (p.type === 'ring') {
          const radius = (1 - p.life) * 50 + p.size;
          ctx.save();
          ctx.globalAlpha = p.life * 0.35;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2 * p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

        } else if (p.type === 'orbit') {
          p.orbitAngle += p.orbitSpeed;
          const ox = currentX + Math.cos(p.orbitAngle) * p.orbitRadius;
          const oy = currentY + Math.sin(p.orbitAngle) * p.orbitRadius;
          const size = p.size * p.life;

          // Glow
          ctx.save();
          ctx.globalAlpha = p.life * 0.3;
          const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, size * 4);
          g.addColorStop(0, p.color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(ox, oy, size * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Dot
          ctx.save();
          ctx.globalAlpha = p.life * 0.8;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(ox, oy, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else {
          // Trail / burst
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.984;
          p.vy *= 0.984;
          const size = p.size * (0.3 + p.life * 0.7);

          // Glow
          ctx.save();
          ctx.globalAlpha = p.life * 0.22;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
          g.addColorStop(0, p.color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Core
          ctx.save();
          ctx.globalAlpha = p.life * 0.9;
          ctx.fillStyle = p.color;
          if (p.type === 'star') {
            drawStar(p.x, p.y, size);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (particles.length > 180) particles.splice(0, particles.length - 180);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99998,
      }}
    />
  );
}
