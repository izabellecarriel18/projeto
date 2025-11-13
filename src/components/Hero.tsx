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
      className="flex items-center justify-center overflow-hidden px-4"
      style={{ minHeight: '75vh' }}
    >

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Domine a Modelagem 3D
          <br />
          <span className="text-red-600">Automotiva</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          Modelos 3D prontos para impressão e renderização. Os Arquivos são feitos em alta qualidade, todos reforçados e sem exagero de espessura, mantendo a aparência do veiculo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button
            onClick={() => onNavigate('products')}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Ver Arquivos
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Ver Cursos
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </EditableBackgroundImage>
  );
}
