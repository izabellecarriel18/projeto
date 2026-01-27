import { Menu, X, User, LogOut, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './AuthModal';
import CartModal from './CartModal';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const { totalItems } = useCart();

  const menuItems = [
    { id: 'home', label: 'MARCA' },
    { id: 'instructions', label: 'INSTRUÇÕES E USO' },
    { id: 'products', label: 'ARQUIVOS' },
    { id: 'courses', label: 'CURSOS' },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-950/70 backdrop-blur-sm z-[210] lg:border-b lg:border-blue-900/50 safe-top">
      <div className="container mx-auto px-4 sm:px-6 py-4 lg:py-4 flex items-center justify-center lg:justify-between">
        <div
          className="cursor-pointer z-[220]"
          onClick={() => onNavigate('home')}
        >
          <img
            src="https://i.imgur.com/HZU5pso.png"
            alt="ULTIMATECAR3D"
            className="h-6 sm:h-8 lg:h-10 w-auto scale-x-[1.2] scale-y-[1.2] lg:scale-x-150 lg:scale-y-150"
          />
        </div>

        <button
          className="lg:hidden text-white z-[220] absolute right-4 sm:right-6"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <nav className="hidden lg:flex gap-0 absolute left-1/2 transform -translate-x-1/2">
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
                  <>
                    <button
                      onClick={() => setCartModalOpen(true)}
                      className="flex items-center gap-2 text-white hover:text-red-600 transition-colors relative"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {totalItems}
                        </span>
                      )}
                      <span className="text-sm font-medium">CARRINHO</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('purchases')}
                      className={`flex items-center gap-2 transition-colors ${
                        currentPage === 'purchases' ? 'text-red-600' : 'text-white hover:text-red-600'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-sm font-medium">COMPRAS</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleNavigation('profile')}
                  className="flex items-center gap-2 text-white hover:text-red-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{profile.name}</span>
                </button>
                <button
                  onClick={() => signOut(onNavigate)}
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

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        <CartModal isOpen={cartModalOpen} onClose={() => setCartModalOpen(false)} />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-[#0a1628] lg:hidden z-[200]">
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
                  <>
                    <button
                      onClick={() => {
                        setCartModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 text-white hover:text-red-600 transition-colors py-6 w-full border-b border-gray-700 relative"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className="absolute top-4 left-1/2 -ml-8 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {totalItems}
                        </span>
                      )}
                      <span className="text-lg font-medium">CARRINHO</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('purchases')}
                      className="flex items-center justify-center gap-2 text-white hover:text-red-600 transition-colors py-6 w-full border-b border-gray-700"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-lg font-medium">COMPRAS</span>
                    </button>
                  </>
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
                    signOut(onNavigate);
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
    </header>
  );
}
