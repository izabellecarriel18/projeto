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

      console.log('Verificando compra no banco de dados...');

      const { data: existingPurchase } = await supabase
        .from('user_purchases')
        .select('id, product_id, status')
        .eq('stripe_session_id', sessionId)
        .eq('user_id', user.id);

      if (existingPurchase && existingPurchase.length > 0) {
        console.log('Compra já registrada!', existingPurchase);
        setLoading(false);
        setTimeout(() => {
          onNavigate('purchases');
        }, 2000);
        return;
      }

      console.log('Compra não encontrada, verificando com Stripe...');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      console.log('Resposta verify-payment:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar pagamento');
      }

      setLoading(false);
      setTimeout(() => {
        onNavigate('purchases');
      }, 2000);
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setError(error.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-4 flex items-center justify-center">
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
      <div className="min-h-screen pt-4 flex items-center justify-center">
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
    <div className="min-h-screen pt-4 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Pagamento confirmado!</h1>
        <p className="text-gray-400 mb-6">Sua compra foi registrada com sucesso.</p>
        <p className="text-sm text-gray-500">Redirecionando para suas compras...</p>
      </div>
    </div>
  );
}
