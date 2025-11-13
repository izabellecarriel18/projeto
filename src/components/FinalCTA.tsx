import { ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  onNavigate: (page: string) => void;
}

export default function FinalCTA({ onNavigate }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-24 flex items-center bg-gradient-to-b from-black via-red-950/10 to-black relative overflow-hidden" style={{ minHeight: 'calc(12rem + 5rem)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5" />
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-5xl relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8 text-shadow-xl leading-tight">
          Pronto para elevar suas
          <br />
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            modelagens?
          </span>
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 sm:mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
          Acesse nossa biblioteca completa de modelos 3D e cursos especializados
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
          <button
            onClick={() => onNavigate('products')}
            className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Ver Arquivos</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="group relative bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl hover:shadow-2xl hover:shadow-gray-800/50 hover:scale-105 border border-gray-700 hover:border-gray-600 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Ver Cursos</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
