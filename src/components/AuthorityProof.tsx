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
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 text-center hover:border-red-600 transition-all"
            >
              <metric.icon className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-gray-400 text-lg">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
