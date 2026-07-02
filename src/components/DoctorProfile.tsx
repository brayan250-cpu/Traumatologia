import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { doctorInfo } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

export function DoctorProfile() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column reveal
      gsap.fromTo('.doctor-left', {
        x: -50, opacity: 0,
      }, {
        x: 0, opacity: 1,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
      // Right column reveal
      gsap.fromTo('.doctor-right', {
        x: 50, opacity: 0,
      }, {
        x: 0, opacity: 1,
        duration: 1.1, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="doctor" style={{ background: 'rgba(7,11,24,.82)', padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(36px,5vw,64px)' }}>
          {/* Left — info */}
          <div className="doctor-left">
            <div className="inline-flex items-center gap-3 font-mono-mc font-medium uppercase mb-6" style={{ fontSize: '12px', letterSpacing: '.2em', color: '#93C5FD' }}>
              <span style={{ width: '22px', height: '1px', background: '#14B8A6' }} />
              01 · El especialista
            </div>

            <div className="flex items-center gap-4 mb-5">
              <img
loading="lazy" 
                src={doctorInfo.photo}
                alt={doctorInfo.name}
                className="rounded-full object-cover flex-none"
                style={{ width: '66px', height: '66px', border: '3px solid rgba(255,255,255,.2)', boxShadow: '0 6px 24px -8px rgba(0,0,0,.6)' }}
              />
              <div>
                <div className="flex items-center gap-2 font-semibold mb-1" style={{ color: '#93C5FD', fontSize: '13px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Especialista Certificado
                </div>
                <h2 className="font-extrabold leading-tight" style={{ margin: 0, fontSize: 'clamp(26px,3.4vw,38px)', letterSpacing: '-.01em', color: '#fff' }}>
                  {doctorInfo.name}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.65)', lineHeight: '1.6', maxWidth: '34em', margin: '0 0 22px' }}>
              Con 18 años de trayectoria, combina técnicas de cirugía mínimamente invasiva con un enfoque centrado en la recuperación funcional de cada paciente.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5" style={{ color: '#60A5FA' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="currentColor" style={{ width: '19px', height: '19px' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-white" style={{ fontSize: '15px' }}>{doctorInfo.rating}</span>
              <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '14px' }}>({doctorInfo.reviews} reseñas verificadas)</span>
            </div>

            {/* Specialties */}
            <div className="font-semibold uppercase mb-3" style={{ fontSize: '13px', color: 'rgba(255,255,255,.4)', letterSpacing: '.08em' }}>
              Áreas de especialización
            </div>
            <div className="flex flex-wrap gap-2">
              {doctorInfo.specialties.map((spec) => (
                <span key={spec} className="font-medium" style={{ padding: '9px 16px', background: 'rgba(15,200,160,.14)', color: '#93C5FD', border: '1px solid rgba(15,200,160,.22)', borderRadius: '999px', fontSize: '14px' }}>
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Right — cards */}
          <div className="doctor-right flex flex-col gap-5">
            {/* Academic credentials */}
            <div className="rounded-[20px]" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', padding: '30px' }}>
              <h3 className="flex items-center gap-3 font-bold mb-5" style={{ margin: '0 0 20px', fontSize: '17px', color: '#fff' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Formación Académica
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {doctorInfo.credentials.map((cred) => (
                  <li key={cred} className="flex items-start gap-3" style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', lineHeight: '1.45' }}>
                    <span className="flex-none rounded-full" style={{ width: '7px', height: '7px', background: '#93C5FD', marginTop: '7px' }} />
                    {cred}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics card */}
            <div className="text-white rounded-[20px]" style={{ background: 'linear-gradient(135deg,rgba(15,94,82,.7),rgba(10,74,64,.8))', border: '1px solid rgba(15,200,160,.2)', padding: '28px 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div className="font-extrabold" style={{ fontSize: '34px', letterSpacing: '-.03em' }}>+3,200</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', marginTop: '4px' }}>Cirugías realizadas</div>
              </div>
              <div>
                <div className="font-extrabold" style={{ fontSize: '34px', letterSpacing: '-.03em', color: '#14B8A6' }}>98%</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', marginTop: '4px' }}>Recuperación exitosa</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


