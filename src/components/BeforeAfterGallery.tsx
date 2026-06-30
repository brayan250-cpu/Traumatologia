import { useState } from 'react';
import { ArrowLeftRight, CheckCircle, User } from 'lucide-react';
import { beforeAfterCases } from '../services/api';

export function BeforeAfterGallery() {
  const [activeCase, setActiveCase] = useState(0);
  const [showAfter, setShowAfter] = useState(true);

  const currentCase = beforeAfterCases[activeCase];

  return (
    <section className="py-16 sm:py-24 bg-white" id="casos">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#14201D] mb-4">
            Casos de Éxito
          </h2>
          <p className="text-[#14201D]/70 max-w-2xl mx-auto">
            Resultados reales de pacientes tratados por el Dr. Minda. Cada caso muestra
            el antes y después del tratamiento.
          </p>
        </div>

        {/* Case Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {beforeAfterCases.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCase(i);
                setShowAfter(false);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeCase === i
                  ? 'bg-[#0F5E52] text-white shadow-md'
                  : 'bg-[#F7F8F7] text-[#14201D] hover:bg-[#0F5E52]/10'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Active Case Display */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Images */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={showAfter ? currentCase.afterImage : currentCase.beforeImage}
                alt={`${showAfter ? 'Después' : 'Antes'} - ${currentCase.title}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Overlay Labels */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    !showAfter
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-[#14201D]'
                  }`}
                >
                  Antes
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    showAfter
                      ? 'bg-green-500 text-white'
                      : 'bg-white/80 text-[#14201D]'
                  }`}
                >
                  Después
                </span>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowAfter(!showAfter)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-[#0F5E52]/20"
            >
              <ArrowLeftRight className="w-5 h-5 text-[#0F5E52]" />
              <span className="font-medium text-[#14201D]">
                Ver {showAfter ? 'Antes' : 'Después'}
              </span>
            </button>
          </div>

          {/* Details */}
          <div className="bg-[#F7F8F7] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#14201D] mb-2">{currentCase.title}</h3>
              <div className="flex items-center gap-2 text-[#14201D]/70">
                <User className="w-4 h-4" />
                <span>{currentCase.patient}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-[#0F5E52]/10">
                <p className="text-sm text-[#14201D]/60 mb-1">Condición</p>
                <p className="font-medium text-[#14201D]">{currentCase.condition}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#0F5E52]/10">
                <p className="text-sm text-[#14201D]/60 mb-1">Procedimiento</p>
                <p className="font-medium text-[#14201D]">{currentCase.procedure}</p>
              </div>

              <div>
                <p className="text-[#14201D]/80">{currentCase.description}</p>
              </div>
            </div>

            {/* Result Badge */}
            <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-700 font-medium">Resultado</p>
                <p className="text-green-800">{currentCase.result}</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Cases Grid Summary */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beforeAfterCases.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCase(i)}
              className={`group text-left p-6 rounded-xl transition-all duration-300 ${
                activeCase === i
                  ? 'bg-[#0F5E52] text-white shadow-lg'
                  : 'bg-[#F7F8F7] hover:bg-[#0F5E52]/10'
              }`}
            >
              <img
                src={c.afterImage}
                alt=""
                className="w-full aspect-video object-cover rounded-lg mb-4"
              />
              <h4 className={`font-semibold mb-1 ${
                activeCase === i ? 'text-white' : 'text-[#14201D]'
              }`}>
                {c.title}
              </h4>
              <p className={`text-sm ${
                activeCase === i ? 'text-white/80' : 'text-[#14201D]/60'
              }`}>
                {c.patient}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
