import { Award, GraduationCap, Star, BadgeCheck } from 'lucide-react';
import { doctorInfo } from '../services/api';

export function DoctorProfile() {
  return (
    <section className="py-16 sm:py-24 bg-[#F7F8F7]" id="doctor">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={doctorInfo.photo}
                alt={doctorInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white rounded-xl p-4 shadow-xl border border-[#0F5E52]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0F5E52] flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#14201D]">{doctorInfo.experience}</p>
                  <p className="text-sm text-[#14201D]/60">de trayectoria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-[#0F5E52] font-semibold mb-2 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                Especialista Certificado
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#14201D] mb-2">
                {doctorInfo.name}
              </h2>
              <p className="text-lg text-[#14201D]/70">{doctorInfo.title}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(doctorInfo.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-[#14201D] font-semibold">{doctorInfo.rating}</span>
              <span className="text-[#14201D]/60">({doctorInfo.reviews} reseñas verificadas)</span>
            </div>

            {/* Credentials */}
            <div className="bg-white rounded-xl p-6 border border-[#0F5E52]/10">
              <h3 className="font-semibold text-[#14201D] mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0F5E52]" />
                Formación Académica
              </h3>
              <ul className="space-y-3">
                {doctorInfo.credentials.map((cred, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#14201D]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5E52] mt-2 flex-shrink-0"></span>
                    {cred}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="font-semibold text-[#14201D] mb-3">Áreas de Especialización</h3>
              <div className="flex flex-wrap gap-2">
                {doctorInfo.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[#0F5E52]/10 text-[#0F5E52] rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
