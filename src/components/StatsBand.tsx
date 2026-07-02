import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clinicInfo, doctorInfo } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: clinicInfo.patientsServed, suffix: '+', label: 'Pacientes Atendidos',   color: '#00e6b4', color2: '#6c63ff' },
  { value: clinicInfo.surgeriesCompleted, suffix: '+', label: 'Cirugías Exitosas', color: '#C97A3D', color2: '#ff6b9d' },
  { value: 18, suffix: '+', label: 'Años de Experiencia',                           color: '#6c63ff', color2: '#00e6b4' },
  { value: doctorInfo.rating, suffix: '', label: 'Calificación Promedio ★',         color: '#f5b301', color2: '#C97A3D', isFloat: true },
];

export function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal cards
      gsap.fromTo('.stat-card', {
        y: 45, opacity: 0, scale: 0.95,
      }, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.75, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      });

      // Count-up each number
      stats.forEach((stat, i) => {
        const el = document.querySelector(`.stat-num-${i}`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.8,
          ease: 'power2.out',
          delay: i * 0.09,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
          onUpdate() {
            const v = stat.isFloat
              ? obj.val.toFixed(1)
              : Math.round(obj.val).toLocaleString();
            el.textContent = `${v}${stat.suffix}`;
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: 'transparent', padding: 'clamp(56px,7vw,84px) 0' }}>
      <div className="max-w-6xl mx-auto px-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card gradient-border group relative overflow-hidden"
            style={{ padding: '32px 28px', transition: 'transform .3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Glow bg on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${stat.color}18 0%, transparent 70%)` }} />

            <div
              className={`stat-num-${i} font-extrabold leading-none relative`}
              style={{ fontSize: 'clamp(40px,5vw,58px)', letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums',
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color2} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              0{stat.suffix}
            </div>
            <div className="mt-3 relative" style={{ fontSize: '13px', color: 'rgba(255,255,255,.45)', letterSpacing: '.04em' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

