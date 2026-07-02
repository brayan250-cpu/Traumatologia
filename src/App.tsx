import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { HeartPulse, Phone, MapPin, Clock, Mail, Menu, X, ChevronUp, ArrowRight } from 'lucide-react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBooking } from './hooks/useBooking';

gsap.registerPlugin(ScrollTrigger);
import { SpecialtyAndDoctor } from './components/SpecialtyAndDoctor';
import { CalendarAndSlots } from './components/CalendarAndSlots';
import { PatientForm } from './components/PatientForm';
import { BookingSuccess, BookingError } from './components/BookingSuccess';
import { Hero } from './components/Hero';
import { StatsBand } from './components/StatsBand';
// Precargar el chunk de la experiencia 3D inmediatamente al parsear este módulo
// (en paralelo con el bundle principal, no espera a idle)
const anatomyImport = import('./components/AnatomyScrollExperience');
const AnatomyScrollExperience = lazy(() =>
  anatomyImport.then(m => ({ default: m.AnatomyScrollExperience }))
);
import { AnimatedBackground } from './components/AnimatedBackground';
const ScrollStory = lazy(() =>
  import('./components/ScrollStory').then(m => ({ default: m.ScrollStory }))
);
const DoctorProfile = lazy(() =>
  import('./components/DoctorProfile').then(m => ({ default: m.DoctorProfile }))
);
const Services = lazy(() =>
  import('./components/Services').then(m => ({ default: m.Services }))
);
const BeforeAfterGallery = lazy(() =>
  import('./components/BeforeAfterGallery').then(m => ({ default: m.BeforeAfterGallery }))
);
const XrayGallery = lazy(() =>
  import('./components/XrayGallery').then(m => ({ default: m.XrayGallery }))
);
const CursorFollower = lazy(() =>
  import('./components/CursorFollower').then(m => ({ default: m.CursorFollower }))
);
import { clinicInfo } from './services/api';

type View = 'home' | 'booking';

const SECTION_THEMES = {
  hero:     { label: 'Inicio',    accent: '#60A5FA', headerBg: 'rgba(7,11,26,.88)',    text: 'rgba(255,255,255,.85)', isDark: true  },
  proceso:  { label: 'Proceso',   accent: '#2563EB', headerBg: 'rgba(7,12,28,.88)',    text: 'rgba(255,255,255,.85)', isDark: true  },
  doctor:   { label: 'Doctor',    accent: '#60A5FA', headerBg: 'rgba(7,11,26,.90)',    text: 'rgba(255,255,255,.85)', isDark: true  },
  servicios:{ label: 'Servicios', accent: '#14B8A6', headerBg: 'rgba(8,13,30,.90)',    text: 'rgba(255,255,255,.85)', isDark: true  },
  casos:    { label: 'Casos',     accent: '#60A5FA', headerBg: 'rgba(7,11,26,.90)',    text: 'rgba(255,255,255,.85)', isDark: true  },
  'rayos-x':{ label: 'Galería',   accent: '#2563EB', headerBg: 'rgba(6,10,22,.90)',    text: 'rgba(255,255,255,.85)', isDark: true  },
} as const;

type SectionId = keyof typeof SECTION_THEMES;

export function App() {
  const [view, setView] = useState<View>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const scrollProgressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  const { state, actions } = useBooking();
  const mainRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const anatomySentinelRef = useRef<HTMLDivElement>(null);
  const showScrollTopRef = useRef(false);
  const headerScrolledRef = useRef(false);
  const [loadAnatomy, setLoadAnatomy] = useState(false);
  const [loadDeferredSections, setLoadDeferredSections] = useState(false);
  const [loadCursorFollower, setLoadCursorFollower] = useState(false);

  useEffect(() => {
    actions.loadSpecialties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Montar la experiencia 3D despu\u00e9s de que el hero termine sus animaciones iniciales
  // (evita competencia por el main thread durante el primer paint)
  useEffect(() => {
    const id = window.setTimeout(() => setLoadAnatomy(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setLoadDeferredSections(true);
    };

    const timeoutId = window.setTimeout(activate, 1200);
    window.addEventListener('scroll', activate, { passive: true, once: true });
    window.addEventListener('wheel', activate, { passive: true, once: true });
    window.addEventListener('touchmove', activate, { passive: true, once: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', activate);
      window.removeEventListener('wheel', activate);
      window.removeEventListener('touchmove', activate);
    };
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setLoadCursorFollower(true);
    };

    const timeoutId = window.setTimeout(activate, 900);
    window.addEventListener('pointermove', activate, { passive: true, once: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('pointermove', activate);
    };
  }, []);

  // Lenis smooth scroll — integrated with GSAP ticker + ScrollTrigger
  useEffect(() => {
    // En móvil / touch usamos scroll nativo (más fluido y menos CPU)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) {
      const onScroll = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const raw = maxScroll > 0 ? (scrollY / maxScroll) * 3 : 0;
        scrollProgressRef.current = raw;
        if (progressBarRef.current)
          progressBarRef.current.style.transform = `scaleX(${(raw / 3).toFixed(3)})`;
        if ((scrollY > 500) !== showScrollTopRef.current) {
          showScrollTopRef.current = scrollY > 500;
          setShowScrollTop(scrollY > 500);
        }
        if ((scrollY > 40) !== headerScrolledRef.current) {
          headerScrolledRef.current = scrollY > 40;
          setHeaderScrolled(scrollY > 40);
        }
        ScrollTrigger.update();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Feed Lenis scroll position into ScrollTrigger
    lenis.on('scroll', (e: { scroll: number }) => {
      const scrollY = e.scroll;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const raw = maxScroll > 0 ? (scrollY / maxScroll) * 3 : 0;
      scrollProgressRef.current = raw;          // ← no React re-render
      if (progressBarRef.current)
        progressBarRef.current.style.transform = `scaleX(${(raw / 3).toFixed(3)})`;
      if ((scrollY > 500) !== showScrollTopRef.current) {
        showScrollTopRef.current = scrollY > 500;
        setShowScrollTop(scrollY > 500);
      }
      if ((scrollY > 40) !== headerScrolledRef.current) {
        headerScrolledRef.current = scrollY > 40;
        setHeaderScrolled(scrollY > 40);
      }
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  // IntersectionObserver para detectar la sección activa
  useEffect(() => {
    const ids: SectionId[] = ['hero', 'proceso', 'doctor', 'servicios', 'casos', 'rayos-x'];
    const observers: IntersectionObserver[] = [];

    ids.forEach(id => {
      const el = id === 'hero'
        ? document.querySelector('section')   // primer section = Hero
        : document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    if (view === 'booking') {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [view, state.step]);

  const handleBookAppointment = () => {
    setView('booking');
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBookingSteps = () => {
    switch (state.step) {
      case 'specialty':
        return (
          <SpecialtyAndDoctor
            specialties={state.specialties}
            selectedSpecialty={state.selectedSpecialty}
            doctors={state.doctors}
            selectedDoctor={state.selectedDoctor}
            isLoadingDoctors={state.isLoadingDoctors}
            onSelectSpecialty={actions.selectSpecialty}
            onSelectDoctor={actions.selectDoctor}
          />
        );
      case 'calendar':
        return state.selectedSpecialty && state.selectedDoctor ? (
          <CalendarAndSlots
            doctor={state.selectedDoctor}
            availability={state.availability}
            selectedDate={state.selectedDate}
            selectedSlot={state.selectedSlot}
            isLoadingAvailability={state.isLoadingAvailability}
            onSelectDate={actions.selectDate}
            onSelectSlot={actions.selectSlot}
            onContinue={actions.goToPatientStep}
            onBack={actions.goBack}
          />
        ) : null;
      case 'patient':
        return state.selectedSpecialty && state.selectedDoctor && state.selectedDate && state.selectedSlot ? (
          <PatientForm
            specialty={state.selectedSpecialty}
            doctor={state.selectedDoctor}
            date={state.selectedDate}
            slot={state.selectedSlot}
            onSubmit={(data) => {
              actions.setPatientData(data);
              actions.submitBookingRequest();
            }}
            onBack={actions.goBack}
            isSubmitting={state.isSubmitting}
          />
        ) : null;
      case 'submitting':
        return (
          <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5E52] mb-4"></div>
            <p className="text-lg font-medium text-[#14201D]">Confirmando tu cita...</p>
          </div>
        );
      case 'success':
        return state.bookingResult && state.bookingPayload ? (
          <BookingSuccess
            result={state.bookingResult}
            payload={state.bookingPayload}
            onReset={() => { actions.reset(); setView('home'); }}
            onRetry={actions.retry}
          />
        ) : null;
      case 'error':
        return <BookingError onRetry={actions.retry} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Canvas animated background */}
      <AnimatedBackground scrollProgressRef={scrollProgressRef} />

      {/* Custom cursor follower */}
      {loadCursorFollower && (
        <Suspense fallback={null}>
          <CursorFollower />
        </Suspense>
      )}

      {/* Header temático */}
      {(() => {
        const theme = SECTION_THEMES[activeSection];
        const bg = headerScrolled ? theme.headerBg : (theme.isDark ? 'rgba(8,12,26,.45)' : 'rgba(255,255,255,.55)');
        const logoText = theme.isDark ? '#ffffff' : '#14201D';
        const logoSub  = theme.isDark ? 'rgba(255,255,255,.5)' : 'rgba(20,32,29,.5)';
        const navText  = theme.isDark ? 'rgba(255,255,255,.72)' : 'rgba(20,32,29,.68)';
        const navHover = theme.accent;
        return (
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: bg,
          borderBottom: `1px solid ${theme.accent}30`,
          boxShadow: headerScrolled ? `0 8px 32px -12px ${theme.accent}44` : 'none',
          transition: 'background .5s ease, border-color .5s ease, box-shadow .5s ease',
        }}
      >
        {/* Barra de progreso de sección */}
        <div ref={progressBarRef} style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}88)`,
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'background .5s ease',
        }} />

        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ padding: '13px 24px' }}>
          <a href="#" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <span className="flex items-center justify-center rounded-[13px] flex-none"
              style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#ffffff' }}>
              <HeartPulse className="w-5 h-5" />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
              <span className="font-extrabold" style={{ fontSize: '18px', letterSpacing: '-.02em', color: logoText, transition: 'color .4s' }}>Minda Code</span>
              <span className="font-mono-mc hidden sm:block" style={{ fontSize: '10px', color: logoSub, letterSpacing: '.08em', textTransform: 'uppercase', transition: 'color .4s' }}>
                {theme.label} · Traumatología
              </span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {([['#doctor','Doctor'],['#servicios','Servicios'],['#casos','Casos'],['#rayos-x','Rayos-X']] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href}
                style={{ fontSize: '14.5px', color: navText, textDecoration: 'none', fontWeight: 500, transition: 'color .3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = navHover)}
                onMouseLeave={e => (e.currentTarget.style.color = navText)}
              >{label}</a>
            ))}
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center gap-2 font-semibold rounded-[11px] hover:brightness-110 transition-all"
              style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#ffffff', fontSize: '14.5px', border: 'none', cursor: 'pointer',
                boxShadow: `0 10px 22px -10px rgba(59,130,246,.5)` }}
            >
              Reservar Cita
            </button>
          </nav>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            {mobileMenuOpen
              ? <X className="w-6 h-6" style={{ color: logoText }} />
              : <Menu className="w-6 h-6" style={{ color: logoText }} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t px-6 py-4 space-y-2"
            style={{ background: theme.isDark ? 'rgba(8,12,26,.95)' : 'rgba(255,255,255,.97)',
              borderColor: `${theme.accent}30` }}>
            {['doctor','servicios','casos','rayos-x'].map(id => (
              <a key={id} href={`#${id}`}
                className="block py-2 capitalize"
                style={{ color: navText }}
                onClick={() => setMobileMenuOpen(false)}
              >{id.replace('-',' ')}</a>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); handleBookAppointment(); }}
              className="w-full py-3 font-semibold rounded-[11px] mt-2"
              style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#ffffff', border: 'none', cursor: 'pointer' }}
            >Reservar Cita</button>
          </nav>
        )}
      </header>
        );
      })()}

      {/* Main Content */}
      <main ref={mainRef} style={{ position: 'relative', zIndex: 1 }}>
        <Hero onBookAppointment={handleBookAppointment} />
        <StatsBand />
        <div ref={anatomySentinelRef}>
          {loadAnatomy ? (
            <Suspense fallback={<div style={{ height: '500vh', background: '#070B1A' }} />}>
              <AnatomyScrollExperience />
            </Suspense>
          ) : (
            <div style={{ height: '500vh', background: '#070B1A' }} />
          )}
        </div>

        {loadDeferredSections && (
          <Suspense fallback={<div style={{ height: '120vh', background: 'transparent' }} />}>
            <ScrollStory />
            <DoctorProfile />
            <Services onBookAppointment={handleBookAppointment} />
            <BeforeAfterGallery />
            <XrayGallery />
          </Suspense>
        )}

        {/* Booking CTA Section */}
        <section id="reserva" style={{ background: 'transparent', padding: 'clamp(72px,9vw,120px) 0' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 font-mono-mc font-medium uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '.2em', color: '#93C5FD', justifyContent: 'center' }}>
              <span style={{ width: '22px', height: '1px', background: '#14B8A6' }} />
              Agenda tu cita
            </div>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(32px,4.6vw,50px)', letterSpacing: '-.01em', lineHeight: '1.08', color: '#fff', margin: '16px 0 16px' }}>
              Tu recuperación empieza <em style={{ fontStyle: 'italic', color: '#60A5FA' }}>hoy</em>
            </h2>
            <p className="mx-auto mb-10" style={{ fontSize: '18px', color: 'rgba(255,255,255,.55)', lineHeight: '1.55', maxWidth: '34em', margin: '0 auto 40px' }}>
              El Dr. Minda y su equipo están listos para atenderte. Reserva en tres simples pasos.
            </p>

            <div className="text-left mb-11" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '16px', marginBottom: '44px' }}>
              {[
                { step: 'PASO 01', title: 'Elige especialidad', desc: 'Selecciona el servicio que necesitas.' },
                { step: 'PASO 02', title: 'Escoge fecha', desc: 'Revisa la disponibilidad y horarios.' },
                { step: 'PASO 03', title: 'Confirma', desc: 'Recibe tu código de cita al instante.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="rounded-[18px]" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', padding: '24px' }}>
                  <div className="font-mono-mc font-semibold mb-2" style={{ fontSize: '13px', color: '#14B8A6' }}>{step}</div>
                  <div className="font-bold mb-1" style={{ fontSize: '16px', color: '#fff' }}>{title}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)', lineHeight: '1.45' }}>{desc}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleBookAppointment}
                className="inline-flex items-center gap-3 font-semibold rounded-[14px] transition-all hover:-translate-y-0.5 hover:brightness-110"
                style={{ padding: '16px 30px', background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 55%, #1D4ED8 100%)', color: '#ffffff', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px -16px rgba(59,130,246,.5)' }}
              >
                Comenzar Reserva
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href={`mailto:${clinicInfo.email}`}
                className="inline-flex items-center gap-3 font-semibold rounded-[14px] transition-all hover:bg-white/20"
                style={{ padding: '16px 28px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.3)', color: '#ffffff', fontSize: '16px', textDecoration: 'none' }}
              >
                <Mail className="w-5 h-5" />
                Escríbenos
              </a>
            </div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section ref={bookingRef} className="py-16 sm:py-24" style={{ background: 'transparent' }}>
          {view === 'booking' && (
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-[22px] overflow-hidden" style={{ background: 'rgba(7,11,24,.98)', boxShadow: '0 40px 90px -28px rgba(0,0,0,.8)', border: '1px solid rgba(255,255,255,.1)' }}>
                {/* Modal header */}
                <div className="flex items-center justify-between gap-4" style={{ padding: '22px 26px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  <div>
                    <div className="font-mono-mc uppercase mb-1" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#93C5FD' }}>Reserva de cita</div>
                    <div className="font-extrabold" style={{ fontSize: '20px', letterSpacing: '-.02em', color: '#fff' }}>Clínica Minda Code</div>
                  </div>
                  <button
                    onClick={() => setView('home')}
                    className="flex items-center justify-center rounded-full transition-colors"
                    style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', cursor: 'pointer', color: '#fff', flexShrink: 0 }}
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div style={{ padding: '26px' }}>
                  {state.specialties.length === 0 && state.step === 'specialty' ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5E52] mr-3"></div>
                      <span className="text-[#14201D]/70">Cargando servicios...</span>
                    </div>
                  ) : (
                    renderBookingSteps()
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#060A18', color: '#fff', padding: '64px 0 34px', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(59,130,246,.18)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '36px', marginBottom: '44px' }}>
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center rounded-[12px] flex-none" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#ffffff' }}>
                  <HeartPulse className="w-5 h-5" />
                </span>
                <div style={{ lineHeight: '1.15' }}>
                  <div className="font-extrabold" style={{ fontSize: '17px' }}>Minda Code</div>
                  <div className="font-mono-mc" style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)', letterSpacing: '.05em' }}>Traumatología · Ortopedia</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', lineHeight: '1.55', margin: 0, maxWidth: '26em' }}>
                Especialistas en cirugía articular, traumatología deportiva y reemplazo de articulaciones.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4" style={{ fontSize: '15px' }}>Contacto</h4>
              <div className="flex flex-col gap-3" style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)' }}>
                <span className="flex items-center gap-2"><Phone className="w-4 h-4 flex-none" />{clinicInfo.phone}</span>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4 flex-none" />{clinicInfo.email}</span>
                <span className="flex items-start gap-2"><MapPin className="w-4 h-4 flex-none mt-0.5" />{clinicInfo.address}</span>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-bold mb-4" style={{ fontSize: '15px' }}>Horarios</h4>
              <div className="flex items-start gap-2" style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)' }}>
                <Clock className="w-4 h-4 flex-none mt-0.5" />
                <div style={{ lineHeight: '1.7' }}>
                  <div>Lunes a Viernes</div>
                  <div style={{ color: 'rgba(255,255,255,.85)' }}>8:00 AM – 6:00 PM</div>
                  <div style={{ marginTop: '8px' }}>Sábados</div>
                  <div style={{ color: 'rgba(255,255,255,.85)' }}>9:00 AM – 2:00 PM</div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4" style={{ fontSize: '15px' }}>Enlaces</h4>
              <div className="flex flex-col gap-3" style={{ fontSize: '14px' }}>
                <a href="#doctor" style={{ color: 'rgba(255,255,255,.65)', textDecoration: 'none' }} className="hover:text-white transition-colors">El Doctor</a>
                <a href="#servicios" style={{ color: 'rgba(255,255,255,.65)', textDecoration: 'none' }} className="hover:text-white transition-colors">Servicios</a>
                <a href="#casos" style={{ color: 'rgba(255,255,255,.65)', textDecoration: 'none' }} className="hover:text-white transition-colors">Casos de éxito</a>
                <a href="#reserva" style={{ color: 'rgba(255,255,255,.65)', textDecoration: 'none' }} className="hover:text-white transition-colors">Reservar cita</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '26px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,.45)' }}>© 2026 Minda Code. Todos los derechos reservados.</span>
            <a
              href="https://www.mindacode.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', textDecoration: 'none', opacity: 0.7, transition: 'opacity .2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
            >
              <img src="/images/mindacode-logo.png" alt="Minda Code" style={{ width: '26px', height: '26px', borderRadius: '7px', display: 'block' }} />
              <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.55)', letterSpacing: '.02em' }}>
                Powered by <strong style={{ color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>Minda Code</strong>
              </span>
            </a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 flex items-center justify-center rounded-full shadow-lg transition-all hover:brightness-110 z-30"
          style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 26px -8px rgba(59,130,246,.55)' }}
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );

}
