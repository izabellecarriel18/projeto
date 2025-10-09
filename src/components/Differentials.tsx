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
      className="py-12 sm:py-20 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://i.imgur.com/nHXjTtQ.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-16">
          Diferenciais
        </h2>

        <div className="space-y-4 sm:space-y-8">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 hover:border-red-600 transition-all"
            >
              <div className="bg-red-600/10 p-4 sm:p-6 rounded-full">
                <item.icon className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
