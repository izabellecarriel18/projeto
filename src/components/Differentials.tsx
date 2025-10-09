import { Shield, Zap, Headphones } from 'lucide-react';

export default function Differentials() {
  const differentials = [
    {
      icon: Shield,
      title: 'Qualidade Impecável',
      description:
        'Modelos 3D com topologia profissional, otimizados para render e produção em qualquer software.',
    },
    {
      icon: Zap,
      title: 'Técnicas Avançadas',
      description:
        'Aprenda workflows modernos utilizados pelos melhores artistas 3D da indústria automotiva.',
    },
    {
      icon: Headphones,
      title: 'Suporte Especializado',
      description:
        'Tire suas dúvidas diretamente com especialistas via WhatsApp e Direct. Resposta rápida garantida.',
    },
  ];

  return (
    <section
      className="py-12 sm:py-20 relative bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: 'url(https://i.imgur.com/nHXjTtQ.jpg)', minHeight: '75vh' }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
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
    </section>
  );
}
