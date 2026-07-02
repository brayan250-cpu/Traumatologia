import { useState } from 'react';
import { ArrowLeftRight, CheckCircle, User } from 'lucide-react';
import { beforeAfterCases } from '../services/api';

export function BeforeAfterGallery() {
  const [activeCase, setActiveCase] = useState(0);
  const [showAfter, setShowAfter] = useState(true);

  const currentCase = beforeAfterCases[activeCase];

  return (
    <section id="casos" style={{ background: 'rgba(4,10,8,.82)', padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mx-auto mb-11" style={{ maxWidth: '640px' }}>
          <div className="inline-flex items-center gap-3 font-mono-mc font-medium uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '.2em', color: '#4DCFB0' }}>
            <span style={{ width: '22px', height: '1px', background: '#C97A3D' }} />
            03 · Casos de éxito
          </div>
          <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(30px,4.2vw,46px)', letterSpacing: '-.03em', lineHeight: '1.04', color: '#fff', margin: '16px 0 14px' }}>
            Resultados reales
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.55)', lineHeight: '1.55', margin: 0 }}>
            Cada caso muestra el antes y el después del tratamiento con el Dr. Minda.
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
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={{ border: activeCase === i ? 'none' : '1px solid rgba(255,255,255,.1)' }}
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
loading="lazy" 
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
                      : 'bg-white/20 text-white backdrop-blur-sm'
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
                      : 'bg-white/20 text-white backdrop-blur-sm'
                  }`}
                >
                  Después
                </span>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowAfter(!showAfter)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', color: '#fff' }}
            >
              <ArrowLeftRight className="w-5 h-5" style={{ color: '#4DCFB0' }} />
              <span className="font-medium">
                Ver {showAfter ? 'Antes' : 'Después'}
              </span>
            </button>
          </div>

          {/* Details */}
          <div className="rounded-2xl p-6 sm:p-8 space-y-6" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{currentCase.title}</h3>
              <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,.5)' }}>
                <User className="w-4 h-4" />
                <span>{currentCase.patient}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,.4)' }}>Condición</p>
                <p className="font-medium text-white">{currentCase.condition}</p>
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,.4)' }}>Procedimiento</p>
                <p className="font-medium text-white">{currentCase.procedure}</p>
              </div>

              <div>
                <p style={{ color: 'rgba(255,255,255,.65)' }}>{currentCase.description}</p>
              </div>
            </div>

            {/* Result Badge */}
            <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: 'rgba(15,200,100,.12)', border: '1px solid rgba(15,200,100,.22)' }}>
              <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#4DCFB0' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#4DCFB0' }}>Resultado</p>
                <p style={{ color: 'rgba(255,255,255,.8)' }}>{currentCase.result}</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Cases Grid Summary */}
        <div className="mt-14" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '18px' }}>
          {beforeAfterCases.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCase(i)}
              className="text-left overflow-hidden rounded-[16px] transition-all duration-300"
              style={{
                border: activeCase === i ? '2px solid #4DCFB0' : '1px solid rgba(255,255,255,.1)',
                background: activeCase === i ? 'rgba(15,200,160,.1)' : 'rgba(255,255,255,.04)',
                padding: 0,
              }}
            >
              <img
loading="lazy" 
                src={c.afterImage}
                alt={c.title}
                className="w-full object-cover"
                style={{ aspectRatio: '16/10', borderRadius: '12px 12px 0 0' }}
              />
              <div style={{ padding: '16px 18px 18px' }}>
                <div className="font-bold" style={{ fontSize: '15px', color: activeCase === i ? '#4DCFB0' : '#fff' }}>{c.title}</div>
                <div style={{ fontSize: '13px', marginTop: '3px', color: activeCase === i ? '#4DCFB0' : 'rgba(255,255,255,.45)' }}>{c.patient}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}



