import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ACTS = [
  {
    tag: 'DIAGNOSTICO',
    title: 'Todo empieza con una consulta',
    body: 'El Dr. Minda evalua tu caso con imagenes de ultima generacion. Una radiografia revela lo que el ojo no ve y define el mejor camino.',
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" opacity=".3" />
        <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="2" opacity=".6" />
        <circle cx="40" cy="40" r="8" fill="currentColor" />
        <line x1="40" y1="4" x2="40" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="62" x2="40" y2="76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="40" x2="18" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="62" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    image: '/images/proceso-01-diagnostico.webp',
    accent: '#0F5E52',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(15,94,82,.18) 0%, transparent 65%)',
  },
  {
    tag: 'PLANIFICACION',
    title: 'Cirugia minimamente invasiva',
    body: 'Con artroscopia de ultima generacion, accedemos a la articulacion a traves de incisiones de 5 mm. Sin grandes cortes. Sin grandes cicatrices.',
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <rect x="8" y="28" width="64" height="36" rx="8" stroke="currentColor" strokeWidth="2" opacity=".4" />
        <path d="M8 36h64" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
        <circle cx="24" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="40" cy="50" r="5" fill="currentColor" opacity=".8" />
        <circle cx="56" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M32 16 L40 8 L48 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".6" />
      </svg>
    ),
    image: '/images/proceso-02-planificacion.webp',
    accent: '#14B8A6',
    bg: 'radial-gradient(ellipse at 40% 60%, rgba(20,184,166,.18) 0%, transparent 65%)',
  },
  {
    tag: 'INTERVENCION',
    title: 'Precision en cada movimiento',
    body: 'La tecnologia de imagen intraoperatoria guia cada gesto. El resultado: menos dolor, menos sangrado, recuperacion en semanas, no meses.',
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <path d="M16 64 L38 20 L62 64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
        <path d="M24 50 h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
        <circle cx="40" cy="20" r="4" fill="currentColor" opacity=".9" />
        <path d="M40 28 v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="48" r="2.5" fill="currentColor" />
      </svg>
    ),
    image: '/images/proceso-03-cirugia.webp',
    accent: '#2E966E',
    bg: 'radial-gradient(ellipse at 55% 35%, rgba(46,150,110,.18) 0%, transparent 65%)',
  },
  {
    tag: 'RECUPERACION',
    title: 'De vuelta a tu vida en semanas',
    body: 'Un plan de rehabilitacion personalizado acelera tu recuperacion. El 98% de nuestros pacientes retoma su actividad normal en menos de 3 meses.',
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <path d="M12 44 C20 28, 36 20, 40 36 C44 20, 60 28, 68 44 C68 58, 54 68, 40 72 C26 68, 12 58, 12 44Z" stroke="currentColor" strokeWidth="2" opacity=".5" />
        <path d="M12 44 C20 28, 36 20, 40 36 C44 20, 60 28, 68 44 C68 58, 54 68, 40 72 C26 68, 12 58, 12 44Z" fill="currentColor" opacity=".1" />
        <path d="M28 44 l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    image: '/images/proceso-04-recuperacion.webp',
    accent: '#0F5E52',
    bg: 'radial-gradient(ellipse at 45% 55%, rgba(15,94,82,.20) 0%, transparent 65%)',
  },
];

export function ScrollStory() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLImageElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const tagRef      = useRef<HTMLSpanElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);
  const iconRef     = useRef<HTMLDivElement>(null);
  const accentRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef     = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const actIndexRef = useRef(0);

  useEffect(() => {
    const section  = sectionRef.current;
    const sticky   = stickyRef.current;
    const image    = imageRef.current;
    const overlay  = overlayRef.current;
    const tag      = tagRef.current;
    const title    = titleRef.current;
    const body     = bodyRef.current;
    const icon     = iconRef.current;
    const accent   = accentRef.current;
    const progress = progressRef.current;
    const dots     = dotsRef.current;
    if (!section || !sticky || !image || !overlay || !tag || !title || !body || !icon || !accent || !progress || !dots) return;

    const act0 = ACTS[0];
    tag.textContent     = act0.tag;
    title.textContent   = act0.title;
    body.textContent    = act0.body;
    image.src           = act0.image;
    accent.style.background = act0.bg;

    const goToAct = (idx: number, instant = false) => {
      const act = ACTS[idx];
      actIndexRef.current = idx;
      // Actualizar contador
      if (counterRef.current)
        counterRef.current.textContent = `${String(idx + 1).padStart(2,'0')} / ${String(ACTS.length).padStart(2,'0')}`;
      const dur = instant ? 0 : 0.4;
      const ease = 'power2.out';
      // Cancelar animaciones en curso antes de iniciar nuevas
      gsap.killTweensOf([tag, title, body, image]);
      if (instant) {
        tag.textContent   = act.tag;
        title.textContent = act.title;
        body.textContent  = act.body;
        image.src         = act.image;
        gsap.set([tag, title, body, image], { opacity: 1, y: 0, scale: 1 });
      } else {
        gsap.to([tag, title, body], { opacity: 0, y: -10, duration: dur * 0.4, ease, onComplete: () => {
          tag.textContent   = act.tag;
          title.textContent = act.title;
          body.textContent  = act.body;
          gsap.to([tag, title, body], { opacity: 1, y: 0, duration: dur, ease });
        }});
        gsap.to(image, { opacity: 0, scale: 0.97, duration: dur * 0.5, ease, onComplete: () => {
          image.src = act.image;
          gsap.to(image, { opacity: 1, scale: 1, duration: dur, ease });
        }});
      }
      gsap.to(accent, { background: act.bg, duration: instant ? 0 : dur * 2, ease });
      dots.querySelectorAll('[data-dot]').forEach((d, i) => {
        (d as HTMLElement).style.opacity = i === idx ? '1' : '0.3';
        (d as HTMLElement).style.transform = i === idx ? 'scale(1.4)' : 'scale(1)';
      });
      if (progress)
        progress.style.width = `${((idx + 1) / ACTS.length) * 100}%`;
    };

    goToAct(0, true);

    // Usar scroll listener nativo — funciona con Lenis porque Lenis
    // dispara eventos de scroll en el window con la posición real.
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      // Progreso: 0 cuando top llega a 0, 1 cuando bottom llega a viewH
      const scrolled = -rect.top;                   // píxeles scrolleados dentro de la sección
      const scrollable = sectionH - viewH;          // total scrollable dentro de la sección
      const p = Math.max(0, Math.min(1, scrolled / Math.max(1, scrollable)));
      const idx = Math.min(ACTS.length - 1, Math.floor(p * ACTS.length));
      if (idx !== actIndexRef.current) goToAct(idx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Disparo inicial por si ya hay scroll
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const act0 = ACTS[0];

  return (
    <div ref={sectionRef} id="proceso" style={{ height: '400vh', position: 'relative' }}>
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(7,11,24,.85)', overflow: 'hidden' }}>

        {/* Fondo de acento */}
        <div ref={accentRef} style={{ position: 'absolute', inset: 0, transition: 'background 0.8s ease', pointerEvents: 'none' }} />

        <div className="max-w-6xl mx-auto px-6 w-full" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(32px,5vw,64px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* Columna de texto */}
          <div>
            {/* Dots indicadores */}
            <div ref={dotsRef} className="flex gap-2 mb-6">
              {ACTS.map((_, i) => (
                <span key={i} data-dot style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                  background: '#fff', opacity: i === 0 ? 1 : 0.3, transition: 'all .4s', transform: i === 0 ? 'scale(1.4)' : 'scale(1)' }} />
              ))}
            </div>

            {/* Tag */}
            <span ref={tagRef} style={{ display: 'block', fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px',
              letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: '16px' }}>
              {act0.tag}
            </span>

            {/* Titulo */}
            <h2 ref={titleRef} style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, lineHeight: 1.12,
              letterSpacing: '-.01em', color: '#fff', margin: '0 0 20px' }}>
              {act0.title}
            </h2>

            {/* Cuerpo */}
            <p ref={bodyRef} style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,.62)', margin: '0 0 32px', maxWidth: '34em' }}>
              {act0.body}
            </p>

            {/* Icono */}
            <div ref={iconRef} style={{ color: 'rgba(255,255,255,.55)' }}>
              {act0.icon}
            </div>
          </div>

          {/* Columna de imagen */}
          <div style={{ position: 'relative' }}>
            {/* Barra de progreso */}
            <div style={{ position: 'absolute', top: '-12px', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,.1)', borderRadius: '1px' }}>
              <div ref={progressRef} style={{ height: '100%', background: '#3B82F6', borderRadius: '1px', width: '25%', transition: 'width .5s ease' }} />
            </div>

            {/* Contador */}
            <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 3,
              fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'rgba(255,255,255,.55)',
              background: 'rgba(30, 30, 30, 0.85)', padding: '4px 10px', borderRadius: '6px' }}>
              <span ref={counterRef}>01 / {String(ACTS.length).padStart(2,'0')}</span>
            </div>

            {/* Overlay decorativo */}
            <div ref={overlayRef} style={{ position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none', zIndex: 0 }} />

            <img
              loading="lazy"
              ref={imageRef}
              src={act0.image}
              alt="Proceso medico"
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '20px', display: 'block',
                willChange: 'transform, opacity', boxShadow: '0 40px 80px -20px rgba(0,0,0,.5)', position: 'relative', zIndex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}