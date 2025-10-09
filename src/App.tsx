import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BackgroundPaths from './components/BackgroundPaths';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CoursesPage from './pages/CoursesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <BackgroundPaths />
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'courses' && <CoursesPage />}

      <Footer />
    </div>
  );
}

export default App;
