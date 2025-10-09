import { Zap } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center mb-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Zap className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold text-white tracking-wider">
              ULTIMATECAR<span className="text-red-600">3D</span>
            </span>
          </div>
        </div>

        <nav className="flex gap-6 justify-center">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'home'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Marca
          </button>
          <button
            onClick={() => onNavigate('solid-cars')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'solid-cars'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Carros Sólidos
          </button>
          <button
            onClick={() => onNavigate('complete-cars')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'complete-cars'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Carros Completos
          </button>
          <button
            onClick={() => onNavigate('wheels')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'wheels'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Rodas
          </button>
          <button
            onClick={() => onNavigate('bus-truck')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'bus-truck'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Ônibus e Caminhão
          </button>
          <button
            onClick={() => onNavigate('request-file')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'request-file'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Solicitar Criação de Arquivo
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'courses'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Cursos
          </button>
        </nav>
      </div>
    </header>
  );
}
