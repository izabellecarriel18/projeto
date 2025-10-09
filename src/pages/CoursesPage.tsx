import { BookOpen, Clock, Award, Shield, CreditCard, Tag, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import FAQ from '../components/FAQ';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  installment_price: number;
  installments: number;
  level: string;
  duration: string;
  format: string;
  modules: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setCourses(data);
    }
  }

  const guarantees = [
    {
      icon: Shield,
      text: '7 dias de garantia incondicional',
    },
    {
      icon: MessageCircle,
      text: 'Suporte por Direct/WhatsApp',
    },
    {
      icon: Award,
      text: 'Certificado de conclusão',
    },
    {
      icon: BookOpen,
      text: 'Acesso vitalício ao conteúdo',
    },
  ];

  const checkout = [
    {
      icon: CreditCard,
      text: 'Cartão, Boleto, Pix',
    },
    {
      icon: Tag,
      text: 'Cupons de desconto disponíveis',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cursos de Modelagem 3D
          </h1>
          <p className="text-xl text-gray-400">
            Aprenda com os melhores profissionais da indústria automotiva
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">Nenhum curso disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {courses.map((course) => (
              <div
                key={course.id}
                className="backdrop-blur border border-gray-800 rounded-lg overflow-hidden hover:border-red-600 transition-all"
              >
                <div className="aspect-video bg-gray-800 overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-2xl mb-3">{course.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{course.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="w-5 h-5 text-red-600" />
                      <span>{course.modules} módulos</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Award className="w-5 h-5 text-red-600" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-5 h-5 text-red-600" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="w-5 h-5 text-red-600" />
                      <span>{course.format}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">
                          R$ {course.price.toFixed(2)}
                        </div>
                        <div className="text-gray-400">
                          ou {course.installments}x de R$ {course.installment_price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all">
                        Comprar
                      </button>
                      <button className="flex-1 border-2 border-gray-700 hover:border-red-600 text-white py-3 rounded-lg font-semibold transition-all">
                        Ver Conteúdo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="backdrop-blur border border-gray-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Garantias e Suporte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-red-600/10 p-3 rounded-full">
                  <item.icon className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur border border-gray-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Checkout Simplificado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {checkout.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-green-600/10 p-3 rounded-full">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <FAQ category="courses" />
      </div>
    </div>
  );
}
