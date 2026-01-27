export default function Testimonials() {
  return (
    <section className="py-12 sm:py-20 flex items-center" style={{ minHeight: 'calc(12rem + 5rem)' }}>
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 px-4">
          Depoimentos
        </h2>

        <div className="flex justify-center px-4">
          <div className="bg-red-600/10 backdrop-blur-sm border-2 border-red-600 rounded-2xl p-12 text-center max-w-md w-full">
            <div className="text-4xl font-bold text-red-600 mb-3">Em breve</div>
            <div className="text-white text-lg">Depoimentos de clientes</div>
          </div>
        </div>
      </div>
    </section>
  );
}
