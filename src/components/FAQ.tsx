import { ChevronDown, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EditableBackgroundImage from './EditableBackgroundImage';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQProps {
  category?: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'Os modelos funcionam em qual software?',
    answer: 'Fornecemos modelos no formato .STL, garantindo compatibilidade com 3ds Max, blender, auto cad, maya, sketchup, dentre outros.',
    category: 'general'
  },
  {
    id: '2',
    question: 'Como funciona o suporte?',
    answer: 'Oferecemos suporte via Direct e Whatzapp para todos os alunos e clientes, com o intuito de te auxiliar no que for necessário.',
    category: 'general'
  },
  {
    id: '3',
    question: 'Quais softwares são usados no curso?',
    answer: 'Nossos cursos utilizam 3ds Max, ensinando a instalação e seu uso.',
    category: 'general'
  },
  {
    id: '4',
    question: 'Qual o nível recomendado para este curso?',
    answer: 'Este curso é recomendado para iniciantes e intermediários que desejam aprimorar suas habilidades em modelagem automotiva 3D.',
    category: 'general'
  },
  {
    id: '5',
    question: 'O que aprendo no curso?',
    answer: 'O curso te ensina modelagem 3D, que serve para impressão, jogos ou renderização.',
    category: 'general'
  }
];

export default function FAQ({ category = 'general' }: FAQProps) {
  const { profile } = useAuth();
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqImage, setFaqImage] = useState<string>('https://i.imgur.com/6FLvE4U.jpg');
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadFAQs();
    loadFaqImage();
  }, [category]);

  async function loadFAQs() {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (data && data.length > 0) {
      setFaqs(data);
    }
  }

  async function loadFaqImage() {
    const { data } = await supabase
      .from('site_images')
      .select('image_url, default_url')
      .eq('slot_id', 'faq_bg')
      .maybeSingle();

    if (data) {
      setFaqImage(data.image_url || data.default_url);
    }
  }

  return (
    <EditableBackgroundImage
      slotId="faq_bg"
      currentUrl={faqImage}
      isAdmin={isAdmin}
      onUpdate={loadFaqImage}
      className="py-16 sm:py-24 flex items-center gradient-overlay"
      style={{ minHeight: '75vh' }}
      overlayClassName="bg-black/70"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
        <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-12 sm:mb-16 text-shadow-xl">
          Perguntas Frequentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden hover:border-red-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-600/20 group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-5 sm:px-7 py-5 sm:py-6 text-left"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 p-3.5 rounded-xl group-hover:from-red-600/30 group-hover:to-red-700/30 transition-all duration-300 shadow-lg">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 group-hover:text-red-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-red-500 transition-colors duration-300">{faq.question}</h3>
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
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed pt-4">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
      </div>
    </EditableBackgroundImage>
  );
}
