import { ArrowRight, Smartphone, X, Share } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EditableBackgroundImage from './EditableBackgroundImage';

interface HeroProps {
  onNavigate: (page: string) => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { profile } = useAuth();
  const [heroImage, setHeroImage] = useState<string>('https://i.imgur.com/HtRfEMb.jpeg');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadHeroImage();
    detectPlatform();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  async function loadHeroImage() {
    const { data } = await supabase
      .from('site_images')
      .select('image_url, default_url')
      .eq('slot_id', 'hero_bg')
      .maybeSingle();

    if (data) {
      setHeroImage(data.image_url || data.default_url);
    }
  }

  function detectPlatform() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
  }

  async function handleInstallClick() {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Para instalar o aplicativo, use o menu do seu navegador e selecione "Adicionar à tela inicial"');
    }
  }

  return (
    <EditableBackgroundImage
      slotId="hero_bg"
      currentUrl={heroImage}
      isAdmin={isAdmin}
      onUpdate={loadHeroImage}
      className="flex items-center justify-center overflow-hidden px-4"
      style={{ minHeight: '75vh' }}
    >

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Modelagem 3D <span className="text-red-600">Automotiva</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          Modelos 3D prontos para impressão e renderização. Os Arquivos são feitos em alta qualidade, todos reforçados e sem exagero de espessura, mantendo a aparência do veiculo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button
            onClick={() => onNavigate('products')}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Ver Arquivos
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Ver Cursos
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleInstallClick}
            className="group bg-red-600 hover:bg-red-700 hover:scale-105 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            Baixar Aplicativo
          </button>
        </div>
      </div>

      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 relative border border-gray-800">
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              Instalar no iPhone/iPad
            </h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <p className="text-sm">
                  Toque no botão <Share className="inline w-4 h-4 mx-1" /> (Compartilhar) na barra inferior do Safari
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <p className="text-sm">
                  Role para baixo e selecione "Adicionar à Tela de Início"
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <p className="text-sm">
                  Toque em "Adicionar" no canto superior direito
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">
                  O ícone do ULTIMATECAR3D aparecerá na sua tela inicial e você poderá acessar o app como um aplicativo nativo!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </EditableBackgroundImage>
  );
}
