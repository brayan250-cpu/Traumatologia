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
    // Solo para asegurar re-render al cambiar médicos disponibles
  }, [selectedSpecialty, doctors.length, selectedDoctor]);

  return (
    <div className="space-y-8">
      {/* Specialty Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#fff', letterSpacing: '-.01em' }}>Selecciona un servicio</h2>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>Elige el tipo de consulta que necesitas</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => onSelectSpecialty(specialty)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '16px 12px', borderRadius: '14px',
                border: selectedSpecialty?.id === specialty.id
                  ? '2px solid #60A5FA'
                  : '2px solid rgba(255,255,255,.1)',
                background: selectedSpecialty?.id === specialty.id
                  ? 'rgba(96,165,250,.1)'
                  : 'rgba(255,255,255,.04)',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => { if (selectedSpecialty?.id !== specialty.id) (e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'); }}
              onMouseLeave={e => { if (selectedSpecialty?.id !== specialty.id) (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'); }}
              aria-pressed={selectedSpecialty?.id === specialty.id}
            >
              <span style={{ color: selectedSpecialty?.id === specialty.id ? '#60A5FA' : 'rgba(255,255,255,.6)' }}>
                {iconMap[specialty.icon] || <Stethoscope className="w-5 h-5" />}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: selectedSpecialty?.id === specialty.id ? '#fff' : 'rgba(255,255,255,.7)', textAlign: 'center' }}>
                {specialty.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Selection */}
      {selectedSpecialty && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#fff' }}>
            Disponibilidad para {selectedSpecialty.name}
          </h3>

          {isLoadingDoctors ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60A5FA]"></div>
              <span className="ml-3" style={{ color: 'rgba(255,255,255,.5)' }}>Cargando médicos...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 rounded-xl" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)' }}>
              <p style={{ color: 'rgba(255,255,255,.5)', marginBottom: '16px' }}>
                No hay disponibilidad para este servicio esta semana
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ color: '#60A5FA', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
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
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                    padding: '16px', borderRadius: '14px', textAlign: 'left',
                    border: selectedDoctor?.id === doctor.id
                      ? '2px solid #60A5FA'
                      : '2px solid rgba(255,255,255,.1)',
                    background: selectedDoctor?.id === doctor.id
                      ? 'rgba(96,165,250,.08)'
                      : 'rgba(255,255,255,.04)',
                    cursor: 'pointer', transition: 'all .2s', width: '100%',
                  }}
                  aria-pressed={selectedDoctor?.id === doctor.id}
                >
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="rounded-lg object-cover flex-shrink-0"
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{doctor.name}</h4>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)', marginBottom: '8px' }}>{doctor.credentials}</p>
                    <div className="flex items-center gap-3" style={{ fontSize: '12px' }}>
                      <span className="flex items-center gap-1" style={{ color: '#60A5FA' }}>
                        <span style={{ fontWeight: 600 }}>{doctor.rating}</span>
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                      <span style={{ color: 'rgba(255,255,255,.2)' }}>|</span>
                      <span style={{ color: 'rgba(255,255,255,.45)' }}>{doctor.languages.join(', ')}</span>
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
