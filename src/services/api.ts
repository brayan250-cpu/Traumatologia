import type { Specialty, Doctor, DayAvailability, TimeSlot, BookingPayload, BookingResult } from '../types';

// Generate UUID-like ticket code
const generateTicketCode = (): string => {
  return 'MC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
};

// Mock data for Minda Code Orthopedics
export const clinicInfo = {
  name: 'Minda Code',
  tagline: 'Centro de Traumatología y Ortopedia',
  description: 'Especialistas en regeneración articular, cirugía mínimamente invasiva y recuperación funcional',
  phone: '+51 1 987 654 321',
  email: 'citas@mindacode.pe',
  address: 'Av. Javier Prado Este 1234, San Isidro, Lima',
  hours: 'Lun - Vie: 8:00 - 18:00 | Sáb: 9:00 - 14:00',
  founded: 2015,
  patientsServed: 12500,
  surgeriesCompleted: 3200,
};

export const doctorInfo = {
  name: 'Dr. Carlos Minda Rojas',
  title: 'Médico Cirujano - Especialista en Traumatología',
  credentials: [
    'Médico Cirujano - UNMSM',
    'Especialista en Traumatología y Ortopedia - UNMSM',
    'Fellowship en Cirugía Articular - Santiago, Chile',
    'Miembro de la Sociedad Peruana de Traumatología',
  ],
  experience: '18 años de experiencia',
  photo: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
  specialties: [
    'Artroscopia de Rodilla y Hombro',
    'Reemplazo Articular',
    'Trauma Deportivo',
    'Fracturas Complejas',
  ],
  rating: 4.9,
  reviews: 847,
};

export const services = [
  {
    id: 'artroscopia',
    title: 'Artroscopia',
    description: 'Cirugía mínimamente invasiva para diagnóstico y tratamiento de lesiones articulares',
    icon: 'activity',
    details: [
      'Artroscopia de rodilla',
      'Artroscopia de hombro',
      'Artroscopia de tobillo',
      'Reparación de menisco',
      'Reconstrucción de ligamentos',
    ],
  },
  {
    id: 'reemplazo',
    title: 'Reemplazo Articular',
    description: 'Prótesis de última generación para recuperar la movilidad',
    icon: 'bone',
    details: [
      'Reemplazo de cadera',
      'Reemplazo de rodilla',
      'Reemplazo de hombro',
      'Prótesis parciales',
      'Revisión de prótesis',
    ],
  },
  {
    id: 'deportivo',
    title: 'Trauma Deportivo',
    description: 'Tratamiento especializado para atletas de alto rendimiento',
    icon: 'trophy',
    details: [
      'Lesiones de ligamento cruzado',
      'Lesiones de manguito rotador',
      'Fracturas por estrés',
      'Tendinopatías',
      'Prevención de lesiones',
    ],
  },
  {
    id: 'fracturas',
    title: 'Fracturas',
    description: 'Tratamiento avanzado de fracturas con técnicas modernas',
    icon: 'scissors',
    details: [
      'Fijación interna',
      'Fijación externa',
      'Fracturas de fémur',
      'Fracturas de tibia',
      'Fracturas de muñeca',
    ],
  },
];

export const beforeAfterCases = [
  {
    id: 1,
    title: 'Reemplazo de Rodilla',
    patient: 'María G., 62 años',
    condition: 'Artrosis severa de rodilla bilateral',
    procedure: 'Reemplazo total de rodilla derecha',
    description: 'Paciente con dolor crónico e incapacidad para caminar más de 50 metros. Tras la cirugía, recuperó movilidad completa.',
    beforeImage: 'https://images.pexels.com/photos/5215017/pexels-photo-5215017.jpeg?auto=compress&cs=tinysrgb&w=600',
    afterImage: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=600',
    result: 'Recuperación total en 3 meses. Camina sin dolor.',
  },
  {
    id: 2,
    title: 'Reparación de Ligamento Cruzado',
    patient: 'Juan P., 28 años',
    condition: 'Ruptura de LCA en partido de fútbol',
    procedure: 'Reconstrucción artroscópica con injerto',
    description: 'Deportista con lesión deportiva. Cirugía artroscópica mínimamente invasiva con recuperación acelerada.',
    beforeImage: 'https://images.pexels.com/photos/5596292/pexels-photo-5596292.jpeg?auto=compress&cs=tinysrgb&w=600',
    afterImage: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=600',
    result: 'Retorno al fútbol competitivo en 6 meses.',
  },
  {
    id: 3,
    title: 'Reemplazo de Cadera',
    patient: 'Roberto M., 55 años',
    condition: 'Necrosis avascular de cabeza femoral',
    procedure: 'Reemplazo total de cadera con abordaje anterior',
    description: 'Procedimiento de última generación con abordaje anterior mínimamente invasivo.',
    beforeImage: 'https://images.pexels.com/photos/5327960/pexels-photo-5327960.jpeg?auto=compress&cs=tinysrgb&w=600',
    afterImage: 'https://images.pexels.com/photos/5452228/pexels-photo-5452228.jpeg?auto=compress&cs=tinysrgb&w=600',
    result: 'Deambulación al día siguiente. Alta en 2 días.',
  },
  {
    id: 4,
    title: 'Fractura de Tibia',
    patient: 'Ana L., 34 años',
    condition: 'Fractura conminuta de tibia por accidente',
    procedure: 'Fijación intramedular con clavo',
    description: 'Fractura compleja tratada con técnicas modernas de fijación interna.',
    beforeImage: 'https://images.pexels.com/photos/5452264/pexels-photo-5452264.jpeg?auto=compress&cs=tinysrgb&w=600',
    afterImage: 'https://images.pexels.com/photos/5699460/pexels-photo-5699460.jpeg?auto=compress&cs=tinysrgb&w=600',
    result: 'Consolidación completa. Sin secuelas.',
  },
];

export const xrayGallery = [
  {
    id: 1,
    title: 'Prótesis de Rodilla',
    description: 'Reemplazo total con prótesis de última generación',
    image: 'https://images.pexels.com/photos/5215017/pexels-photo-5215017.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 2,
    title: 'Fijación de Fractura',
    description: 'Clavo intramedular en tibia',
    image: 'https://images.pexels.com/photos/5327960/pexels-photo-5327960.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 3,
    title: 'Prótesis de Cadera',
    description: 'Reemplazo total cementado',
    image: 'https://images.pexels.com/photos/5596292/pexels-photo-5596292.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 4,
    title: 'Artroscopia',
    description: 'Reparación de menisco',
    image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 5,
    title: 'Placa de Osteosíntesis',
    description: 'Fractura de húmero',
    image: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: 6,
    title: 'Reconstrucción LCA',
    description: 'Ligamento cruzado anterior',
    image: 'https://images.pexels.com/photos/5452228/pexels-photo-5452228.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
];

// Services as specialties for booking
const specialties: Specialty[] = [
  { id: 'artroscopia', name: 'Artroscopia', icon: 'activity', description: 'Cirugía articular mínimamente invasiva' },
  { id: 'reemplazo', name: 'Reemplazo Articular', icon: 'bone', description: 'Prótesis de cadera y rodilla' },
  { id: 'deportivo', name: 'Trauma Deportivo', icon: 'trophy', description: 'Lesiones deportivas' },
  { id: 'fracturas', name: 'Fracturas', icon: 'scissors', description: 'Tratamiento de fracturas' },
  { id: 'consulta', name: 'Consulta General', icon: 'stethoscope', description: 'Evaluación traumatológica' },
  { id: 'seguimiento', name: 'Control Post-Operatorio', icon: 'clipboard', description: 'Seguimiento quirúrgico' },
];

const doctors: Doctor[] = [
  {
    id: 'dr-minda',
    name: 'Dr. Carlos Minda Rojas',
    specialtyId: 'artroscopia',
    photo: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150',
    credentials: 'Traumatólogo - 18 años exp.',
    rating: 4.9,
    languages: ['Español', 'Inglés'],
  },
];

// Generate mock time slots
const generateTimeSlots = (seed: number): TimeSlot[] => {
  const morningSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  const slots: TimeSlot[] = [];

  morningSlots.forEach((time, i) => {
    slots.push({
      id: `slot-${seed}-m-${i}`,
      time,
      period: 'morning',
      available: (seed + i) % 3 !== 0
    });
  });

  afternoonSlots.forEach((time, i) => {
    slots.push({
      id: `slot-${seed}-a-${i}`,
      time,
      period: 'afternoon',
      available: (seed + i + 1) % 3 !== 0
    });
  });

  return slots;
};

// API functions
export const getSpecialties = async (): Promise<Specialty[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(specialties);
    }, 800);
  });
};

export const getDoctorsBySpecialty = async (specialtyId: string): Promise<Doctor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dr. Minda handles all services
      resolve(doctors.map(d => ({ ...d, specialtyId })));
    }, 1000);
  });
};

export const getAvailability = async (doctorId: string, _date: string): Promise<DayAvailability[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      const days: DayAvailability[] = [];

      for (let i = 1; i <= 14; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.toLocaleDateString('es-PE', { weekday: 'short' });
        const dayNumber = currentDate.getDate();

        const seed = (doctorId.charCodeAt(1) + i) % 10;
        const slots = generateTimeSlots(seed);
        const hasSlots = slots.some(s => s.available);

        // Skip weekends
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

        if (!isWeekend) {
          days.push({
            date: dateStr,
            dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
            dayNumber,
            hasSlots,
            slots: hasSlots ? slots : []
          });
        }
      }

      resolve(days);
    }, 1200);
  });
};

export const submitBooking = async (_payload: BookingPayload): Promise<BookingResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        ticketCode: generateTicketCode()
      });
    }, 1500);
  });
};
