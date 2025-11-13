import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EditableBackgroundImage from './EditableBackgroundImage';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { profile } = useAuth();
  const [heroImage, setHeroImage] = useState<string>('https://i.imgur.com/HtRfEMb.jpeg');
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadHeroImage();
  }, []);

  async function loadHeroImage() {
    const { data } = await supabase
      .from('site_images')
      .select('image_url, default_url')
      .eq('slot_id', 'hero_bg')
      .maybeSingle();

    if (data) {
      setHeroImage(data.image_url || data.default_url);
    }
  }

  return (
    <EditableBackgroundImage
      slotId="hero_bg"
      currentUrl={heroImage}
      isAdmin={isAdmin}
      onUpdate={loadHeroImage}
      className="flex items-center justify-center overflow-hidden px-4 gradient-overlay"
      style={{ minHeight: '85vh' }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight animate-fade-in-up text-shadow-xl">
          Domine a Modelagem 3D
          <br />
          <span className="text-red-600 bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
            Automotiva
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-10 sm:mb-14 max-w-3xl mx-auto px-4 leading-relaxed animate-fade-in-up animation-delay-200 text-shadow-lg font-medium">
          Modelos 3D prontos para impressão e renderização. Os Arquivos são feitos em alta qualidade, todos reforçados e sem exagero de espessura, mantendo a aparência do veículo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 animate-fade-in-up animation-delay-400">
          <button
            onClick={() => onNavigate('products')}
            className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Ver Arquivos</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="group relative bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl hover:shadow-2xl hover:shadow-gray-800/50 hover:scale-105 border border-gray-700 hover:border-gray-600 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Ver Cursos</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </EditableBackgroundImage>
  );
}
