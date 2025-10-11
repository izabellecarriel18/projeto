import { Zap, Menu, X, User, LogOut, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();

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

        {!loading && (
          <>
            {user && profile ? (
              <div className="hidden lg:flex items-center gap-4">
                {profile.role !== 'admin' && (
                  <button
                    onClick={() => handleNavigation('purchases')}
                    className={`flex items-center gap-2 transition-colors ${
                      currentPage === 'purchases' ? 'text-red-600' : 'text-white hover:text-red-600'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm font-medium">MINHAS COMPRAS</span>
                  </button>
                )}
                <button
                  onClick={() => handleNavigation('profile')}
                  className="flex items-center gap-2 text-white hover:text-red-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{profile.name}</span>
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-white hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">SAIR</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden lg:flex items-center gap-2 text-white hover:text-red-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">LOGIN</span>
              </button>
            )}
          </>
        )}

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
              {user && profile ? (
                <>
                  {profile.role !== 'admin' && (
                    <button
                      onClick={() => handleNavigation('purchases')}
                      className="flex items-center justify-center gap-2 text-white hover:text-red-600 transition-colors py-6 w-full border-b border-gray-700"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-lg font-medium">MINHAS COMPRAS</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNavigation('profile')}
                    className="flex items-center justify-center gap-2 text-white hover:text-red-600 transition-colors py-6 w-full border-b border-gray-700"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-lg font-medium">CREDENCIAIS</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 text-white hover:text-red-600 transition-colors py-6 w-full border-b border-gray-700"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-lg font-medium">SAIR</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-white hover:text-red-600 transition-colors py-6 w-full border-b border-gray-700"
                >
                  <User className="w-5 h-5" />
                  <span className="text-lg font-medium">LOGIN</span>
                </button>
              )}
            </nav>
          </div>
        )}

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </header>
  );
}
