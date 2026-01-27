import { useEffect, useState } from 'react';
import { ShoppingBag, Download, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Purchase {
  id: string;
  product_id: string;
  amount_paid: number;
  currency: string;
  status: string;
  purchased_at: string;
  products: {
    id: string;
    name: string;
    image_url: string;
    category: string;
    brand: string;
    formats: string[];
    file_url?: string;
    file_name?: string;
    wheel_file_url?: string;
    wheel_file_name?: string;
  };
}

export default function PurchasesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPurchases();
    }
  }, [user]);

  async function loadPurchases() {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          id,
          product_id,
          amount_paid,
          currency,
          status,
          purchased_at,
          products (
            id,
            name,
            image_url,
            category,
            brand,
            formats,
            file_url,
            file_name,
            wheel_file_url,
            wheel_file_name
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'completed')
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Error loading purchases:', error);
        return;
      }

      if (data) {
        setPurchases(data as Purchase[]);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number) => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const handleDownload = async (filePath: string, fileName?: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('product-files')
        .createSignedUrl(filePath, 60 * 60);

      if (error) {
        console.error('Error getting download URL:', error);
        alert('Erro ao baixar arquivo. Tente novamente.');
        return;
      }

      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = fileName || filePath.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Erro ao baixar arquivo. Tente novamente.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-8 sm:pt-10 pb-12 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-12 sm:py-20">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4" />
            <p className="text-white text-lg sm:text-xl">Faça login para ver suas compras</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Minhas Compras
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Acesse a aba PNEUS e baixe o arquivo que melhor se enquadra ao perfil desejado
          </p>
        </div>

        <div className="backdrop-blur border border-gray-800 rounded-lg p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">Carregando...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4 opacity-50" />
              <p className="text-white text-lg">Você ainda não fez nenhuma compra</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
                >
                  <div className="aspect-[16/11] bg-gray-950 overflow-hidden">
                    <img
                      src={purchase.products.image_url}
                      alt={purchase.products.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2">
                      {purchase.products.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">
                      {purchase.products.formats.join(' , ')}
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(purchase.purchased_at)}</span>
                    </div>
                    <div className="text-white font-bold text-xl mb-4">
                      {formatPrice(purchase.amount_paid)}
                    </div>
                    <div className="space-y-2">
                      {purchase.products.file_url ? (
                        <button
                          onClick={() => handleDownload(purchase.products.file_url!, purchase.products.file_name)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Carro ({purchase.products.file_name || 'arquivo'})
                        </button>
                      ) : null}
                      {purchase.products.wheel_file_url ? (
                        <button
                          onClick={() => handleDownload(purchase.products.wheel_file_url!, purchase.products.wheel_file_name)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Roda ({purchase.products.wheel_file_name || 'arquivo'})
                        </button>
                      ) : null}
                      {!purchase.products.file_url && !purchase.products.wheel_file_url && (
                        <div className="w-full bg-gray-700 text-gray-400 py-3 rounded-lg font-bold text-sm text-center">
                          Nenhum arquivo disponível
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
