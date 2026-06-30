import { useEffect } from 'react';
import { Heart, Brain, Eye, Baby, Stethoscope, Bone, Activity, HandMetal } from 'lucide-react';
import type { Specialty, Doctor } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
  eye: <Eye className="w-5 h-5" />,
  baby: <Baby className="w-5 h-5" />,
  stethoscope: <Stethoscope className="w-5 h-5" />,
  bone: <Bone className="w-5 h-5" />,
  'heart-pulse': <Activity className="w-5 h-5" />,
  skin: <HandMetal className="w-5 h-5" />,
  activity: <Activity className="w-5 h-5" />,
  trophy: <Heart className="w-5 h-5" />,
  scissors: <Heart className="w-5 h-5" />,
  clipboard: <Heart className="w-5 h-5" />,
};

interface SpecialtyAndDoctorProps {
  specialties: Specialty[];
  selectedSpecialty: Specialty | null;
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isLoadingDoctors: boolean;
  onSelectSpecialty: (specialty: Specialty) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export function SpecialtyAndDoctor({
  specialties,
  selectedSpecialty,
  doctors,
  selectedDoctor,
  isLoadingDoctors,
  onSelectSpecialty,
  onSelectDoctor,
}: SpecialtyAndDoctorProps) {
  useEffect(() => {
    if (selectedSpecialty && doctors.length > 0 && !selectedDoctor) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedSpecialty, doctors.length, selectedDoctor]);

  return (
    <div className="space-y-8">
      {/* Specialty Selection */}
      <div>
        <h2 className="text-2xl font-semibold text-[#14201D] mb-2">Selecciona un servicio</h2>
        <p className="text-[#14201D]/70 mb-6">Elige el tipo de consulta que necesitas</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => onSelectSpecialty(specialty)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 ${
                selectedSpecialty?.id === specialty.id
                  ? 'border-[#0F5E52] bg-[#0F5E52]/5 shadow-sm'
                  : 'border-transparent bg-white hover:border-[#0F5E52]/30 hover:bg-[#F7F8F7]'
              }`}
              aria-pressed={selectedSpecialty?.id === specialty.id}
            >
              <span className={`text-[#0F5E52] ${selectedSpecialty?.id === specialty.id ? '' : 'opacity-70'}`}>
                {iconMap[specialty.icon] || <Stethoscope className="w-5 h-5" />}
              </span>
              <span className="text-sm font-medium text-[#14201D] text-center">{specialty.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Selection */}
      {selectedSpecialty && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-semibold text-[#14201D] mb-4">
            Disponibilidad para {selectedSpecialty.name}
          </h3>

          {isLoadingDoctors ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5E52]"></div>
              <span className="ml-3 text-[#14201D]/70">Cargando médicos...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#0F5E52]/10">
              <p className="text-[#14201D]/70 mb-4">
                No hay disponibilidad para este servicio esta semana
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[#0F5E52] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 rounded"
              >
                Selecciona otro servicio
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => onSelectDoctor(doctor)}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-[#0F5E52] bg-[#0F5E52]/5 shadow-sm'
                      : 'border-transparent bg-white hover:border-[#0F5E52]/30 hover:shadow-sm'
                  }`}
                  aria-pressed={selectedDoctor?.id === doctor.id}
                >
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#14201D] truncate">{doctor.name}</h4>
                    <p className="text-sm text-[#14201D]/70 mt-1">{doctor.credentials}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-amber-600">
                        <span className="font-medium">{doctor.rating}</span>
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                      <span className="text-[#14201D]/50">|</span>
                      <span className="text-[#14201D]/60">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
