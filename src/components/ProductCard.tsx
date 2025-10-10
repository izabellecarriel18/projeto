import { useState, useEffect, useRef } from 'react';
import { GlareCard } from './GlareCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Upload } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  image_url: string;
  price: number;
  formats: string[];
  description?: string;
  purchase_url?: string;
}

interface ProductCardProps {
  product: Product;
  onImageUpload?: (productId: string) => void;
}

const generatingCache = new Set<string>();

export function ProductCard({ product, onImageUpload }: ProductCardProps) {
  const { profile } = useAuth();
  const [description, setDescription] = useState(product.description || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const hasChecked = useRef(false);
  const isAdmin = profile?.role === 'admin';

  const isValidDescription = (desc: string | null | undefined): boolean => {
    if (!desc || desc.trim() === '') return false;
    if (desc.startsWith('Modelo 3D detalhado do')) return false;
    return true;
  };

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAndGenerate = async () => {
      if (isValidDescription(product.description)) {
        setDescription(product.description!);
        return;
      }

      const { data: freshProduct } = await supabase
        .from('products')
        .select('description')
        .eq('id', product.id)
        .maybeSingle();

      if (isValidDescription(freshProduct?.description)) {
        setDescription(freshProduct.description);
      } else {
        generateDescription();
      }
    };

    checkAndGenerate();
  }, []);

  async function generateDescription() {
    if (isGenerating || generatingCache.has(product.id)) return;

    generatingCache.add(product.id);
    setIsGenerating(true);

    try {
      console.log(`[${product.name}] Iniciando geração de descrição...`);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-description`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          category: getCategoryId(product.category),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      const newDescription = data.description;

      console.log(`[${product.name}] Descrição gerada:`, newDescription);

      setDescription(newDescription);

      const { error } = await supabase
        .from('products')
        .update({ description: newDescription })
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product description:', error);
      } else {
        console.log(`[${product.name}] Descrição salva no banco de dados`);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      const fallbackDesc = `Modelo 3D do ${product.name} para impressão. Detalhes precisos e alta qualidade.`;
      setDescription(fallbackDesc);
      generatingCache.delete(product.id);
    } finally {
      setIsGenerating(false);
    }
  }

  function getCategoryId(categoryName: string): string {
    const categoryMap: { [key: string]: string } = {
      'Carros Sólidos': 'solid_cars',
      'Carros Completos': 'complete_cars',
      'Rodas': 'wheels',
      'Ônibus e Caminhão': 'bus_truck'
    };
    return categoryMap[categoryName] || 'solid_cars';
  }

  return (
    <GlareCard>
      <div className="flex flex-col bg-slate-950">
        <div className="aspect-[16/11] bg-gray-900 overflow-hidden relative group">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {isAdmin && onImageUpload && (
            <button
              onClick={() => onImageUpload(product.id)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div className="text-center">
                <Upload className="w-10 h-10 text-white mx-auto mb-2" />
                <span className="text-white text-sm font-semibold">Alterar Imagem</span>
              </div>
            </button>
          )}
        </div>
        <div className="flex flex-col p-5">
          <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
            {product.formats.join(' , ')}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3 min-h-[9rem]">
            {isGenerating ? 'Gerando descrição...' : description}
          </p>
          <div className="text-white font-bold text-2xl mb-3">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>
          <button
            onClick={() => window.open(product.purchase_url || '#', '_blank')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-sm transition-all cursor-pointer"
          >
            Comprar
          </button>
        </div>
      </div>
    </GlareCard>
  );
}
