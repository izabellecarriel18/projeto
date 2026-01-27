export default function AuthorityProof() {
  const metrics = [
    {
      value: '+200',
      label: 'Carros Criados',
    },
    {
      value: '+600',
      label: 'Rodas Criadas',
    },
    {
      value: '+10',
      label: 'Anos de Experiência',
    },
  ];

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Provas de Autoridade
        </h2>
        <div className="md:hidden px-4">
          <div className="flex flex-col gap-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-red-600/10 backdrop-blur-sm border-2 border-red-600 rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-red-600 mb-1">{metric.value}</div>
                <div className="text-white text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-red-600/10 backdrop-blur-sm border-2 border-red-600 rounded-2xl p-12 text-center hover:scale-105 transition-all"
            >
              <div className="text-6xl font-bold text-red-600 mb-3">{metric.value}</div>
              <div className="text-white text-lg">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
