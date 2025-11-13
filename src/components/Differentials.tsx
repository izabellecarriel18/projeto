import { Shield, Zap, Headphones, ChevronDown, Printer, Package, Ruler } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EditableBackgroundImage from './EditableBackgroundImage';

export default function Differentials() {
  const { profile } = useAuth();
  const [differentialsImage, setDifferentialsImage] = useState<string>('https://i.imgur.com/nHXjTtQ.jpg');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    {
      icon: Printer,
      title: 'Compatibilidade com impressora',
      description:
        'Os arquivos servem em qualquer impressora do mercado, sem problemas com compatibilidade.',
    },
    {
      icon: Package,
      title: 'Matérias para impressão',
      description:
        'Podem ser utilizados resina e filamento.',
    },
    {
      icon: Ruler,
      title: 'Em qual tamanho pode ser impresso',
      description:
        'Arquivos feitos para qualquer escala. Partindo dos 5cm até 1m, ele pode ser dividido em partes em projetos maiores.',
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <EditableBackgroundImage
      slotId="differentials_bg"
      currentUrl={differentialsImage}
      isAdmin={isAdmin}
      onUpdate={loadDifferentialsImage}
      className="py-16 sm:py-24 flex items-center gradient-overlay"
      style={{ minHeight: '75vh' }}
    >
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4">
        <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-12 sm:mb-16 text-shadow-xl">
          Nossos Diferenciais
        </h2>

        <div className="space-y-4">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden hover:border-red-600/60 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 group"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between px-5 sm:px-7 py-5 sm:py-6 text-left"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 p-3.5 rounded-xl group-hover:from-red-600/30 group-hover:to-red-700/30 transition-all duration-300 shadow-lg">
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-red-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-red-500 transition-colors duration-300">{item.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-red-500 transition-all duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 sm:px-7 pb-5 sm:pb-6 pl-16 sm:pl-24 border-t border-gray-700/50">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed pt-4">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditableBackgroundImage>
  );
}
