import { Shield, Zap, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EditableBackgroundImage from './EditableBackgroundImage';

export default function Differentials() {
  const { profile } = useAuth();
  const [differentialsImage, setDifferentialsImage] = useState<string>('https://i.imgur.com/nHXjTtQ.jpg');
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadDifferentialsImage();
  }, []);

  async function loadDifferentialsImage() {
    const { data } = await supabase
      .from('site_images')
      .select('image_url, default_url')
      .eq('slot_id', 'differentials_bg')
      .maybeSingle();

    if (data) {
      setDifferentialsImage(data.image_url || data.default_url);
    }
  }

  const differentials = [
    {
      icon: Shield,
      title: 'Qualidade Impecável',
      description:
        'Modelos 3D de alta fidelidade, os mínimos detalhes são nosso foco.',
    },
    {
      icon: Zap,
      title: 'Técnicas Avançadas',
      description:
        'Cursos com técnicas de modelagem utilizadas por profissionais da indústria.',
    },
    {
      icon: Headphones,
      title: 'Suporte Especializado',
      description:
        'Suporte direto para tirar suas dúvidas e fazer orçamentos.',
    },
  ];

  return (
    <EditableBackgroundImage
      slotId="differentials_bg"
      currentUrl={differentialsImage}
      isAdmin={isAdmin}
      onUpdate={loadDifferentialsImage}
      className="py-12 sm:py-20 flex items-center"
      style={{ minHeight: '67.5vh' }}
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          Diferenciais
        </h2>

        <div className="max-w-2xl mx-auto space-y-3">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-all"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-600/10 p-2 rounded-full flex-shrink-0">
                    <item.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-white font-semibold text-base sm:text-lg">{item.title}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-red-600 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                  <p className="text-white text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </EditableBackgroundImage>
  );
}
