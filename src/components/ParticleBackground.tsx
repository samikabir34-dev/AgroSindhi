import { useEffect, useRef } from 'react';

/**
 * ParticleBackground — exact replica of sindhilanguage.org canvas animation
 *
 * Renders floating Sindhi Arabic letters that drift around the screen and
 * connect to nearby letters with thin glowing lines (neural-network style).
 * Accent color is read from the CSS variable --accent-cyan at runtime so it
 * respects any theme changes automatically.
 */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Full Sindhi alphabet set — same as sindhilanguage.org
    const letters =
      'ا ب ٻ ڀ ت ٿ ٽ ٺ پ ج ڄ چ ڇ ح خ د ڌ ڏ ڊ ڍ ر ڙ ز س ش ص ض ط ظ ع غ ف ق ڪ ک گ ڳ ل م ن ڻ و ھ ء ي'.split(
        ' '
      );

    let w = 0;
    let h = 0;
    let dpr = 1;
    let animationFrameId: number;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      l: string;
    }

    let particles: Particle[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';

      const count = Math.min(110, Math.floor(window.innerWidth / 10));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28 * dpr,
        vy: (Math.random() - 0.5) * 0.28 * dpr,
        r: (Math.random() * 2 + 1) * dpr,
        l: letters[Math.floor(Math.random() * letters.length)],
      }));
    };

    const getColor = () => {
      const c = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-cyan')
        .trim();
      return c || '#55e6ff';
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${16 * dpr}px AMBILE, "Noto Sans Arabic", Tahoma, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const color = getColor();

      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Draw letter
        ctx.globalAlpha = 0.62;
        ctx.fillStyle = color;
        ctx.fillText(p.l, p.x, p.y);

        // Draw connecting lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          const threshold = 130 * dpr;
          if (dist < threshold) {
            ctx.globalAlpha = (1 - dist / threshold) * 0.18;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    resize();
    tick();

    window.addEventListener('resize', resize, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.5 }}
    />
  );
};

export default ParticleBackground;
