import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundPaths from './components/BackgroundPaths';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import InstructionsPage from './pages/InstructionsPage';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';
import PurchasesPage from './pages/PurchasesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

const removeFloating = () => {
  document.querySelectorAll('[style*="position: fixed"][style*="bottom: 1rem"][style*="right: 1rem"][style*="z-index: 2147483647"]').forEach(el => el.remove());
};

// executa já no load
removeFloating();

// observa mudanças no DOM
const observer = new MutationObserver(removeFloating);
observer.observe(document.body, { childList: true, subtree: true });

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const hasSessionId = urlParams.get('session_id');
  const [currentPage, setCurrentPage] = useState(hasSessionId ? 'payment-success' : 'home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen">
          <BackgroundPaths />
          <Header onNavigate={handleNavigate} currentPage={currentPage} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'instructions' && <InstructionsPage />}
      {currentPage === 'courses' && <CoursesPage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'purchases' && <PurchasesPage />}
      {currentPage === 'payment-success' && <PaymentSuccessPage onNavigate={handleNavigate} />}

        <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
