import { BookOpen, Download, Wrench, FileText } from 'lucide-react';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Instruções e Uso
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-900">
            Guias completos para utilização dos modelos 3D
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 sm:p-8 hover:border-red-600 transition-all">
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

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 sm:p-8 hover:border-red-600 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Formatos Disponíveis
                </h2>
                <div className="text-white space-y-2">
                  <p className="text-sm sm:text-base">
                    Todos os modelos estão disponíveis nos seguintes formatos:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li className="text-sm sm:text-base">
                      <span className="font-semibold text-red-600">OBJ</span> - Formato universal compatível com a maioria dos softwares 3D
                    </li>
                    <li className="text-sm sm:text-base">
                      <span className="font-semibold text-red-600">FBX</span> - Ideal para Autodesk Maya, 3ds Max e Unity
                    </li>
                    <li className="text-sm sm:text-base">
                      <span className="font-semibold text-red-600">BLEND</span> - Nativo do Blender
                    </li>
                    <li className="text-sm sm:text-base">
                      <span className="font-semibold text-red-600">GLB</span> - Otimizado para web e realidade aumentada
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 sm:p-8 hover:border-red-600 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <Wrench className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Softwares Compatíveis
                </h2>
                <div className="text-white space-y-2">
                  <p className="text-sm sm:text-base mb-3">
                    Nossos modelos são compatíveis com os principais softwares de modelagem 3D:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Blender</p>
                      <p className="text-xs sm:text-sm">Software gratuito e open source</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Autodesk Maya</p>
                      <p className="text-xs sm:text-sm">Padrão da indústria profissional</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">3ds Max</p>
                      <p className="text-xs sm:text-sm">Ideal para arquitetura e design</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Cinema 4D</p>
                      <p className="text-xs sm:text-sm">Perfeito para motion graphics</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">Unity / Unreal Engine</p>
                      <p className="text-xs sm:text-sm">Game engines e tempo real</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="font-semibold text-red-600 mb-1">SketchUp</p>
                      <p className="text-xs sm:text-sm">Modelagem rápida e intuitiva</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 sm:p-8 hover:border-red-600 transition-all">
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
                    <p className="font-semibold text-red-600 mb-2">Escala e Proporções</p>
                    <p className="text-sm sm:text-base">
                      Todos os modelos estão em escala real. Certifique-se de verificar as unidades do seu software antes de importar.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Texturas e Materiais</p>
                    <p className="text-sm sm:text-base">
                      As texturas estão incluídas nos arquivos. Alguns softwares podem requerer o mapeamento manual dos caminhos das texturas.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Otimização</p>
                    <p className="text-sm sm:text-base">
                      Os modelos são otimizados para uso profissional. Para jogos ou aplicações em tempo real, pode ser necessário reduzir a densidade de polígonos.
                    </p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-red-600 mb-2">Suporte</p>
                    <p className="text-sm sm:text-base">
                      Em caso de dúvidas ou problemas técnicos, entre em contato através do seu perfil. Nossa equipe está pronta para ajudar.
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
