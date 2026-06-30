import { ArrowRight, Clock, Phone, MapPin } from 'lucide-react';
import { clinicInfo } from '../services/api';

interface HeroProps {
  onBookAppointment: () => void;
}

export function Hero({ onBookAppointment }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#0F5E52] via-[#0a4a40] to-[#063831] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Citas disponibles esta semana
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {clinicInfo.name}
              </h1>
              <p className="text-xl sm:text-2xl text-white/80 font-light">
                {clinicInfo.tagline}
              </p>
              <p className="text-white/60 max-w-lg">
                {clinicInfo.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookAppointment}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#C97A3D] hover:bg-[#C97A3D]/90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Reservar Cita
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href={`tel:${clinicInfo.phone}`}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
              >
                <Phone className="w-5 h-5" />
                {clinicInfo.phone}
              </a>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{clinicInfo.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{clinicInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-5xl sm:text-6xl font-bold text-[#C97A3D]">{clinicInfo.patientsServed.toLocaleString()}+</p>
              <p className="text-white/80 mt-2">Pacientes Atendidos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-5xl sm:text-6xl font-bold text-[#C97A3D]">{clinicInfo.surgeriesCompleted.toLocaleString()}+</p>
              <p className="text-white/80 mt-2">Cirugías Exitosas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-5xl sm:text-6xl font-bold text-white">18+</p>
              <p className="text-white/80 mt-2">Años de Experiencia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-1">
                <p className="text-5xl sm:text-6xl font-bold text-white">4.9</p>
                <svg className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-white/80 mt-2">Calificación Promedio</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
