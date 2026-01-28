import { useState, useEffect } from 'react';
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
import { prefetch } from './lib/cache';
import { supabase } from './lib/supabase';

async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  const sorted = [...(data || [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );
  sorted.forEach((product) => {
    if (product.image_url) {
      const img = new Image();
      img.src = product.image_url;
    }
  });
  return sorted;
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const hasSessionId = urlParams.get('session_id');
  const [currentPage, setCurrentPage] = useState(hasSessionId ? 'payment-success' : 'home');

  useEffect(() => {
    prefetch('products', fetchProducts);
  }, []);

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

          <main className="safe-bottom pt-[56px] sm:pt-[64px] lg:pt-[72px]">
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'products' && <ProductsPage />}
            {currentPage === 'instructions' && <InstructionsPage />}
            {currentPage === 'courses' && <CoursesPage />}
            {currentPage === 'profile' && <ProfilePage />}
            {currentPage === 'purchases' && <PurchasesPage />}
            {currentPage === 'payment-success' && <PaymentSuccessPage onNavigate={handleNavigate} />}
          </main>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
