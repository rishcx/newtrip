import React, { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef(null);
  const trailRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = glowRef.current;
    const trail = trailRef.current;
    if (!glow || !trail) return;

    let rafId;
    let trailX = 0, trailY = 0;

    const handleMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        glow.style.opacity = '1';
        trail.style.opacity = '1';
      }
      glow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    };

    const handleLeave = () => {
      visible.current = false;
      glow.style.opacity = '0';
      trail.style.opacity = '0';
    };

    const animateTrail = () => {
      trailX += (pos.current.x - trailX) * 0.08;
      trailY += (pos.current.y - trailY) * 0.08;
      trail.style.transform = `translate(${trailX - 200}px, ${trailY - 200}px)`;
      rafId = requestAnimationFrame(animateTrail);
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    rafId = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] opacity-0 transition-opacity duration-300"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[9997] opacity-0 transition-opacity duration-500"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, rgba(251,191,36,0.03) 40%, transparent 70%)',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CursorGlow;
