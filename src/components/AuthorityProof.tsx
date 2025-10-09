import { Car, Settings, Award } from 'lucide-react';

export default function AuthorityProof() {
  const metrics = [
    {
      icon: Car,
      value: '+200',
      label: 'Carros Criados',
    },
    {
      icon: Settings,
      value: '+600',
      label: 'Rodas Criadas',
    },
    {
      icon: Award,
      value: '+10',
      label: 'Anos de Experiência',
    },
  ];

  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          PROVAS DE AUTORIDADE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 sm:p-8 text-center hover:border-red-600 transition-all"
            >
              <metric.icon className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 mx-auto mb-3 sm:mb-4" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-gray-400 text-base sm:text-lg">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
