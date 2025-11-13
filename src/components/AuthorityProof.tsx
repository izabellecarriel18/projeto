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
    <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-12 sm:mb-16 px-4 text-shadow-xl">
          Provas de Autoridade
        </h2>
        <div className="md:hidden overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-4 py-4" style={{ width: 'max-content', paddingLeft: '4px', paddingRight: '4px' }}>
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-md border-2 border-red-600/60 rounded-2xl p-10 text-center flex-shrink-0 shadow-2xl shadow-red-600/20 hover:scale-105 transition-all duration-300"
                style={{ width: '300px' }}
              >
                <div className="text-6xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">{metric.value}</div>
                <div className="text-white text-lg font-semibold">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-md border-2 border-red-600/60 rounded-3xl p-12 text-center hover:scale-110 transition-all duration-300 shadow-2xl shadow-red-600/20 hover:shadow-red-600/40"
            >
              <div className="text-7xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">{metric.value}</div>
              <div className="text-white text-xl font-semibold">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
