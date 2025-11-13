import { Zap, Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black border-t border-gray-800 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Zap className="w-8 h-8 text-red-600" />
              <span className="text-xl font-bold text-white tracking-wider">
                ULTIMATECAR<span className="text-red-600">3D</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modelos 3D automotivos de alta qualidade para impressão e renderização profissional.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-white font-bold text-lg mb-4">Links Rápidos</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-red-500 transition-colors text-sm">Arquivos</a>
              <a href="#" className="block text-gray-400 hover:text-red-500 transition-colors text-sm">Cursos</a>
              <a href="#" className="block text-gray-400 hover:text-red-500 transition-colors text-sm">Instruções</a>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
            <div className="flex items-center justify-center md:justify-end gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800/50 rounded-lg">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800/50 rounded-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-800/50 rounded-lg">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} ULTIMATECAR3D. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
