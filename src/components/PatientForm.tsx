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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#fff', letterSpacing: '-.01em' }}>Completa tus datos</h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>Verificaremos tu información antes de confirmar</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-medium transition-colors"
          style={{ color: '#60A5FA', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
          disabled={isSubmitting}
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      {/* Resumen de cita */}
      <div style={{ background: 'rgba(59,130,246,.07)', border: '1px solid rgba(59,130,246,.2)', borderRadius: '14px', padding: '16px 20px' }}>
        <h3 style={{ fontSize: '12px', fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '.14em', textTransform: 'uppercase', color: '#60A5FA', marginBottom: '12px' }}>Resumen de tu cita</h3>
        <div className="grid sm:grid-cols-2 gap-2" style={{ fontSize: '14px' }}>
          <div><span style={{ color: 'rgba(255,255,255,.45)' }}>Especialidad: </span><span style={{ color: '#fff', fontWeight: 500 }}>{specialty.name}</span></div>
          <div><span style={{ color: 'rgba(255,255,255,.45)' }}>Médico: </span><span style={{ color: '#fff', fontWeight: 500 }}>{doctor.name}</span></div>
          <div><span style={{ color: 'rgba(255,255,255,.45)' }}>Fecha: </span><span style={{ color: '#fff', fontWeight: 500, textTransform: 'capitalize' }}>{displayDate}</span></div>
          <div><span style={{ color: 'rgba(255,255,255,.45)' }}>Hora: </span><span style={{ color: '#fff', fontWeight: 500 }}>{slot.time}</span></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Estilos compartidos para inputs */}
        <style>{`
          .dark-input {
            width: 100%; padding: 12px 16px; border-radius: 10px;
            background: rgba(255,255,255,.06);
            border: 1px solid rgba(255,255,255,.14);
            color: #fff; font-size: 15px;
            transition: border-color .2s, box-shadow .2s;
            outline: none;
          }
          .dark-input::placeholder { color: rgba(255,255,255,.3); }
          .dark-input:hover { border-color: rgba(255,255,255,.28); }
          .dark-input:focus { border-color: #60A5FA; box-shadow: 0 0 0 3px rgba(96,165,250,.15); }
          .dark-input:disabled { opacity: .5; cursor: not-allowed; }
          .dark-input.error { border-color: #f87171; }
          .dark-input.error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,.15); }
          .dark-label { display: block; font-size: 13px; font-weight: 500; color: rgba(255,255,255,.65); margin-bottom: 7px; }
        `}</style>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="dark-label">Nombre completo *</label>
          <input
            ref={nameInputRef}
            type="text" id="fullName" name="fullName"
            value={formData.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            disabled={isSubmitting}
            className={`dark-input${hasError('fullName') ? ' error' : ''}`}
            placeholder="Juan Pérez García"
            aria-invalid={hasError('fullName') ? 'true' : 'false'}
          />
          {hasError('fullName') && (
            <p className="flex items-center gap-1 mt-1.5" style={{ fontSize: '13px', color: '#f87171' }} role="alert">
              <AlertCircle className="w-3.5 h-3.5" />{errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="dark-label">Correo electrónico *</label>
          <input
            type="email" id="email" name="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={isSubmitting}
            className={`dark-input${hasError('email') ? ' error' : ''}`}
            placeholder="tu@email.com"
            aria-invalid={hasError('email') ? 'true' : 'false'}
          />
          {hasError('email') && (
            <p className="flex items-center gap-1 mt-1.5" style={{ fontSize: '13px', color: '#f87171' }} role="alert">
              <AlertCircle className="w-3.5 h-3.5" />{errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="dark-label">Teléfono *</label>
          <input
            type="tel" id="phone" name="phone"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            disabled={isSubmitting}
            className={`dark-input${hasError('phone') ? ' error' : ''}`}
            placeholder="+51 998 765 432"
            aria-invalid={hasError('phone') ? 'true' : 'false'}
          />
          {hasError('phone') && (
            <p className="flex items-center gap-1 mt-1.5" style={{ fontSize: '13px', color: '#f87171' }} role="alert">
              <AlertCircle className="w-3.5 h-3.5" />{errors.phone}
            </p>
          )}
        </div>

        {/* Insurance */}
        <div>
          <label htmlFor="insuranceProvider" className="dark-label">Seguro de salud *</label>
          <select
            id="insuranceProvider" name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={e => handleChange('insuranceProvider', e.target.value)}
            onBlur={() => handleBlur('insuranceProvider')}
            disabled={isSubmitting}
            className={`dark-input${hasError('insuranceProvider') ? ' error' : ''}`}
            style={{ appearance: 'auto' } as React.CSSProperties}
            aria-invalid={hasError('insuranceProvider') ? 'true' : 'false'}
          >
            <option value="" style={{ background: '#0d1117' }}>Selecciona tu seguro</option>
            {insuranceProviders.map(p => (
              <option key={p.id} value={p.id} style={{ background: '#0d1117' }}>{p.name}</option>
            ))}
          </select>
          {hasError('insuranceProvider') && (
            <p className="flex items-center gap-1 mt-1.5" style={{ fontSize: '13px', color: '#f87171' }} role="alert">
              <AlertCircle className="w-3.5 h-3.5" />{errors.insuranceProvider}
            </p>
          )}
        </div>

        {/* Medical history */}
        <div>
          <label htmlFor="medicalHistory" className="dark-label">Antecedentes médicos <span style={{ color: 'rgba(255,255,255,.35)' }}>(opcional)</span></label>
          <textarea
            id="medicalHistory" name="medicalHistory"
            value={formData.medicalHistory || ''}
            onChange={e => handleChange('medicalHistory', e.target.value)}
            onBlur={() => handleBlur('medicalHistory')}
            disabled={isSubmitting}
            rows={3}
            className={`dark-input${hasError('medicalHistory') ? ' error' : ''}`}
            style={{ resize: 'none' }}
            placeholder="Alergias, medicamentos actuales, condiciones relevantes..."
          />
          <div className="flex justify-between mt-1">
            {hasError('medicalHistory') ? (
              <p className="flex items-center gap-1" style={{ fontSize: '13px', color: '#f87171' }} role="alert">
                <AlertCircle className="w-3.5 h-3.5" />{errors.medicalHistory}
              </p>
            ) : (
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.3)' }}>{(formData.medicalHistory || '').length}/500</span>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="flex items-center gap-2 font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#fff', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 16px 40px -12px rgba(59,130,246,.45)' }}
          >
            {isSubmitting ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />Confirmando...</>
            ) : (
              <>Confirmar cita<Check className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
