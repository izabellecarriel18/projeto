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
      className="py-12 sm:py-20 flex items-center"
      style={{ minHeight: '67.5vh' }}
    >
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          Diferenciais
        </h2>

        <div className="space-y-3">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-all"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-600/10 p-3 rounded-full">
                    <item.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-red-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 pl-16 sm:pl-20">
                  <p className="text-white text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditableBackgroundImage>
  );
}
