import { ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  onNavigate: (page: string) => void;
}

export default function FinalCTA({ onNavigate }: FinalCTAProps) {
  return (
    <section className="py-12 sm:py-20 flex items-center" style={{ minHeight: 'calc(12rem + 5rem)' }}>
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
          Pronto para elevar suas modelagens?
        </h2>
        <p className="text-base sm:text-lg text-gray-900 mb-8 sm:mb-10 max-w-xl mx-auto px-4">
          Acesse nossa biblioteca completa de modelos 3D e cursos especializados
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button
            onClick={() => onNavigate('products')}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Ver Arquivos
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Ver Cursos
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
