import { BookOpen, Download, Wrench, FileText } from 'lucide-react';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen pt-2 sm:pt-10 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Instruções e Uso
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white">
            Guias completos para utilização dos modelos 3D
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="backdrop-blur border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-red-600/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <Download className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Como Baixar os Arquivos
                </h2>
                <div className="text-white space-y-2">
                  <p className="text-sm sm:text-base">
                    1. Navegue até a seção <span className="text-red-600 font-semibold">ARQUIVOS</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    2. Selecione a categoria desejada (Rodas, Carros Sólidos, Carros Completos, etc.)
                  </p>
                  <p className="text-sm sm:text-base">
                    3. Utilize os filtros de marca para encontrar modelos específicos
                  </p>
                  <p className="text-sm sm:text-base">
                    4. Clique no botão <span className="text-red-600 font-semibold">ADICIONAR AO CARRINHO</span>
                  </p>
                  <p className="text-sm sm:text-base">
                    5. Finalize a compra e acesse seus arquivos na seção <span className="text-red-600 font-semibold">COMPRAS</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-red-600/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Formato Disponível
                </h2>
                <div className="text-white space-y-2">
                  <p className="text-sm sm:text-base">
                    Todos os modelos estão disponíveis no formato:
                  </p>
                  <div className="bg-gray-800/50 p-4 rounded-lg mt-3">
                    <p className="font-semibold text-red-600 mb-2">STL (Stereolithography)</p>
                    <p className="text-sm sm:text-base">
                      Formato padrão universal para impressão 3D, compatível com todos os slicers e impressoras 3D do mercado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-red-600/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <Wrench className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Softwares de Impressão 3D (Slicers)
                </h2>
                <div className="text-white space-y-2">
                  <p className="text-sm sm:text-base mb-3">
                    Nossos modelos STL são compatíveis com os principais softwares de fatiamento para impressão 3D:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Cura (Ultimaker Cura)</p>
                      <p className="text-xs sm:text-sm">Gratuito e amplamente utilizado</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">PrusaSlicer</p>
                      <p className="text-xs sm:text-sm">Excelente para impressoras Prusa e outras</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Simplify3D</p>
                      <p className="text-xs sm:text-sm">Profissional com recursos avançados</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Bambu Studio</p>
                      <p className="text-xs sm:text-sm">Otimizado para impressoras Bambu Lab</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Orca Slicer</p>
                      <p className="text-xs sm:text-sm">Fork avançado do Bambu Studio</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Creality Slicer</p>
                      <p className="text-xs sm:text-sm">Ideal para impressoras Creality</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">IdeaMaker</p>
                      <p className="text-xs sm:text-sm">Para impressoras Raise3D</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Repetier-Host</p>
                      <p className="text-xs sm:text-sm">Controle completo da impressora</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur border border-gray-800 rounded-lg p-6 sm:p-8 hover:border-red-600/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Dicas de Uso
                </h2>
                <div className="text-white space-y-3">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Escala e Tamanho</p>
                    <p className="text-sm sm:text-base">
                      Os modelos estão em escala real de carros. Você pode redimensionar conforme necessário no seu slicer para ajustar ao tamanho da sua impressora 3D.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Configurações Recomendadas</p>
                    <p className="text-sm sm:text-base">
                      Para melhores resultados, recomendamos: camada de 0.2mm, preenchimento de 15-20%, suportes apenas onde necessário. Use material PLA ou ABS conforme sua preferência.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Suportes</p>
                    <p className="text-sm sm:text-base">
                      Os modelos são otimizados para minimizar a necessidade de suportes. Configure seu slicer para gerar suportes apenas em ângulos maiores que 45°.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Pós-Processamento</p>
                    <p className="text-sm sm:text-base">
                      Após a impressão, você pode lixar, pintar e aplicar acabamentos para melhorar a aparência final do seu modelo.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Suporte Técnico</p>
                    <p className="text-sm sm:text-base">
                      Em caso de dúvidas ou problemas com os arquivos, entre em contato através do seu perfil. Nossa equipe está pronta para ajudar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur border border-red-600/30 bg-red-600/5 rounded-lg p-6 sm:p-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Precisa de Ajuda?
              </h3>
              <p className="text-white text-sm sm:text-base mb-4">
                Nossa equipe está disponível para auxiliar com qualquer dúvida sobre os modelos 3D
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                Entrar em Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
