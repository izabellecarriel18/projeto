import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PaymentSuccessPageProps {
  onNavigate: (page: string) => void;
}

export default function PaymentSuccessPage({ onNavigate }: PaymentSuccessPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      verifyAndRecordPurchase();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  async function verifyAndRecordPurchase() {
    try {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      console.log('PaymentSuccessPage - sessionId:', sessionId);
      console.log('PaymentSuccessPage - user:', user?.id);

      if (!sessionId) {
        setError('Sessão de pagamento não encontrada');
        setLoading(false);
        return;
      }

      if (!user) {
        console.log('Aguardando autenticação...');
        return;
      }

      console.log('Verificando se a compra já foi registrada pelo webhook...');

      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = 1000;

      while (attempts < maxAttempts) {
        const { data: purchase, error } = await supabase
          .from('user_purchases')
          .select('id, product_id, status')
          .eq('stripe_session_id', sessionId)
          .eq('user_id', user.id);

        console.log(`Tentativa ${attempts + 1}:`, { purchase, error });

        if (error) {
          console.error('Erro ao verificar compra:', error);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          continue;
        }

        if (purchase && purchase.length > 0) {
          console.log('Compra encontrada!', purchase);
          setLoading(false);
          setTimeout(() => {
            onNavigate('purchases');
          }, 2000);
          return;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }

      setError('A compra foi aprovada, mas ainda está sendo processada. Por favor, verifique suas compras em alguns instantes.');
      setLoading(false);
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setError(error.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-white mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-white mb-2">Verificando pagamento...</h1>
          <p className="text-gray-400">Aguarde enquanto confirmamos sua compra</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            ✕
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erro ao verificar pagamento</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Pagamento confirmado!</h1>
        <p className="text-gray-400 mb-6">Sua compra foi registrada com sucesso.</p>
        <p className="text-sm text-gray-500">Redirecionando para suas compras...</p>
      </div>
    </div>
  );
}
