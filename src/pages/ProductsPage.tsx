import { Search, ShoppingCart, Plus, ChevronDown } from 'lucide-react';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ProductCard } from '../components/ProductCard';
import ProductImageUploadModal from '../components/ProductImageUploadModal';
import { AddProductModal } from '../components/AddProductModal';
import { useSWR } from '../lib/cache';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  image_url: string;
  price: number;
  formats: string[];
  description?: string;
}

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  const sorted = [...(data || [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );
  sorted.forEach((product) => {
    if (product.image_url) {
      const img = new Image();
      img.src = product.image_url;
    }
  });
  return sorted;
}

export default function ProductsPage() {
  const { profile } = useAuth();
  const { data: products, isLoading, mutate } = useSWR<Product[]>(
    'products',
    fetchProducts,
    { staleTime: 30000 }
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('wheels');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = profile?.role === 'admin';

  const handleImageUpload = (productId: string) => {
    const product = (products || []).find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setUploadModalOpen(true);
    }
  };

  const handleUploadSuccess = useCallback(() => {
    mutate();
  }, [mutate]);

  const categories = [
    { id: 'wheels', label: 'RODAS', mobileLabel: 'RODAS' },
    { id: 'solid_cars', label: 'CARROS SÓLIDOS', mobileLabel: 'CR SÓLIDOS' },
    { id: 'complete_cars', label: 'CARROS COMPLETOS', mobileLabel: 'CR COMPLETOS' },
    { id: 'tires', label: 'PNEUS', mobileLabel: 'PNEUS' },
    { id: 'bus_truck', label: 'ÔNIBUS E CAMINHÃO', mobileLabel: 'ÔNIBUS/CAM' },
  ];

  const solidCarsBrands = [
    'AUDI',
    'BMW',
    'CADILLAC',
    'CHEVROLET / GM',
    'CITROËN',
    'DAEWOO',
    'DODGE',
    'FERRARI',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'IVECO',
    'KOENIGSEGG',
    'MAZDA',
    'MCLAREN',
    'MERCEDES-BENZ',
    'MITSUBISHI',
    'NISSAN',
    'NOBLE',
    'PEUGEOT',
    'PORSCHE',
    'PUMA',
    'RENAULT',
    'SCANIA',
    'SUBARU',
    'TOYOTA',
    'TROLLER (FORD)',
    'VOLKSWAGEN (VW)',
    'VOLVO',
  ];

  const completeCarsBrands = [
    'ACURA',
    'BMW',
    'CAIO',
    'CHEVROLET / GM',
    'COMIL',
    'DKW',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'IVECO',
    'LUCRA',
    'MARCOPOLO',
    'MAREA',
    'MAZDA',
    'MCLAREN',
    'MERCEDES',
    'MITSUBISHI',
    'NIELSON',
    'NISSAN',
    'NOBLE',
    'OUTROS',
    'PEUGEOT',
    'PORSCHE',
    'RENAULT',
    'SANTA MATILDE',
    'SCANIA',
    'SUBARU',
    'SUZUKI',
    'TOYOTA',
    'TROLLER',
    'URBANO MASCARELLO',
    'VOLKSWAGEN',
    'VOLVO',
  ];

  const wheelsBrands = [
    'AUDI',
    'BBS',
    'BENTLEY',
    'BINNO',
    'BMW',
    'BRW',
    'CHEVROLET / GM',
    'DODGE',
    'FERRARI',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'JEEP',
    'KR',
    'LAMBORGHINI',
    'LAND ROVER',
    'LEXUS',
    'MERCEDES',
    'MITSUBISHI',
    'MOMO',
    'NISSAN',
    'PEUGEOT',
    'PORSCHE',
    'RENAULT',
    'SUBARU',
    'SUZUKI',
    'TOYOTA',
    'TSW',
    'VITTORIA',
    'VOLCANO',
    'VOLKSWAGEN',
    'VOLVO',
    'OUTROS',
  ];

  const tiresBrands = [
    'ALTO',
    'BAIXO',
    'MEDIO',
  ];


  useEffect(() => {
    setSelectedBrand('all');
    setBrandDropdownOpen(false);
  }, [selectedCategory]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBrandDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    const productsList = products || [];
    const categoryMap: { [key: string]: string } = {
      'solid_cars': 'Carros Sólidos',
      'complete_cars': 'Carros Completos',
      'wheels': 'Rodas',
      'tires': 'Pneus',
      'bus_truck': 'Ônibus e Caminhão'
    };

    let filtered = productsList.filter((p) => p.category === categoryMap[selectedCategory]);

    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => {
        const productBrand = (p.brand || '').toUpperCase();
        const filterBrand = selectedBrand.toUpperCase();
        return productBrand === filterBrand;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, selectedBrand, searchTerm]);

  return (
    <div className="min-h-screen pt-2 sm:pt-10 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">Modelos 3D</h1>
          <p className="text-base sm:text-lg md:text-xl text-white">
            Biblioteca completa de modelos automotivos profissionais
          </p>
        </div>


        <div className="backdrop-blur border border-gray-800 rounded-lg p-4 sm:p-6 mb-8 sm:mb-12 relative z-50">
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-3 mb-4 sm:mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-1 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-medium text-[10px] sm:text-base transition-all text-center ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <span className="sm:hidden">{cat.mobileLabel}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
            <button className="bg-green-600 hover:bg-green-700 text-white px-1 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-medium text-[10px] sm:text-base transition-all text-center">
              <span className="sm:hidden">SOLICITAR</span>
              <span className="hidden sm:inline">Solicitar Criacao de Arquivo</span>
            </button>
            {isAdmin && selectedCategory !== 'bus_truck' && (
              <button
                onClick={() => setAddProductModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-1 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg font-medium text-[10px] sm:text-base transition-all flex items-center justify-center gap-1 sm:gap-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="sm:hidden">ADD</span>
                <span className="hidden sm:inline">Adicionar Card</span>
              </button>
            )}
          </div>

          <div className="bg-gray-900/50 border-2 border-red-600 rounded-lg p-4 sm:p-6 mb-6 text-center">
            <p className="text-red-500 text-base sm:text-lg font-bold">
              Compatível com Resina e Filamento, Escala Adaptável.
            </p>
          </div>

          {selectedCategory !== 'bus_truck' && (
            <div className="relative mb-4 sm:mb-6 z-40" ref={dropdownRef}>
              <button
                onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-all flex items-center justify-between sm:justify-center gap-2 ${
                  selectedBrand !== 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <span>{selectedBrand === 'all' ? 'Selecione a Marca' : selectedBrand}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${brandDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {brandDropdownOpen && (
                <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[100] max-h-64 overflow-y-auto min-w-[200px]">
                  <button
                    onClick={() => {
                      setSelectedBrand('all');
                      setBrandDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all ${
                      selectedBrand === 'all'
                        ? 'bg-red-600 text-white'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    Todas as Marcas
                  </button>
                  {(selectedCategory === 'solid_cars' ? solidCarsBrands :
                    selectedCategory === 'complete_cars' ? completeCarsBrands :
                    selectedCategory === 'wheels' ? wheelsBrands :
                    selectedCategory === 'tires' ? tiresBrands : []
                  ).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setBrandDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all ${
                        selectedBrand === brand
                          ? 'bg-red-600 text-white'
                          : 'text-white hover:bg-gray-800'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedCategory === 'bus_truck' && (
            <div className="bg-gray-900/50 border border-red-600/50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-center">
              <p className="text-red-500 text-sm sm:text-base font-semibold uppercase">
                DEVEM SER SOLICITADAS AS CRIAÇÕES PELO PERFIL.
              </p>
            </div>
          )}

          {selectedCategory !== 'bus_truck' && (
            <div className="flex flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <input
                type="text"
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm sm:text-base pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none"
              />
            </div>
          )}
        </div>

        {selectedCategory === 'bus_truck' ? null : isLoading && (!products || products.length === 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 relative z-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4" />
            <p className="text-white text-lg sm:text-xl">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 relative z-0">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onImageUpload={isAdmin ? handleImageUpload : undefined}
                onDelete={isAdmin ? handleUploadSuccess : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductImageUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onSuccess={handleUploadSuccess}
        />
      )}

      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        category={selectedCategory}
        selectedBrand={selectedBrand}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
