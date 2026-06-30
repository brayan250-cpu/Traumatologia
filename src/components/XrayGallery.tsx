import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { xrayGallery } from '../services/api';

export function XrayGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-[#14201D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Galería de Imágenes Médicas
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Radiografías y estudios de procedimientos realizados. Visualización de resultados post-operatorios.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {xrayGallery.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelectedImage(i)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-[#1a2a27] border border-white/10 hover:border-[#C97A3D]/50 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14201D] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={xrayGallery[selectedImage].image}
              alt={xrayGallery[selectedImage].title}
              className="w-full rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
              <h3 className="text-xl font-semibold text-white mb-1">
                {xrayGallery[selectedImage].title}
              </h3>
              <p className="text-white/80">{xrayGallery[selectedImage].description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
