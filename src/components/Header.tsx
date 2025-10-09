import { Zap } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <Zap className="w-8 h-8 text-red-600" />
          <span className="text-xl font-bold text-white tracking-wider">
            ULTIMATECAR<span className="text-red-600">3D</span>
          </span>
        </div>

        <nav className="flex gap-6 absolute left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'home'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            MARCA
          </button>
          <button
            onClick={() => onNavigate('solid-cars')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'solid-cars'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            CARROS SÓLIDOS
          </button>
          <button
            onClick={() => onNavigate('complete-cars')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'complete-cars'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            CARROS COMPLETOS
          </button>
          <button
            onClick={() => onNavigate('wheels')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'wheels'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            RODAS
          </button>
          <button
            onClick={() => onNavigate('bus-truck')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'bus-truck'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            ÔNIBUS E CAMINHÃO
          </button>
          <button
            onClick={() => onNavigate('request-file')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'request-file'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            SOLICITAR CRIAÇÃO DE ARQUIVO
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'courses'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            CURSOS
          </button>
        </nav>
      </div>
    </header>
  );
}
