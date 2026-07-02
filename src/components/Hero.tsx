import { useEffect, useRef } from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { gsap } from 'gsap';
import { clinicInfo, doctorInfo } from '../services/api';

interface HeroProps {
  onBookAppointment: () => void;
}

export function Hero({ onBookAppointment }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal on mount — clip from below
      gsap.fromTo('.hero-reveal', {
        y: 60,
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
      }, {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.2,
      });

      gsap.fromTo('.hero-badge', {
        opacity: 0,
        y: -18,
        scale: 0.94,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'back.out(1.4)',
        delay: 0.1,
      });

      gsap.fromTo('.hero-photo', {
        opacity: 0,
        x: 40,
        scale: 0.96,
      }, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.3,
        ease: 'power3.out',
        delay: 0.35,
      });

      gsap.fromTo('.hero-scroll-cue', {
        opacity: 0,
        y: 12,
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 1.2,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden text-white" style={{ background: 'transparent', padding: 'clamp(130px,13vw,180px) 0 0' }}>

      {/* Decorative rings */}
      <div className="absolute pointer-events-none" style={{ top: '-180px', left: '-140px', width: '580px', height: '580px', borderRadius: '50%', border: '1px solid rgba(96,165,250,.12)', background: 'radial-gradient(circle, rgba(96,165,250,.05) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-200px', right: '-120px', width: '640px', height: '640px', borderRadius: '50%', border: '1px solid rgba(20,184,166,.1)', background: 'radial-gradient(circle, rgba(20,184,166,.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 'clamp(40px,5vw,72px)', alignItems: 'center' }}>
        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(96,165,250,.12)', border: '1px solid rgba(96,165,250,.35)' }}>
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="animate-ping absolute w-2 h-2 rounded-full opacity-60" style={{ background: '#60A5FA' }}></span>
              <span className="w-2 h-2 rounded-full flex-none" style={{ background: '#60A5FA' }}></span>
            </span>
            <span style={{ color: 'rgba(255,255,255,.85)' }}>Citas disponibles esta semana</span>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <p className="hero-reveal font-mono-mc text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: '.24em', color: 'rgba(96,165,250,.7)' }}>
              Traumatología &amp; Ortopedia · Lima
            </p>
          </div>

          {/* Gradient headline */}
          <div style={{ overflow: 'hidden' }}>
            <h1 className="hero-reveal font-bold mb-6 gradient-text-hero" style={{ fontSize: 'clamp(50px,7vw,94px)', letterSpacing: '-.01em', lineHeight: '1.02' }}>
              Vuelve a<br />moverte<br /><em style={{ fontStyle: 'italic' }}>sin dolor.</em>
            </h1>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <p className="hero-reveal mb-8 font-light" style={{ fontSize: 'clamp(17px,1.5vw,20px)', lineHeight: '1.5', color: 'rgba(255,255,255,.68)', maxWidth: '30em' }}>
              Especialistas en regeneración articular, cirugía mínimamente invasiva y recuperación funcional — con la precisión del Dr. Carlos Minda Rojas.
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-reveal flex flex-wrap gap-4 mb-8">
            <button
              onClick={onBookAppointment}
              className="inline-flex items-center gap-3 font-semibold rounded-[14px] transition-all hover:-translate-y-0.5 hover:brightness-110"
              style={{ padding: '16px 30px', background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 55%, #1D4ED8 100%)', color: '#ffffff', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px -16px rgba(59,130,246,.5)' }}
            >
              Reservar Cita
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={`tel:${clinicInfo.phone}`}
              className="inline-flex items-center gap-3 font-medium text-white rounded-[14px] transition-all hover:bg-white/15"
              style={{ padding: '16px 28px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)', fontSize: '16px', textDecoration: 'none' }}
            >
              <Phone className="w-5 h-5" />
              {clinicInfo.phone}
            </a>
          </div>

          <div className="hero-reveal flex flex-wrap gap-6 text-sm" style={{ color: 'rgba(255,255,255,.55)' }}>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{clinicInfo.hours}</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{clinicInfo.address}</span>
          </div>
        </div>

        {/* Right — Doctor photo */}
        <div className="hero-photo relative justify-self-center w-full" style={{ maxWidth: '440px' }}>
          {/* Glowing border frame */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(96,165,250,.28), rgba(37,99,235,.22), rgba(20,184,166,.18))', borderRadius: '28px', transform: 'scale(1.02)', zIndex: 0 }} />
          <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5', boxShadow: '0 40px 80px -30px rgba(0,0,0,.7)', border: '1px solid rgba(255,255,255,.1)', zIndex: 1 }}>
            <img src={doctorInfo.photo} alt={doctorInfo.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(7,11,26,.7))' }} />
          </div>

          {/* Rating badge */}
          <div className="absolute flex items-center gap-3 rounded-[15px]" style={{ top: '18px', left: '-14px', padding: '13px 17px', background: 'rgba(255,255,255,.95)', boxShadow: '0 20px 40px -14px rgba(0,0,0,.35)', zIndex: 2 }}>
            <svg viewBox="0 0 24 24" fill="#60A5FA" style={{ width: '16px', height: '16px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <div style={{ lineHeight: '1.1' }}>
              <div className="font-extrabold text-[#14201D]" style={{ fontSize: '17px' }}>{doctorInfo.rating}</div>
              <div style={{ fontSize: '11px', color: 'rgba(20,32,29,.5)' }}>{doctorInfo.reviews} reseñas</div>
            </div>
          </div>

          {/* Experience badge */}
          <div className="absolute flex items-center gap-3 rounded-[15px]" style={{ bottom: '20px', right: '-14px', background: 'linear-gradient(135deg,#0D9488,#14B8A6)', color: '#ffffff', padding: '15px 19px', boxShadow: '0 18px 40px -14px rgba(13,148,136,.7)', zIndex: 2 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '26px', height: '26px' }}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
            <div style={{ lineHeight: '1.05' }}>
              <div className="font-extrabold" style={{ fontSize: '24px' }}>18</div>
              <div style={{ fontSize: '11px', opacity: '.85' }}>años de trayectoria</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none">
        <span className="font-mono-mc" style={{ fontSize: '10px', letterSpacing: '.22em', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase' }}>Scroll</span>
        <svg width="24" height="34" viewBox="0 0 24 34" fill="none" style={{ opacity: 0.35 }}>
          <rect x="1" y="1" width="22" height="32" rx="11" stroke="white" strokeWidth="1.5"/>
          <circle cx="12" cy="10" r="3" fill="white" style={{ animation: 'scrollDot 1.8s ease-in-out infinite' }}/>
        </svg>
      </div>

      {/* ── Marquee ticker ─────────────────────────────────────── */}
      <div className="relative overflow-hidden mt-16 py-4" style={{ borderTop: '1px solid rgba(255,255,255,.07)', borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(0,0,0,.3)' }}>
        <div className="animate-marquee flex whitespace-nowrap select-none">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center gap-0">
              {['ARTROSCOPIA', 'REEMPLAZO ARTICULAR', 'TRAUMA DEPORTIVO', 'CIRUGÍA MÍNIMAMENTE INVASIVA', 'REHABILITACIÓN', '18 AÑOS DE EXPERIENCIA', 'DR. CARLOS MINDA', 'SAN ISIDRO · LIMA', 'RECUPERACIÓN FUNCIONAL', 'BIOMECÁNICA AVANZADA'].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-4 font-mono-mc font-medium uppercase" style={{ fontSize: '11px', letterSpacing: '.2em', color: 'rgba(255,255,255,.35)', padding: '0 24px' }}>
                  {item}
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#2563EB' : '#14B8A6', flexShrink: 0, opacity: 0.7 }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%,100% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(10px); opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
