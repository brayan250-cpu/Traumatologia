import { useState } from 'react';
import { Calendar, Clock, User, MapPin, Check, CalendarPlus, Copy, RotateCcw } from 'lucide-react';
import type { BookingPayload, BookingResult } from '../types';
import { insuranceProviders } from '../lib/validation';

interface BookingSuccessProps {
  result: BookingResult;
  payload: BookingPayload;
  onReset: () => void;
  onRetry: () => void;
}

export function BookingSuccess({ result, payload, onReset }: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);

  const displayDate = new Date(payload.date).toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const insuranceName = insuranceProviders.find(p => p.id === payload.patient.insuranceProvider)?.name || payload.patient.insuranceProvider;

  // Generate Google Calendar URL
  const generateGoogleCalendarUrl = () => {
    const startDate = new Date(payload.date);
    const [hours, minutes] = payload.timeSlot.time.split(':').map(Number);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const formatDateForGCal = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const eventTitle = encodeURIComponent(`Cita Médica - ${payload.specialtyName} con ${payload.doctorName}`);
    const eventDetails = encodeURIComponent(
      `Paciente: ${payload.patient.fullName}\nSeguro: ${insuranceName}\nTeléfono: ${payload.patient.phone}\nEmail: ${payload.patient.email}${payload.patient.medicalHistory ? `\n\nAntecedentes: ${payload.patient.medicalHistory}` : ''}\n\nCódigo de confirmación: ${result.ticketCode}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDateForGCal(startDate)}/${formatDateForGCal(endDate)}&details=${eventDetails}&location=${encodeURIComponent('Clínica Médica Premium, Lima, Perú')}`;
  };

  const handleCopyTicketCode = async () => {
    try {
      await navigator.clipboard.writeText(result.ticketCode || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = result.ticketCode || '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F5E52]/10 mb-4">
          <Check className="w-8 h-8 text-[#0F5E52]" />
        </div>
        <h2 className="text-2xl font-semibold text-[#14201D] mb-2">Cita confirmada</h2>
        <p className="text-[#14201D]/70">Tu cita ha sido reservada exitosamente</p>
      </div>

      {/* Ticket Stub with Perforated Edge */}
      <div className="relative">
        {/* Main Ticket */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#0F5E52]/10">
          {/* Top Section */}
          <div className="bg-[#0F5E52] text-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Código de confirmación</p>
                <p className="font-mono text-2xl font-bold tracking-wider" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                  {result.ticketCode}
                </p>
              </div>
              <button
                onClick={handleCopyTicketCode}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F5E52]"
                aria-label="Copiar código de confirmación"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Calendar className="w-4 h-4" />
              <span className="capitalize">{displayDate}</span>
              <span className="mx-2">|</span>
              <Clock className="w-4 h-4" />
              <span>{payload.timeSlot.time}</span>
            </div>
          </div>

          {/* Perforated Edge */}
          <div className="relative h-4 bg-[#F7F8F7]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#F7F8F7] rounded-full -ml-4" style={{ boxShadow: 'inset 4px 0 4px rgba(0,0,0,0.05)' }}></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#F7F8F7] rounded-full -mr-4" style={{ boxShadow: 'inset -4px 0 4px rgba(0,0,0,0.05)' }}></div>
            <div className="absolute left-4 right-4 top-1/2 border-t-2 border-dashed border-[#14B8A6]/30"></div>
          </div>

          {/* Bottom Section - Signature Accent */}
          <div className="p-6" style={{ backgroundColor: '#FFFAF5' }}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#14201D]/60">Médico</p>
                  <p className="font-medium text-[#14201D]">{payload.doctorName}</p>
                  <p className="text-sm text-[#14201D]/70">{payload.specialtyName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#14201D]/60">Ubicación</p>
                  <p className="font-medium text-[#14201D]">Clínica Minda Code</p>
                  <p className="text-sm text-[#14201D]/70">Av. Javier Prado Este 1234, San Isidro, Lima</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#14B8A6]/20">
                <p className="text-xs text-[#14201D]/60 mb-1">Paciente</p>
                <p className="font-medium text-[#14201D]">{payload.patient.fullName}</p>
                <p className="text-sm text-[#14201D]/70">{insuranceName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Notch Visual */}
        <div className="absolute -left-1 top-[48%] w-2 h-8 bg-[#F7F8F7] rounded-r-full"></div>
        <div className="absolute -right-1 top-[48%] w-2 h-8 bg-[#F7F8F7] rounded-l-full"></div>
      </div>

      {/* Google Calendar Button */}
      <a
        href={generateGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-[#0F5E52] text-[#0F5E52] rounded-lg font-medium hover:bg-[#0F5E52]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2"
      >
        <CalendarPlus className="w-5 h-5" />
        Agregar a Google Calendar
      </a>

      {/* Actions */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="text-[#0F5E52] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 rounded"
        >
          Reservar otra cita
        </button>
      </div>
    </div>
  );
}

export function BookingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center max-w-md mx-auto space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <RotateCcw className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-semibold text-[#14201D]">
        No pudimos confirmar tu cita
      </h2>
      <p className="text-[#14201D]/70">
        Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F5E52] text-white rounded-lg font-medium hover:bg-[#0F5E52]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  );
}
