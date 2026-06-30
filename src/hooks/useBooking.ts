import { useReducer, useCallback } from 'react';
import type { Specialty, Doctor, DayAvailability, TimeSlot, BookingPayload, BookingResult } from '../types';
import type { PatientFormData } from '../lib/validation';
import { getSpecialties, getDoctorsBySpecialty, getAvailability, submitBooking } from '../services/api';

export type BookingStep = 'specialty' | 'calendar' | 'patient' | 'submitting' | 'success' | 'error';

interface BookingState {
  step: BookingStep;

  // Step 1: Specialty & Doctor
  specialties: Specialty[];
  selectedSpecialty: Specialty | null;
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isLoadingDoctors: boolean;

  // Step 2: Calendar & Time
  availability: DayAvailability[];
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  isLoadingAvailability: boolean;

  // Step 3: Patient
  patientData: PatientFormData | null;

  // Submission
  bookingResult: BookingResult | null;
  bookingPayload: BookingPayload | null;
  isSubmitting: boolean;
}

type BookingAction =
  | { type: 'SET_SPECIALTIES'; payload: Specialty[] }
  | { type: 'SELECT_SPECIALTY'; payload: Specialty }
  | { type: 'SET_DOCTORS'; payload: Doctor[] }
  | { type: 'SELECT_DOCTOR'; payload: Doctor }
  | { type: 'SET_LOADING_DOCTORS'; payload: boolean }
  | { type: 'SET_AVAILABILITY'; payload: DayAvailability[] }
  | { type: 'SELECT_DATE'; payload: string }
  | { type: 'SELECT_SLOT'; payload: TimeSlot }
  | { type: 'SET_LOADING_AVAILABILITY'; payload: boolean }
  | { type: 'SET_PATIENT_DATA'; payload: PatientFormData }
  | { type: 'START_SUBMISSION' }
  | { type: 'BOOKING_SUCCESS'; payload: { result: BookingResult; payload: BookingPayload } }
  | { type: 'BOOKING_ERROR'; payload: BookingResult }
  | { type: 'GO_TO_STEP'; payload: BookingStep }
  | { type: 'RESET' };

const initialState: BookingState = {
  step: 'specialty',
  specialties: [],
  selectedSpecialty: null,
  doctors: [],
  selectedDoctor: null,
  isLoadingDoctors: false,
  availability: [],
  selectedDate: null,
  selectedSlot: null,
  isLoadingAvailability: false,
  patientData: null,
  bookingResult: null,
  bookingPayload: null,
  isSubmitting: false,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SPECIALTIES':
      return { ...state, specialties: action.payload };

    case 'SELECT_SPECIALTY':
      return {
        ...state,
        selectedSpecialty: action.payload,
        selectedDoctor: null,
        doctors: [],
        availability: [],
        selectedDate: null,
        selectedSlot: null
      };

    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload, isLoadingDoctors: false };

    case 'SELECT_DOCTOR':
      return {
        ...state,
        selectedDoctor: action.payload,
        availability: [],
        selectedDate: null,
        selectedSlot: null
      };

    case 'SET_LOADING_DOCTORS':
      return { ...state, isLoadingDoctors: action.payload };

    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload, isLoadingAvailability: false };

    case 'SELECT_DATE':
      return { ...state, selectedDate: action.payload, selectedSlot: null };

    case 'SELECT_SLOT':
      return { ...state, selectedSlot: action.payload };

    case 'SET_LOADING_AVAILABILITY':
      return { ...state, isLoadingAvailability: action.payload };

    case 'SET_PATIENT_DATA':
      return { ...state, patientData: action.payload };

    case 'START_SUBMISSION':
      return { ...state, step: 'submitting', isSubmitting: true };

    case 'BOOKING_SUCCESS':
      return {
        ...state,
        step: 'success',
        isSubmitting: false,
        bookingResult: action.payload.result,
        bookingPayload: action.payload.payload,
      };

    case 'BOOKING_ERROR':
      return {
        ...state,
        step: 'error',
        isSubmitting: false,
        bookingResult: action.payload,
      };

    case 'GO_TO_STEP':
      return { ...state, step: action.payload };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function useBooking() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const loadSpecialties = useCallback(async () => {
    try {
      const data = await getSpecialties();
      dispatch({ type: 'SET_SPECIALTIES', payload: data });
    } catch {
      // Keep empty specialties array; App renders loading check
    }
  }, []);

  const selectSpecialty = useCallback(async (specialty: Specialty) => {
    dispatch({ type: 'SELECT_SPECIALTY', payload: specialty });
    dispatch({ type: 'SET_LOADING_DOCTORS', payload: true });
    try {
      const doctors = await getDoctorsBySpecialty(specialty.id);
      dispatch({ type: 'SET_DOCTORS', payload: doctors });
    } catch {
      dispatch({ type: 'SET_LOADING_DOCTORS', payload: false });
    }
  }, []);

  const selectDoctor = useCallback(async (doctor: Doctor) => {
    dispatch({ type: 'SELECT_DOCTOR', payload: doctor });
    dispatch({ type: 'SET_LOADING_AVAILABILITY', payload: true });
    try {
      const today = new Date().toISOString().split('T')[0];
      const availability = await getAvailability(doctor.id, today);
      dispatch({ type: 'SET_AVAILABILITY', payload: availability });
      dispatch({ type: 'GO_TO_STEP', payload: 'calendar' });
    } catch {
      dispatch({ type: 'SET_LOADING_AVAILABILITY', payload: false });
    }
  }, []);

  const selectDate = useCallback((date: string) => {
    dispatch({ type: 'SELECT_DATE', payload: date });
  }, []);

  const selectSlot = useCallback((slot: TimeSlot) => {
    dispatch({ type: 'SELECT_SLOT', payload: slot });
  }, []);

  const goToPatientStep = useCallback(() => {
    dispatch({ type: 'GO_TO_STEP', payload: 'patient' });
  }, []);

  const setPatientData = useCallback((data: PatientFormData) => {
    dispatch({ type: 'SET_PATIENT_DATA', payload: data });
  }, []);

  const submitBookingRequest = useCallback(async () => {
    if (!state.selectedSpecialty || !state.selectedDoctor || !state.selectedDate ||
        !state.selectedSlot || !state.patientData) {
      return;
    }

    dispatch({ type: 'START_SUBMISSION' });

    const payload: BookingPayload = {
      specialtyId: state.selectedSpecialty.id,
      specialtyName: state.selectedSpecialty.name,
      doctorId: state.selectedDoctor.id,
      doctorName: state.selectedDoctor.name,
      date: state.selectedDate,
      timeSlot: state.selectedSlot,
      patient: {
        fullName: state.patientData.fullName,
        email: state.patientData.email,
        phone: state.patientData.phone,
        insuranceProvider: state.patientData.insuranceProvider,
        medicalHistory: state.patientData.medicalHistory,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await submitBooking(payload);
      dispatch({ type: 'BOOKING_SUCCESS', payload: { result, payload } });
    } catch {
      dispatch({
        type: 'BOOKING_ERROR',
        payload: { success: false, error: 'SERVICE_UNAVAILABLE' }
      });
    }
  }, [state.selectedSpecialty, state.selectedDoctor, state.selectedDate,
      state.selectedSlot, state.patientData]);

  const retry = useCallback(() => {
    dispatch({ type: 'GO_TO_STEP', payload: 'patient' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      loadSpecialties,
      selectSpecialty,
      selectDoctor,
      selectDate,
      selectSlot,
      goToPatientStep,
      setPatientData,
      submitBookingRequest,
      retry,
      reset,
    },
  };
}
