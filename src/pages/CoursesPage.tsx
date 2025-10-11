import { CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EditableImage from '../components/EditableImage';

const courses = [
  {
    title: 'Modelagem Automotiva 3D Avançada',
    description: 'Módulos: Modelagem de Superfícies, Topologia para Animação, Instalações de Interiores, Preparação para Impressão 3D, Shading, Rigging, Iluminação de Cenas, Workflow do Projeto.',
    price: 'preço: R$1.497,00 ou 12x de R$ 149,60 ou R$ 1.347,30',
    image: '/src/assets/image.png',
  },
  {
    title: 'Modelagem Automotiva 3D Profissional',
    description: 'Módulos: Modelos Avançados, Renderização Hiperrealista, Animação Automotiva, Workflow Profissional, Shading, Materiais PPR, Iluminação de Apresentação.',
    price: 'Compre R$4.990,00 ou 12x de R$ 499,00 ou R$ 4.491,00',
    image: '/src/assets/image.png',
  },
];

const benefits = [
  '7 dias de garantia incondicional',
  'Suporte por Direct/WhatsApp',
];

const checkout = {
  title: 'Checkout Simplificado',
  items: [
    'Opções de pagamento: Cartão, Boleto, Pix',
    'Cupons de 5% de desconto são aplicados Antes de partir pro pagamento',
  ],
};


interface SiteImage {
  slot_id: string;
  image_url: string | null;
  default_url: string;
  description: string;
}

export default function CoursesPage() {
  const { profile } = useAuth();
  const [courseImages, setCourseImages] = useState<SiteImage[]>([]);
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadCourseImages();
  }, []);

  async function loadCourseImages() {
    const { data } = await supabase
      .from('site_images')
      .select('*')
      .in('slot_id', ['course_card_1', 'course_card_2'])
      .order('slot_id', { ascending: true });

    if (data) {
      setCourseImages(data);
    }
  }
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Cursos Disponíveis
        </h1>
        <div className="lg:hidden overflow-x-auto scrollbar-hide px-4 mb-12">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {courses.map((course, index) => {
              const courseImage = courseImages[index];
              return (
              <div
                key={index}
                className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all flex-shrink-0"
                style={{ width: '340px' }}
              >
                {courseImage && (
                  <EditableImage
                    slotId={courseImage.slot_id}
                    currentUrl={courseImage.image_url || courseImage.default_url}
                    isAdmin={isAdmin}
                    onUpdate={loadCourseImages}
                    className="aspect-video bg-gray-900"
                    alt={course.title}
                  />
                )}
                <div className="p-6 bg-black/40 backdrop-blur-sm">
                  <h3 className="text-white font-bold text-xl mb-3">{course.title}</h3>
                  <p className="text-white text-sm mb-4 leading-relaxed">{course.description}</p>

                  <div className="bg-red-600 text-white text-center py-2 px-4 rounded mb-4 text-sm">
                    {course.price}
                  </div>

                  <button className="w-full bg-red-600 hover:bg-red-700 hover:scale-105 text-white py-3 rounded font-semibold transition-all">
                    Ver Conteúdo
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 mb-12 px-4 sm:px-6">
          {courses.map((course, index) => {
            const courseImage = courseImages[index];
            return (
            <div
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all"
            >
              {courseImage && (
                <EditableImage
                  slotId={courseImage.slot_id}
                  currentUrl={courseImage.image_url || courseImage.default_url}
                  isAdmin={isAdmin}
                  onUpdate={loadCourseImages}
                  className="aspect-video bg-gray-900"
                  alt={course.title}
                />
              )}
              <div className="p-6 bg-black/40 backdrop-blur-sm">
                <h3 className="text-white font-bold text-xl mb-3">{course.title}</h3>
                <p className="text-white text-sm mb-4 leading-relaxed">{course.description}</p>

                <div className="bg-red-600 text-white text-center py-2 px-4 rounded mb-4 text-sm">
                  {course.price}
                </div>

                <button className="w-full bg-transparent border border-gray-700 hover:border-red-600 text-white py-3 rounded font-semibold transition-all">
                  Ver Conteúdo
                </button>
              </div>
            </div>
          )})}
        </div>

        <div className="border border-gray-800 rounded-lg p-8 mb-8 bg-black/40 backdrop-blur-sm mx-4">
          <h2 className="text-2xl font-bold text-white mb-6">Garantias e Suporte</h2>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-white text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-800 rounded-lg p-8 mb-8 bg-black mx-4">
          <h2 className="text-2xl font-bold text-white mb-6">{checkout.title}</h2>
          <div className="space-y-3">
            {checkout.items.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
