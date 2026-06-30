import { Activity, Bone, Trophy, Scissors, CheckCircle } from 'lucide-react';
import { services } from '../services/api';

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity className="w-7 h-7" />,
  bone: <Bone className="w-7 h-7" />,
  trophy: <Trophy className="w-7 h-7" />,
  scissors: <Scissors className="w-7 h-7" />,
};

interface ServicesProps {
  onBookAppointment: () => void;
}

export function Services({ onBookAppointment }: ServicesProps) {
  return (
    <section className="py-16 sm:py-24 bg-[#F7F8F7]" id="servicios">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#14201D] mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-[#14201D]/70 max-w-2xl mx-auto">
            Tratamientos especializados con tecnología de última generación y técnicas quirúrgicas avanzadas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-xl p-6 sm:p-8 border border-[#0F5E52]/10 hover:shadow-xl hover:border-[#0F5E52]/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#0F5E52]/10 group-hover:bg-[#0F5E52] flex items-center justify-center transition-colors duration-300">
                  <span className="text-[#0F5E52] group-hover:text-white transition-colors duration-300">
                    {iconMap[service.icon] || <Activity className="w-7 h-7" />}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#14201D] mb-1">{service.title}</h3>
                  <p className="text-[#14201D]/70 text-sm">{service.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mt-4">
                {service.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#14201D]/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#0F5E52] flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onBookAppointment}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F5E52] text-white font-semibold rounded-xl hover:bg-[#0F5E52]/90 transition-colors shadow-lg"
          >
            Agendar una Consulta
          </button>
        </div>
      </div>
    </section>
  );
}
