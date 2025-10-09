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

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) {
      setTestimonials(data);
    }
  }

  return (
    <section className="py-12 sm:py-20 flex items-center" style={{ minHeight: 'calc(12rem + 5rem)' }}>
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Depoimentos
        </h2>

        {testimonials.length === 0 ? (
          <div className="text-center text-gray-400 px-4">
            <p>Carregando depoimentos...</p>
          </div>
        ) : (
        <>
          <div className="md:hidden overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4 hover:border-red-600 transition-all flex-shrink-0"
                style={{ width: '280px' }}
              >
                <div className="flex items-center gap-3 mb-3">
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
                <p className="text-white text-sm leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-red-600 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
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
              <p className="text-white text-sm leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
        </>
        )}
      </div>
    </section>
  );
}
