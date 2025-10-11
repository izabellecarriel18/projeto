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
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Diferenciais
        </h2>

        <div className="md:hidden overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {differentials.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 hover:border-red-600 transition-all flex-shrink-0"
                style={{ width: '300px' }}
              >
                <div className="bg-red-600/10 p-4 rounded-full">
                  <item.icon className="w-10 h-10 text-red-600" />
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white text-base leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block px-4">
          <div className="space-y-6">
            {differentials.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 flex flex-row items-center gap-6 hover:border-red-600 transition-all"
              >
                <div className="bg-red-600/10 p-6 rounded-full">
                  <item.icon className="w-12 h-12 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditableBackgroundImage>
  );
}
