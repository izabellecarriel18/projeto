import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'MARCA' },
    { id: 'products', label: 'ARQUIVOS' },
    { id: 'courses', label: 'CURSOS' },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer z-50"
          onClick={() => onNavigate('home')}
        >
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          <span className="text-base sm:text-xl font-bold text-white tracking-wider">
            ULTIMATECAR<span className="text-red-600">3D</span>
          </span>
        </div>

        <button
          className="lg:hidden text-white z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <nav className="hidden lg:flex gap-0 absolute left-1/2 transform -translate-x-1/2 ml-12">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`text-sm font-medium transition-colors px-6 ${
                currentPage === item.id
                  ? 'text-red-600'
                  : 'text-white hover:text-red-600'
              } ${index === 0 ? 'border-l border-gray-700' : ''} border-r border-gray-700`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm lg:hidden">
            <nav className="flex flex-col items-center justify-center h-full gap-0 px-6">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`text-lg font-medium transition-colors py-6 w-full text-center ${
                    currentPage === item.id
                      ? 'text-red-600'
                      : 'text-white hover:text-red-600'
                  } ${index === 0 ? 'border-t border-gray-700' : ''} border-b border-gray-700`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
