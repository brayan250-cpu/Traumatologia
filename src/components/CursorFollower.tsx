/**
 * CursorFollower — Performance Edition
 * CSS transition en lugar de RAF loop → 0 CPU extra.
 * El dot usa transform directo en pointermove.
 * El ring usa transition .2s para el efecto lag.
 */
import { useEffect, useRef, useState } from 'react';

export function CursorFollower() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled,  setEnabled]  = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      const x = e.clientX, y = e.clientY;

      /* Dot: sin transición → instantáneo */
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${x - 4}px,${y - 4}px,0)`;

      /* Ring: con transition CSS → efecto lag sin RAF */
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${x - 22}px,${y - 22}px,0)`;

      const el = e.target as HTMLElement | null;
      setHovering(!!el?.closest('a,button,[role="button"],input,textarea,select'));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: hovering ? '64px' : '44px',
          height: hovering ? '64px' : '44px',
          marginLeft: hovering ? '-10px' : '0',
          marginTop:  hovering ? '-10px' : '0',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,.55)',
          pointerEvents: 'none', zIndex: 9998,
          /* lag via CSS transition */
          transition: 'transform 0.18s cubic-bezier(.22,.9,.36,1), width .28s, height .28s, margin .28s',
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none', zIndex: 9999,
          opacity: hovering ? 0 : 1,
          transition: 'opacity .15s',
          willChange: 'transform',
        }}
      />
    </>
  );
}

