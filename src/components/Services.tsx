import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const serviceIcons: Record<string, React.ReactNode> = {
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  bone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" /></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
  scissors: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" /></svg>,
};

const SERVICE_COLORS = [
  { icon: 'rgba(0,230,180,.15)', iconText: '#00e6b4', grad: 'linear-gradient(135deg,#00e6b4,#6c63ff)', glow: 'rgba(0,230,180,.25)' },
  { icon: 'rgba(108,99,255,.15)', iconText: '#6c63ff', grad: 'linear-gradient(135deg,#6c63ff,#ff6b9d)', glow: 'rgba(108,99,255,.25)' },
  { icon: 'rgba(255,107,157,.15)', iconText: '#ff6b9d', grad: 'linear-gradient(135deg,#ff6b9d,#C97A3D)', glow: 'rgba(255,107,157,.25)' },
  { icon: 'rgba(201,122,61,.15)', iconText: '#C97A3D', grad: 'linear-gradient(135deg,#C97A3D,#00e6b4)', glow: 'rgba(201,122,61,.25)' },
];

export function Services({ onBookAppointment }: { onBookAppointment: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading reveal
      gsap.fromTo('.services-heading', {
        y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)',
      }, {
        y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
        duration: 1, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.services-heading', start: 'top 82%', once: true },
      });

      // Cards stagger
      gsap.fromTo('.service-card', {
        y: 70, opacity: 0, scale: 0.97,
      }, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.85, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.service-card', start: 'top 85%', once: true },
      });

      // CTA
      gsap.fromTo('.services-cta', {
        y: 30, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-cta', start: 'top 90%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="servicios" style={{ background: 'transparent', padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mx-auto mb-14" style={{ maxWidth: '640px' }}>
          <div className="services-heading inline-flex items-center gap-3 font-mono-mc font-medium uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '.2em', color: '#00e6b4' }}>
            <span style={{ width: '22px', height: '1px', background: '#C97A3D' }} />
            02 · Servicios
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h2 className="services-heading font-extrabold mb-4 gradient-text-hero" style={{ fontSize: 'clamp(34px,5vw,60px)', letterSpacing: '-.035em', lineHeight: '1', margin: '16px 0 14px' }}>
              Tratamientos<br />especializados
            </h2>
          </div>
          <p className="services-heading" style={{ fontSize: '17px', color: 'rgba(255,255,255,.55)', lineHeight: '1.55', margin: 0 }}>
            Tecnología de última generación y técnicas quirúrgicas avanzadas para devolverte la movilidad.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '22px' }}>
          {services.map((service, idx) => {
            const col = SERVICE_COLORS[idx % SERVICE_COLORS.length];
            return (
              <div
                key={service.id}
                className="service-card gradient-border group relative overflow-hidden transition-all duration-400"
                style={{ padding: '32px', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 30px 60px -20px ${col.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Glow bg on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 0%, ${col.glow} 0%, transparent 65%)` }} />

                <div className="relative flex items-start justify-between mb-5">
                  <div className="flex items-center justify-center rounded-[15px]" style={{ width: '56px', height: '56px', background: col.icon, color: col.iconText }}>
                    {serviceIcons[service.icon] || serviceIcons.activity}
                  </div>
                  <span className="font-mono-mc font-medium" style={{ fontSize: '13px', color: 'rgba(255,255,255,.18)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="relative font-bold mb-2" style={{ margin: '0 0 8px', fontSize: '21px', letterSpacing: '-.01em', color: '#fff' }}>
                  {service.title}
                </h3>
                <p className="relative" style={{ margin: '0 0 18px', fontSize: '14.5px', color: 'rgba(255,255,255,.55)', lineHeight: '1.5' }}>
                  {service.description}
                </p>
                <ul className="relative" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2" style={{ fontSize: '14px', lineHeight: '1.4', color: 'rgba(255,255,255,.65)' }}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px', stroke: col.iconText }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="services-cta text-center mt-12">
          <button
            onClick={onBookAppointment}
            className="inline-flex items-center gap-3 font-semibold text-white rounded-[14px] transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#00e6b4,#6c63ff)', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px -16px rgba(0,230,180,.45)' }}
          >
            Agendar una consulta
          </button>
        </div>
      </div>
    </section>
  );
}
