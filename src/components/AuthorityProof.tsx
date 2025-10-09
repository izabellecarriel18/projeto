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
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Provas de Autoridade
        </h2>
        <div className="md:hidden overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 text-center hover:border-red-600 transition-all flex-shrink-0"
                style={{ width: '280px' }}
              >
                <metric.icon className="w-10 h-10 text-red-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-white text-base">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 text-center hover:border-red-600 transition-all"
            >
              <metric.icon className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-white text-lg">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
