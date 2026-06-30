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
          <h2 className="text-2xl font-semibold text-[#14201D] mb-2">Selecciona fecha y hora</h2>
          <p className="text-[#14201D]/70">Los días en gris no tienen disponibles</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#0F5E52] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {isLoadingAvailability ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5E52]"></div>
          <span className="ml-3 text-[#14201D]/70">Cargando disponibilidad...</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Grid */}
          <div className="bg-white rounded-xl p-6 border border-[#0F5E52]/10">
            <h3 className="text-lg font-semibold text-[#14201D] mb-4">Calendario</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-[#14201D]/50 py-2">
                  {day}
                </div>
              ))}
              {availability.map((day) => (
                <button
                  key={day.date}
                  onClick={() => day.hasSlots && onSelectDate(day.date)}
                  disabled={!day.hasSlots}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 ${
                    selectedDate === day.date
                      ? 'bg-[#0F5E52] text-white shadow-md'
                      : day.hasSlots
                      ? 'bg-[#F7F8F7] hover:bg-[#0F5E52]/10 text-[#14201D]'
                      : 'bg-gray-100 text-[#14201D]/30 cursor-not-allowed'
                  }`}
                  aria-pressed={selectedDate === day.date}
                  aria-disabled={!day.hasSlots}
                >
                  <span className="text-xs font-medium">{day.dayOfWeek}</span>
                  <span className="text-lg font-semibold">{day.dayNumber}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-xl p-6 border border-[#0F5E52]/10">
            <h3 className="text-lg font-semibold text-[#14201D] mb-4">Horarios disponibles</h3>

            {!selectedDate ? (
              <div className="text-center py-8 text-[#14201D]/50">
                <p>Selecciona una fecha para ver los horarios</p>
              </div>
            ) : !selectedDayAvailability?.hasSlots ? (
              <div className="text-center py-8 text-[#14201D]/50">
                <p>No hay horarios disponibles para este día</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Morning slots */}
                {morningSlots.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-[#14201D]/70">
                      <Sun className="w-4 h-4" />
                      <span className="text-sm font-medium">Mañana</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {morningSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && onSelectSlot(slot)}
                          disabled={!slot.available || selectedSlot?.id === slot.id}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 ${
                            selectedSlot?.id === slot.id
                              ? 'bg-[#0F5E52] text-white shadow-md'
                              : slot.available
                              ? 'bg-[#F7F8F7] hover:bg-[#0F5E52]/10 text-[#14201D] border border-[#0F5E52]/20'
                              : 'bg-gray-100 text-[#14201D]/30 cursor-not-allowed line-through'
                          }`}
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
                    <div className="flex items-center gap-2 mb-3 text-[#14201D]/70">
                      <Moon className="w-4 h-4" />
                      <span className="text-sm font-medium">Tarde</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {afternoonSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && onSelectSlot(slot)}
                          disabled={!slot.available || selectedSlot?.id === slot.id}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 ${
                            selectedSlot?.id === slot.id
                              ? 'bg-[#0F5E52] text-white shadow-md'
                              : slot.available
                              ? 'bg-[#F7F8F7] hover:bg-[#0F5E52]/10 text-[#14201D] border border-[#0F5E52]/20'
                              : 'bg-gray-100 text-[#14201D]/30 cursor-not-allowed line-through'
                          }`}
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
            className="flex items-center gap-2 px-6 py-3 bg-[#0F5E52] text-white rounded-lg font-medium hover:bg-[#0F5E52]/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2"
          >
            Continuar
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
