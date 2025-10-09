import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQProps {
  category?: string;
}

export default function FAQ({ category = 'general' }: FAQProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    loadFAQs();
  }, [category]);

  async function loadFAQs() {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (data) {
      setFaqs(data);
    }
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12 sm:py-20 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://i.imgur.com/6FLvE4U.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-16">
          Perguntas Frequentes
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left"
              >
                <span className="text-white font-semibold text-base sm:text-lg">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-red-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
