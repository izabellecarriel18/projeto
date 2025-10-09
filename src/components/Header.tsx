import { Car } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <Car className="w-8 h-8 text-red-600" />
          <span className="text-xl font-bold text-white tracking-wider">
            ULTIMATECARS<span className="text-red-600">3D</span>
          </span>
        </div>

        <nav className="flex gap-8">
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
            onClick={() => onNavigate('products')}
            className={`text-sm font-medium transition-colors ${
              currentPage === 'products'
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Arquivos Prontos
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
