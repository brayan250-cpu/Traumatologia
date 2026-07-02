import { useState } from 'react';
import { X } from 'lucide-react';
import { xrayGallery } from '../services/api';

export function XrayGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="rayos-x" style={{ background: 'rgba(8,16,40,.92)', padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mx-auto mb-11" style={{ maxWidth: '640px' }}>
          <div className="inline-flex items-center gap-3 font-mono-mc font-medium uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '.2em', color: '#14B8A6' }}>
            <span style={{ width: '22px', height: '1px', background: '#14B8A6' }} />
            04 · Galería médica
          </div>
          <h2 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(30px,4.2vw,46px)', letterSpacing: '-.01em', lineHeight: '1.04', margin: '16px 0 14px' }}>
            Imágenes de procedimientos
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.6)', lineHeight: '1.55', margin: 0 }}>
            Radiografías y estudios post-operatorios. Toca cualquier imagen para ampliarla.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: '16px' }}>
          {xrayGallery.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelectedImage(i)}
              className="relative overflow-hidden rounded-[16px] group transition-all duration-300"
              style={{ aspectRatio: '1/1', background: '#1a2a27', border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
            >
              <img
loading="lazy" 
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                style={{ opacity: '.82' }}
              />
              {/* Always-visible overlay */}
              <div className="absolute inset-0 flex flex-col justify-end text-left" style={{ background: 'linear-gradient(180deg,transparent 45%,rgba(20,32,29,.9))', padding: '18px' }}>
                <div className="font-bold text-white" style={{ fontSize: '15px' }}>{item.title}</div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.7)', marginTop: '2px' }}>{item.description}</div>
              </div>
              {/* Zoom icon */}
              <span className="absolute flex items-center justify-center rounded-full" style={{ top: '14px', right: '14px', width: '36px', height: '36px', background: 'rgba(30, 30, 30, 0.6)', color: '#fff' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: '17px', height: '17px' }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,.9)' }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute flex items-center justify-center rounded-full text-white transition-colors"
            style={{ top: '20px', right: '20px', width: '48px', height: '48px', background: 'rgba(255,255,255,.12)', border: 'none', cursor: 'pointer' }}
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
            <img loading="lazy" src={xrayGallery[selectedImage].image} alt={xrayGallery[selectedImage].title} className="w-full rounded-[18px]" />
            <div className="absolute left-0 right-0 bottom-0 rounded-b-[18px] p-8" style={{ background: 'linear-gradient(0deg,rgba(0,0,0,.85),transparent)' }}>
              <h3 className="text-white font-bold mb-1" style={{ fontSize: '20px' }}>{xrayGallery[selectedImage].title}</h3>
              <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '15px' }}>{xrayGallery[selectedImage].description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


