/**
 * CursorFollower — Performance Edition
 * CSS transition en lugar de RAF loop → 0 CPU extra.
 * Todo se muta con refs → cero re-renders de React en mousemove.
 */
import { useEffect, useRef, useState } from 'react';

export function CursorFollower() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    setEnabled(true);

    let hoveringNow = false;

    const onMove = (e: PointerEvent) => {
      const x = e.clientX, y = e.clientY;
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot)  dot.style.transform  = `translate3d(${x - 4}px,${y - 4}px,0)`;
      if (ring) ring.style.transform = `translate3d(${x - 22}px,${y - 22}px,0)`;

      const el = e.target as HTMLElement | null;
      const isHover = !!el?.closest('a,button,[role="button"],input,textarea,select');
      if (isHover !== hoveringNow) {
        hoveringNow = isHover;
        if (dot)  dot.style.opacity = isHover ? '0' : '1';
        if (ring) {
          ring.style.width  = isHover ? '64px' : '44px';
          ring.style.height = isHover ? '64px' : '44px';
        }
      }
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
          width: '44px', height: '44px',
          borderRadius: '50%',
          border: '1.5px solid rgba(96,165,250,.65)',
          pointerEvents: 'none', zIndex: 9998,
          transition: 'transform 0.18s cubic-bezier(.22,.9,.36,1), width .28s, height .28s',
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
          background: '#F3E5BE',
          pointerEvents: 'none', zIndex: 9999,
          opacity: 1,
          transition: 'opacity .15s',
          willChange: 'transform',
        }}
      />
    </>
  );
}

