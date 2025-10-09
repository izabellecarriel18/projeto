import { CheckCircle } from 'lucide-react';

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

const faqs = [
  {
    question: 'Qual o nível recomendado para este curso?',
    answer: '',
  },
  {
    question: 'Quais softwares são usados?',
    answer: '',
  },
  {
    question: 'Os cursos oferecem certificado?',
    answer: '',
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container mx-auto">
        <div className="lg:hidden overflow-x-auto scrollbar-hide px-4 mb-12">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {courses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all flex-shrink-0"
                style={{ width: '340px' }}
              >
                <div className="aspect-video bg-gray-900 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
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
            ))}
          </div>
        </div>
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 mb-12 px-4 sm:px-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all"
            >
              <div className="aspect-video bg-gray-900 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
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
          ))}
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

        <div className="border border-gray-800 rounded-lg p-8 bg-black/40 backdrop-blur-sm mx-4">
          <h2 className="text-2xl font-bold text-white mb-6">FAQ de Cursos</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0">
                <h3 className="text-white text-base font-medium mb-2">{faq.question}</h3>
                {faq.answer && <p className="text-white text-sm">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
