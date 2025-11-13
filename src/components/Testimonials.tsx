import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  avatar_url: string;
  rating: number;
  text: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Os modelos 3D são incríveis! A qualidade da topologia é profissional e facilitou muito meu trabalho. Recomendo demais!'
  },
  {
    id: '2',
    name: 'Ana Costa',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Aprendi técnicas que me ajudaram a conseguir trabalhos melhores. O suporte é excelente e sempre respondem rápido!'
  },
  {
    id: '3',
    name: 'Roberto Lima',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Melhor investimento que fiz na minha carreira 3D. Os arquivos são otimizados e prontos para usar em qualquer projeto.'
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && data.length > 0) {
      setTestimonials(data);
    }
  }

  return (
    <section className="py-12 sm:py-20 flex items-center" style={{ minHeight: 'calc(12rem + 5rem)' }}>
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-4">
          Depoimentos
        </h2>

        <>
          <div className="md:hidden overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-4 py-4" style={{ width: 'max-content', paddingLeft: '4px', paddingRight: '4px' }}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8 hover:border-red-600 transition-all flex-shrink-0 flex flex-col"
                style={{ width: '280px', minHeight: '280px' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-base">{testimonial.name}</h3>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed flex-1">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-12 hover:border-red-600 hover:scale-105 transition-all flex flex-col"
              style={{ minHeight: '280px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={testimonial.avatar_url}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold text-base">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-white text-sm leading-relaxed flex-1">{testimonial.text}</p>
            </div>
          ))}
        </div>
        </>
      </div>
    </section>
  );
}
