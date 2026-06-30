# Minda Code — Centro de Traumatología y Ortopedia

Aplicación web para reserva de citas médicas de la clínica **Minda Code** especializada en traumatología y ortopedia. Desarrollada con React + TypeScript + Vite + TailwindCSS.

## Funcionalidades

- Perfil del doctor, servicios y galería de casos (antes/después)
- Flujo de reserva en 3 pasos: especialidad → fecha/hora → datos del paciente
- Validación de formularios con Zod
- Ticket de confirmación descargable con código único
- Integración con Google Calendar
- Diseño responsive y accesible (WAI-ARIA)

## Tecnologías

- **React 18** + **TypeScript**
- **Vite 5** (build tool)
- **TailwindCSS 3**
- **Zod** (validación de datos)
- **Lucide React** (iconos)

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## Build de producción

```bash
# Compila TypeScript y genera el bundle optimizado
npm run build

# Previsualizar el bundle localmente
npm run preview
```

## Estructura del proyecto

```
src/
├── components/       # Componentes React
│   ├── ErrorBoundary.tsx
│   ├── Hero.tsx
│   ├── DoctorProfile.tsx
│   ├── Services.tsx
│   ├── BeforeAfterGallery.tsx
│   ├── XrayGallery.tsx
│   ├── SpecialtyAndDoctor.tsx
│   ├── CalendarAndSlots.tsx
│   ├── PatientForm.tsx
│   └── BookingSuccess.tsx
├── hooks/
│   └── useBooking.ts  # Estado del flujo de reserva
├── lib/
│   └── validation.ts  # Schemas Zod
├── services/
│   └── api.ts         # Capa de datos (mock → reemplazar con API real)
├── types/
│   └── index.ts
└── App.tsx
```

## Siguiente paso hacia producción

1. Reemplazar las funciones mock en `src/services/api.ts` con llamadas reales (Supabase, REST API, etc.)
2. Configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env`
3. Configurar el hosting (Vercel, Netlify, etc.)
4. Agregar `VITE_SITE_URL` para los meta tags canónicos
