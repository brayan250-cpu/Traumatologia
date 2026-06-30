import { useState, useEffect, useRef } from 'react';
import { HeartPulse, Phone, MapPin, Clock, Mail, Menu, X, ChevronUp } from 'lucide-react';
import { useBooking } from './hooks/useBooking';
import { SpecialtyAndDoctor } from './components/SpecialtyAndDoctor';
import { CalendarAndSlots } from './components/CalendarAndSlots';
import { PatientForm } from './components/PatientForm';
import { BookingSuccess, BookingError } from './components/BookingSuccess';
import { Hero } from './components/Hero';
import { DoctorProfile } from './components/DoctorProfile';
import { Services } from './components/Services';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { XrayGallery } from './components/XrayGallery';
import { clinicInfo } from './services/api';

type View = 'home' | 'booking';

export function App() {
  const [view, setView] = useState<View>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { state, actions } = useBooking();
  const mainRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Load specialties on mount
  useEffect(() => {
    actions.loadSpecialties();
  }, [actions]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus management on step change
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
            onBack={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
            onBack={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
            onReset={() => {
              actions.reset();
              setView('home');
            }}
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
    <div className="min-h-screen bg-[#F7F8F7]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#0F5E52]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F5E52] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#14201D] tracking-tight">Minda Code</h1>
              <p className="text-xs text-[#14201D]/60 hidden sm:block">Traumatología & Ortopedia</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#doctor" className="text-[#14201D]/70 hover:text-[#0F5E52] transition-colors">Doctor</a>
            <a href="#servicios" className="text-[#14201D]/70 hover:text-[#0F5E52] transition-colors">Servicios</a>
            <a href="#casos" className="text-[#14201D]/70 hover:text-[#0F5E52] transition-colors">Casos</a>
            <a href="#rayos-x" className="text-[#14201D]/70 hover:text-[#0F5E52] transition-colors">Rayos-X</a>
            <button
              onClick={handleBookAppointment}
              className="px-6 py-2 bg-[#C97A3D] hover:bg-[#C97A3D]/90 text-white font-semibold rounded-lg transition-colors"
            >
              Reservar Cita
            </button>
          </nav>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#14201D]" />
            ) : (
              <Menu className="w-6 h-6 text-[#14201D]" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-[#0F5E52]/10 px-4 py-4 space-y-2">
            <a href="#doctor" className="block py-2 text-[#14201D]/70" onClick={() => setMobileMenuOpen(false)}>Doctor</a>
            <a href="#servicios" className="block py-2 text-[#14201D]/70" onClick={() => setMobileMenuOpen(false)}>Servicios</a>
            <a href="#casos" className="block py-2 text-[#14201D]/70" onClick={() => setMobileMenuOpen(false)}>Casos</a>
            <a href="#rayos-x" className="block py-2 text-[#14201D]/70" onClick={() => setMobileMenuOpen(false)}>Rayos-X</a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBookAppointment();
              }}
              className="w-full py-3 bg-[#C97A3D] text-white font-semibold rounded-lg mt-2"
            >
              Reservar Cita
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="pt-14">
        {/* Hero Section */}
        <Hero onBookAppointment={handleBookAppointment} />

        {/* Doctor Profile */}
        <DoctorProfile />

        {/* Services */}
        <Services onBookAppointment={handleBookAppointment} />

        {/* Before/After Cases */}
        <BeforeAfterGallery />

        {/* X-ray Gallery */}
        <section id="rayos-x">
          <XrayGallery />
        </section>

        {/* Booking Section */}
        <section id="booking" ref={bookingRef} className="py-16 sm:py-24 bg-[#F7F8F7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {view === 'home' ? (
              <div className="text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#14201D]">
                  Agenda tu Cita
                </h2>
                <p className="text-[#14201D]/70 max-w-2xl mx-auto">
                  El Dr. Minda y su equipo están listos para atenderte. Reserva tu consulta y recibe la mejor atención traumatológica.
                </p>
                <button
                  onClick={handleBookAppointment}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#C97A3D] hover:bg-[#C97A3D]/90 text-white font-semibold rounded-xl transition-colors shadow-lg text-lg"
                >
                  Comenzar Reserva
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-xl border border-[#0F5E52]/10">
                <div className="mb-8">
                  <button
                    onClick={() => setView('home')}
                    className="text-[#0F5E52] hover:underline text-sm mb-4"
                  >
                    ← Volver al inicio
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#14201D]">
                    Reserva tu Cita
                  </h2>
                  <p className="text-[#14201D]/70 mt-2">Clínica Minda Code - Traumatología</p>
                </div>

                {state.specialties.length === 0 && state.step === 'specialty' ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5E52] mr-3"></div>
                    <span className="text-[#14201D]/70">Cargando servicios...</span>
                  </div>
                ) : (
                  renderBookingSteps()
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#14201D] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo & Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0F5E52] flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">Minda Code</p>
                  <p className="text-white/60 text-xs">Traumatología & Ortopedia</p>
                </div>
              </div>
              <p className="text-white/70 text-sm">
                Especialistas en cirugía articular, traumatología deportiva y reemplazo de articulaciones.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4" />
                <span>{clinicInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4" />
                <span>{clinicInfo.email}</span>
              </div>
              <div className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{clinicInfo.address}</span>
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-3">
              <h4 className="font-semibold mb-4">Horarios</h4>
              <div className="flex items-start gap-2 text-white/70 text-sm">
                <Clock className="w-4 h-4 mt-0.5" />
                <div>
                  <p>Lunes a Viernes</p>
                  <p className="text-white/80">8:00 AM - 6:00 PM</p>
                  <p className="mt-2">Sábados</p>
                  <p className="text-white/80">9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#doctor" className="hover:text-white transition-colors">El Doctor</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
                <li><a href="#casos" className="hover:text-white transition-colors">Casos de Éxito</a></li>
                <li><a href="#booking" className="hover:text-white transition-colors">Reservar Cita</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} Minda Code. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#0F5E52] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0F5E52]/90 transition-colors z-30"
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
