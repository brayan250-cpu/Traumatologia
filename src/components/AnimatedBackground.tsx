/**
 * AnimatedBackground — Performance Edition
 * 30fps cap · 45 stars · 3 orbs · sin aurora · sin spotlight de canvas
 * El spotlight lo hace el CursorFollower via CSS (sin RAF extra).
 */
import { useEffect, useRef } from 'react';

interface Stage {
  base:   [number, number, number];
  core:   [number, number, number];
  accent: [number, number, number];
}

const STAGES: Stage[] = [
  { base: [3,   8,  14], core: [0,  230, 180], accent: [108, 99, 255] },
  { base: [5,   5,  18], core: [108, 99, 255],  accent: [0,  200, 255] },
  { base: [14,  8,   4], core: [255, 120,  60], accent: [0,  200, 160] },
  { base: [3,   6,  20], core: [40,  160, 255], accent: [130, 80, 255] },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}
function lerpStage(a: Stage, b: Stage, t: number): Stage {
  return {
    base:   [lerp(a.base[0], b.base[0], t), lerp(a.base[1], b.base[1], t), lerp(a.base[2], b.base[2], t)],
    core:   [lerp(a.core[0], b.core[0], t), lerp(a.core[1], b.core[1], t), lerp(a.core[2], b.core[2], t)],
    accent: [lerp(a.accent[0], b.accent[0], t), lerp(a.accent[1], b.accent[1], t), lerp(a.accent[2], b.accent[2], t)],
  };
}

/* 45 partículas (era 160) */
interface Star { x: number; y: number; r: number; speed: number; phase: number; opacity: number; }
const STARS: Star[] = Array.from({ length: 45 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.4 + 0.2,
  speed: Math.random() * 0.00006 + 0.00002,
  phase: Math.random() * Math.PI * 2,
  opacity: Math.random() * 0.5 + 0.1,
}));

/* 3 orbs (era 6) */
interface Orb { x: number; y: number; r: number; sX: number; sY: number; pX: number; pY: number; isAccent: boolean; }
const ORBS: Orb[] = Array.from({ length: 3 }, (_, i) => ({
  x: 0.15 + i * 0.35, y: 0.2 + (i % 2) * 0.5,
  r: 0.28 + (i % 2) * 0.06,
  sX: 0.00014 + i * 0.00007, sY: 0.00018 + i * 0.00009,
  pX: i * 1.5, pY: i * 2.2,
  isAccent: i % 2 === 1,
}));

interface Props { scrollProgress: number }

export function AnimatedBackground({ scrollProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const progRef   = useRef(0);

  useEffect(() => { progRef.current = scrollProgress; }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false })!;

    /* Escala al 75% en mobile para reducir pixels dibujados */
    const dpr = Math.min(window.devicePixelRatio, 2) * (window.innerWidth < 768 ? 0.6 : 0.85);

    const resize = () => {
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let t = 0;
    let frame = 0;
    const SKIP = 2; // dibuja cada 2 frames → 30fps en pantallas de 60Hz

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      frame++;
      if (frame % SKIP !== 0) return; // ← 30fps cap

      const W = window.innerWidth;
      const H = window.innerHeight;
      t += SKIP; // avanzar t al mismo ritmo visual

      const raw   = progRef.current;
      const iA    = Math.min(Math.floor(raw), STAGES.length - 2);
      const stage = lerpStage(STAGES[iA], STAGES[iA + 1], raw - iA);
      const [br, bg, bb] = stage.base;
      const [cr, cg, cb] = stage.core;
      const [ar, ag, ab] = stage.accent;

      /* 1 · Fondo sólido */
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgb(${Math.round(br)},${Math.round(bg)},${Math.round(bb)})`;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'lighter';

      /* 2 · Partículas */
      STARS.forEach(s => {
        s.y -= s.speed;
        if (s.y < -0.005) { s.y = 1.005; s.x = Math.random(); }
        const pulse = s.opacity * (0.5 + 0.5 * Math.sin(t * 0.012 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${pulse * 0.7})`;
        ctx.fill();
      });

      /* 3 · Orbs flotantes (3) */
      const maxDim = Math.max(W, H);
      ORBS.forEach(orb => {
        const ox = (orb.x + Math.sin(t * orb.sX + orb.pX) * 0.12) * W;
        const oy = (orb.y + Math.cos(t * orb.sY + orb.pY) * 0.09) * H;
        const radius = orb.r * maxDim;
        const [r2, g2, b2] = orb.isAccent ? [ar, ag, ab] : [cr, cg, cb];
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
        g.addColorStop(0,   `rgba(${Math.round(r2)},${Math.round(g2)},${Math.round(b2)},0.28)`);
        g.addColorStop(0.5, `rgba(${Math.round(r2)},${Math.round(g2)},${Math.round(b2)},0.07)`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      /* 4 · Orb central */
      const orbX = W * (0.5 + Math.sin(t * 0.004) * 0.05);
      const orbY = H * (0.44 + Math.cos(t * 0.003) * 0.04);
      const coreG = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, maxDim * 0.55);
      coreG.addColorStop(0,    `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},0.18)`);
      coreG.addColorStop(0.35, `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},0.07)`);
      coreG.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = coreG;
      ctx.fillRect(0, 0, W, H);

      /* 5 · Viñeta */
      ctx.globalCompositeOperation = 'source-over';
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.15, W * 0.5, H * 0.5, W * 0.88);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    };

    // Esperar al primer frame pintado antes de arrancar el loop
    // Esto evita que el canvas compita con el primer render de React
    let startTimeout: ReturnType<typeof setTimeout>;
    startTimeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(draw);
    }, 80);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }}
    />
  );
}
