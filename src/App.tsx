import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundPaths from './components/BackgroundPaths';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';
import PurchasesPage from './pages/PurchasesPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const hasSessionId = urlParams.get('session_id');
  const [currentPage, setCurrentPage] = useState(hasSessionId ? 'payment-success' : 'home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen">
          <BackgroundPaths />
          <Header onNavigate={handleNavigate} currentPage={currentPage} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'products' && <ProductsPage />}
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
