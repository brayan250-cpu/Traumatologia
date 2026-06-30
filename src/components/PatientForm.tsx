import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, AlertCircle, Check } from 'lucide-react';
import { patientSchema, insuranceProviders, type PatientFormData } from '../lib/validation';
import type { Specialty, Doctor, TimeSlot } from '../types';

interface PatientFormProps {
  specialty: Specialty;
  doctor: Doctor;
  date: string;
  slot: TimeSlot;
  onSubmit: (data: PatientFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  insuranceProvider?: string;
  medicalHistory?: string;
}

export function PatientForm({
  specialty,
  doctor,
  date,
  slot,
  onSubmit,
  onBack,
  isSubmitting,
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    email: '',
    phone: '',
    insuranceProvider: '',
    medicalHistory: '',
  });

  const [touched, setTouched] = useState<Record<keyof PatientFormData, boolean>>({
    fullName: false,
    email: false,
    phone: false,
    insuranceProvider: false,
    medicalHistory: false,
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  const validateField = useCallback((fieldName: keyof PatientFormData, value: string) => {
    const partialData = { ...formData, [fieldName]: value };
    const result = patientSchema.safeParse(partialData);

    if (result.success) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } else {
      const fieldError = result.error.errors.find(e => e.path[0] === fieldName);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError?.message || undefined
      }));
    }
  }, [formData]);

  const handleBlur = (fieldName: keyof PatientFormData) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName] ?? '');
  };

  const handleChange = (fieldName: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields
    const allTouched = {
      fullName: true,
      email: true,
      phone: true,
      insuranceProvider: true,
      medicalHistory: true,
    };
    setTouched(allTouched);

    const result = patientSchema.safeParse(formData);

    if (result.success) {
      onSubmit(result.data);
    } else {
      const newErrors: FieldErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof PatientFormData;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);

      // Focus first invalid field
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  };

  const hasError = (field: keyof PatientFormData) => touched[field] && errors[field];
  const isFormValid = Object.keys(errors).every(k => !errors[k as keyof FieldErrors]) &&
    formData.fullName && formData.email && formData.phone && formData.insuranceProvider;

  const displayDate = new Date(date).toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#14201D] mb-2">Completa tus datos</h2>
          <p className="text-[#14201D]/70">Verificaremos tu información antes de confirmar</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#0F5E52] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 rounded"
          disabled={isSubmitting}
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {/* Appointment Summary */}
      <div className="bg-[#0F5E52]/5 rounded-xl p-4 border border-[#0F5E52]/10">
        <h3 className="text-sm font-semibold text-[#14201D] mb-2">Resumen de tu cita</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-[#14201D]/60">Especialidad: </span>
            <span className="font-medium text-[#14201D]">{specialty.name}</span>
          </div>
          <div>
            <span className="text-[#14201D]/60">Médico: </span>
            <span className="font-medium text-[#14201D]">{doctor.name}</span>
          </div>
          <div>
            <span className="text-[#14201D]/60">Fecha: </span>
            <span className="font-medium text-[#14201D] capitalize">{displayDate}</span>
          </div>
          <div>
            <span className="text-[#14201D]/60">Hora: </span>
            <span className="font-medium text-[#14201D]">{slot.time}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#14201D] mb-2">
            Nombre completo *
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[#14201D] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasError('fullName')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-[#0F5E52]/20 hover:border-[#0F5E52]/40'
            }`}
            placeholder="Juan Pérez García"
            aria-invalid={hasError('fullName') ? 'true' : 'false'}
            aria-describedby={hasError('fullName') ? 'fullName-error' : undefined}
          />
          {hasError('fullName') && (
            <p id="fullName-error" className="flex items-center gap-1 mt-1 text-sm text-red-600" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#14201D] mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[#14201D] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasError('email')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-[#0F5E52]/20 hover:border-[#0F5E52]/40'
            }`}
            placeholder="tu@email.com"
            aria-invalid={hasError('email') ? 'true' : 'false'}
            aria-describedby={hasError('email') ? 'email-error' : undefined}
          />
          {hasError('email') && (
            <p id="email-error" className="flex items-center gap-1 mt-1 text-sm text-red-600" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#14201D] mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[#14201D] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasError('phone')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-[#0F5E52]/20 hover:border-[#0F5E52]/40'
            }`}
            placeholder="+51 998 765 432"
            aria-invalid={hasError('phone') ? 'true' : 'false'}
            aria-describedby={hasError('phone') ? 'phone-error' : undefined}
          />
          {hasError('phone') && (
            <p id="phone-error" className="flex items-center gap-1 mt-1 text-sm text-red-600" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Insurance Provider */}
        <div>
          <label htmlFor="insuranceProvider" className="block text-sm font-medium text-[#14201D] mb-2">
            Seguro de salud *
          </label>
          <select
            id="insuranceProvider"
            name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={e => handleChange('insuranceProvider', e.target.value)}
            onBlur={() => handleBlur('insuranceProvider')}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[#14201D] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasError('insuranceProvider')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-[#0F5E52]/20 hover:border-[#0F5E52]/40'
            }`}
            aria-invalid={hasError('insuranceProvider') ? 'true' : 'false'}
            aria-describedby={hasError('insuranceProvider') ? 'insuranceProvider-error' : undefined}
          >
            <option value="">Selecciona tu seguro</option>
            {insuranceProviders.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          {hasError('insuranceProvider') && (
            <p id="insuranceProvider-error" className="flex items-center gap-1 mt-1 text-sm text-red-600" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.insuranceProvider}
            </p>
          )}
        </div>

        {/* Medical History */}
        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-[#14201D] mb-2">
            Antecedentes médicos (opcional)
          </label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory || ''}
            onChange={e => handleChange('medicalHistory', e.target.value)}
            onBlur={() => handleBlur('medicalHistory')}
            disabled={isSubmitting}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[#14201D] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
              hasError('medicalHistory')
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-[#0F5E52]/20 hover:border-[#0F5E52]/40'
            }`}
            placeholder="Alergias, medicamentos actuales, condiciones relevantes..."
            aria-invalid={hasError('medicalHistory') ? 'true' : 'false'}
            aria-describedby={hasError('medicalHistory') ? 'medicalHistory-error' : 'medicalHistory-hint'}
          />
          <div className="flex justify-between mt-1">
            {hasError('medicalHistory') ? (
              <p id="medicalHistory-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.medicalHistory}
              </p>
            ) : (
              <p id="medicalHistory-hint" className="text-sm text-[#14201D]/50">
                {(formData.medicalHistory || '').length}/500 caracteres
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="flex items-center gap-2 px-6 py-3 bg-[#0F5E52] text-white rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0F5E52]/90"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Confirmando...
              </>
            ) : (
              <>
                Confirmar cita
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
