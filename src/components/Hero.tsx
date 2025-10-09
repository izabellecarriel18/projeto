import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

function AnimatedPaths() {
  const paths = Array.from({ length: 30 }, (_, i) => {
    const offset = i * 15;
    const yOffset = i * 8;
    return {
      id: i,
      d: `M-${380 + offset} -${189 + yOffset}C-${380 + offset} -${189 + yOffset} -${312 + offset} ${216 - yOffset} ${152 + offset} ${343 - yOffset}C${616 + offset} ${470 - yOffset} ${684 + offset} ${875 - yOffset} ${684 + offset} ${875 - yOffset}`,
      opacity: 0.03 + i * 0.015,
      width: 0.5 + i * 0.02,
      duration: 15 + i * 0.5,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            className="animate-pulse"
            style={{
              animationDuration: `${path.duration}s`,
              animationDelay: `${path.id * 0.3}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-black to-neutral-900">
      <AnimatedPaths />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Domine a Modelagem 3D
          <br />
          <span className="text-red-600">Automotiva</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Modelos 3D premium e cursos profissionais para elevar suas criações ao próximo nível
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('products')}
            className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
          >
            Ver Arquivos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="group border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
          >
            Ver Cursos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
