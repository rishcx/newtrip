import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 45;
    const connectionDistance = isMobile ? 0 : 120; // skip connections on mobile
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener('resize', debouncedResize);

    const colors = ['#06b6d4', '#ec4899', '#fbbf24', '#22c55e', '#a855f7'];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * 5)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      const delta = timestamp - lastTime;
      if (delta < frameInterval) return;
      lastTime = timestamp - (delta % frameInterval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        const currentSize = p.size * (0.8 + 0.2 * Math.sin(p.pulse));

        // Simple filled circle (no glow on mobile)
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        if (!isMobile) {
          // Glow effect — desktop only
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 3);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.globalAlpha = currentOpacity * 0.3;
          ctx.fill();
        }
      });

      // Connections — desktop only
      if (connectionDistance > 0) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectionDistance * connectionDistance) {
              const dist = Math.sqrt(distSq);
              ctx.globalAlpha = 0.04 * (1 - dist / connectionDistance);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Animated gradient orbs — smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb-1 absolute top-1/4 left-[16%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full blur-[80px] sm:blur-[120px] opacity-20"></div>
        <div className="hero-orb-2 absolute bottom-1/4 right-[16%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full blur-[80px] sm:blur-[120px] opacity-20"></div>
        <div className="hero-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full blur-[60px] sm:blur-[100px] opacity-10"></div>
      </div>

      {/* Very subtle overlay */}
      <div className="absolute inset-0 bg-black/10 z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-5 sm:mb-6 hero-badge">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          <span className="text-cyan-400 text-xs sm:text-sm font-medium tracking-wider uppercase">New Collection Live</span>
        </div>

        <h1 className="hero-title text-[2.5rem] sm:text-6xl lg:text-8xl mt-2 leading-[0.95]">
          <span className="glitch-text" data-text="A GLITCH">A GLITCH</span>
          <span className="block glitch-text-in mt-1.5 sm:mt-2" data-text="in">in</span>
          <span className="block glitch-text text-[2rem] sm:text-5xl lg:text-7xl mt-1.5 sm:mt-2" data-text="THE MATRIX">THE MATRIX</span>
        </h1>

        <p className="text-sm sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-14 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 hero-subtitle mt-6">
          Psychedelic streetwear that bends reality. Where neon dreams meet liquid swirls in wearable art.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-4 hero-buttons">
          <Link
            to="/shop"
            className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-base sm:text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] inline-flex items-center justify-center space-x-2"
          >
            <span className="relative z-10">Explore Collection</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-magenta-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>

          <Link
            to="/about"
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-transparent border-2 border-white/30 text-white font-bold text-base sm:text-lg rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] text-center backdrop-blur-sm"
          >
            Our Story
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-24 grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl mx-auto px-2 sm:px-4 hero-stats">
          <div className="text-center stat-item">
            <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-cyan-400 mb-0.5 sm:mb-2 tabular-nums">500+</div>
            <div className="text-gray-300 text-[10px] sm:text-sm tracking-wide">Trippy Designs</div>
          </div>
          <div className="text-center stat-item" style={{ animationDelay: '0.15s' }}>
            <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-magenta-400 mb-0.5 sm:mb-2 tabular-nums">10K+</div>
            <div className="text-gray-300 text-[10px] sm:text-sm tracking-wide">Happy Vibers</div>
          </div>
          <div className="text-center stat-item" style={{ animationDelay: '0.3s' }}>
            <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-0.5 sm:mb-2 tabular-nums">100%</div>
            <div className="text-gray-300 text-[10px] sm:text-sm tracking-wide">Psychedelic</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 animate-bounce">
          <span className="text-gray-500 text-[10px] sm:text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border-2 border-cyan-400/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-cyan-400 rounded-full scroll-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
