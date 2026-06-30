import { z } from 'zod';

export const patientSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido'),
  phone: z
    .string()
    .regex(/^(\+51|51)?[9]\d{8}$/, 'El teléfono debe ser un número peruano válido (ej: +51987654321 o 998765432)'),
  insuranceProvider: z
    .string()
    .min(1, 'Selecciona un seguro de salud'),
  medicalHistory: z
    .string()
    .max(500, 'El historial médico no puede exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
});

export type PatientFormData = z.infer<typeof patientSchema>;

export const insuranceProviders = [
  { id: 'none', name: 'Particular (sin seguro)' },
  { id: 'rimac', name: 'Rímac Seguros' },
  { id: 'la_positiva', name: 'La Positiva Seguros' },
  { id: 'mapfre', name: 'Mapfre' },
  { id: 'pacifico', name: 'Pacifico Seguros' },
  { id: 'essalud', name: 'Essalud' },
  { id: 'sanitas', name: 'Sanitas' },
  { id: 'multicare', name: 'Multicare' },
  { id: 'other', name: 'Otro' },
];
