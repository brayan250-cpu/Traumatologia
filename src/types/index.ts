export interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  photo: string;
  credentials: string;
  rating: number;
  languages: string[];
}

export interface TimeSlot {
  id: string;
  time: string;
  period: 'morning' | 'afternoon';
  available: boolean;
}

export interface DayAvailability {
  date: string;
  dayOfWeek: string;
  dayNumber: number;
  hasSlots: boolean;
  slots: TimeSlot[];
}

export interface PatientData {
  fullName: string;
  email: string;
  phone: string;
  insuranceProvider: string;
  medicalHistory?: string;
}

export interface BookingPayload {
  specialtyId: string;
  specialtyName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: TimeSlot;
  patient: PatientData;
  createdAt: string;
}

export interface BookingResult {
  success: boolean;
  ticketCode?: string;
  error?: string;
}
