import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import type { DayAvailability, TimeSlot, Doctor } from '../types';

interface CalendarAndSlotsProps {
  doctor: Doctor;
  availability: DayAvailability[];
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  isLoadingAvailability: boolean;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: TimeSlot) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function CalendarAndSlots({
  availability,
  selectedDate,
  selectedSlot,
  isLoadingAvailability,
  onSelectDate,
  onSelectSlot,
  onContinue,
  onBack,
}: CalendarAndSlotsProps) {
  const selectedDayAvailability = availability.find(d => d.date === selectedDate);

  const morningSlots = selectedDayAvailability?.slots?.filter(s => s.period === 'morning') || [];
  const afternoonSlots = selectedDayAvailability?.slots?.filter(s => s.period === 'afternoon') || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#fff', letterSpacing: '-.02em' }}>Selecciona fecha y hora</h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>Los días en gris no tienen disponibles</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-medium"
          style={{ color: '#00e6b4', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {isLoadingAvailability ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00e6b4]"></div>
          <span className="ml-3" style={{ color: 'rgba(255,255,255,.5)' }}>Cargando disponibilidad...</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Grid */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#fff' }}>Calendario</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="text-center text-xs font-medium py-2" style={{ color: 'rgba(255,255,255,.35)' }}>
                  {day}
                </div>
              ))}
              {availability.map((day) => (
                <button
                  key={day.date}
                  onClick={() => day.hasSlots && onSelectDate(day.date)}
                  disabled={!day.hasSlots}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: day.hasSlots ? 'pointer' : 'not-allowed',
                    transition: 'all .2s',
                    background: selectedDate === day.date
                      ? '#00e6b4'
                      : day.hasSlots
                      ? 'rgba(255,255,255,.07)'
                      : 'rgba(255,255,255,.02)',
                    color: selectedDate === day.date
                      ? '#020d18'
                      : day.hasSlots
                      ? '#fff'
                      : 'rgba(255,255,255,.2)',
                    fontWeight: 500,
                  }}
                  aria-pressed={selectedDate === day.date}
                  aria-disabled={!day.hasSlots}
                >
                  <span style={{ fontSize: '11px' }}>{day.dayOfWeek}</span>
                  <span style={{ fontSize: '17px', fontWeight: 700 }}>{day.dayNumber}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#fff' }}>Horarios disponibles</h3>

            {!selectedDate ? (
              <div className="text-center py-8" style={{ color: 'rgba(255,255,255,.35)' }}>
                <p>Selecciona una fecha para ver los horarios</p>
              </div>
            ) : !selectedDayAvailability?.hasSlots ? (
              <div className="text-center py-8" style={{ color: 'rgba(255,255,255,.35)' }}>
                <p>No hay horarios disponibles para este día</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Morning slots */}
                {morningSlots.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3" style={{ color: 'rgba(255,255,255,.55)' }}>
                      <Sun className="w-4 h-4" />
                      <span className="text-sm font-medium">Mañana</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {morningSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && onSelectSlot(slot)}
                          disabled={!slot.available || selectedSlot?.id === slot.id}
                          style={{
                            padding: '8px 6px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                            border: selectedSlot?.id === slot.id ? 'none' : '1px solid rgba(255,255,255,.12)',
                            cursor: slot.available ? 'pointer' : 'not-allowed', transition: 'all .2s',
                            background: selectedSlot?.id === slot.id ? '#00e6b4'
                              : slot.available ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)',
                            color: selectedSlot?.id === slot.id ? '#020d18'
                              : slot.available ? '#fff' : 'rgba(255,255,255,.2)',
                            textDecoration: slot.available ? 'none' : 'line-through',
                          }}
                          aria-pressed={selectedSlot?.id === slot.id}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Afternoon slots */}
                {afternoonSlots.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3" style={{ color: 'rgba(255,255,255,.55)' }}>
                      <Moon className="w-4 h-4" />
                      <span className="text-sm font-medium">Tarde</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {afternoonSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && onSelectSlot(slot)}
                          disabled={!slot.available || selectedSlot?.id === slot.id}
                          style={{
                            padding: '8px 6px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                            border: selectedSlot?.id === slot.id ? 'none' : '1px solid rgba(255,255,255,.12)',
                            cursor: slot.available ? 'pointer' : 'not-allowed', transition: 'all .2s',
                            background: selectedSlot?.id === slot.id ? '#00e6b4'
                              : slot.available ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)',
                            color: selectedSlot?.id === slot.id ? '#020d18'
                              : slot.available ? '#fff' : 'rgba(255,255,255,.2)',
                            textDecoration: slot.available ? 'none' : 'line-through',
                          }}
                          aria-pressed={selectedSlot?.id === slot.id}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedSlot && (
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 font-semibold transition-all hover:brightness-110"
            style={{ padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg,#00e6b4,#6c63ff)', color: '#020d18', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 16px 40px -12px rgba(0,230,180,.4)' }}
          >
            Continuar
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
