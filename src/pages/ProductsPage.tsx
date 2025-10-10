import { Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  image_url: string;
  price: number;
  formats: string[];
}

export default function ProductsPage() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('solid_cars');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const isAdmin = profile?.role === 'admin';

  const categories = [
    { id: 'solid_cars', label: 'Carros Sólidos' },
    { id: 'complete_cars', label: 'Carros Completos' },
    { id: 'wheels', label: 'Rodas' },
    { id: 'bus_truck', label: 'Ônibus e Caminhão' },
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
    'MERCEDES',
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
    'TROLLER',
    'VOLKSWAGEN',
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
    'VOLVO',
  ];

  const wheelsBrands = [
    'ADVAN',
    'AUDI',
    'BBS',
    'BINNO',
    'BMW',
    'BRW',
    'CHEVROLET / GM',
    'ENKEI',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'JEEP',
    'KR',
    'LOWRIDER',
    'MANGELS',
    'MERCEDES',
    'MITSUBISHI',
    'MOMO',
    'NISSAN',
    'OZ',
    'PEUGEOT',
    'PORSCHE',
    'RAYS',
    'RENAULT',
    'RODA (GENERICAS)',
    'SUBARU',
    'TOYOTA',
    'VOLCANO',
    'VOLVO',
    'VOSSEN',
    'VOLKSWAGEN',
    'WATANABE',
    'WORK',
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, selectedBrand, searchTerm]);

  async function loadProducts() {
    console.log('=== LOADING PRODUCTS ===');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Supabase response - data:', data);
    console.log('Supabase response - error:', error);

    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    if (data) {
      console.log('Setting products, count:', data.length);
      setProducts(data);
    }
  }

  function filterProducts() {
    console.log('=== FILTER DEBUG ===');
    console.log('Total products:', products.length);
    console.log('Selected category:', selectedCategory);
    console.log('Selected brand:', selectedBrand);
    console.log('Search term:', searchTerm);

    let filtered = [...products];

    const categoryMap: { [key: string]: string } = {
      'solid_cars': 'Carros Sólidos',
      'complete_cars': 'Carros Completos',
      'wheels': 'Rodas',
      'bus_truck': 'Ônibus e Caminhão'
    };

    console.log('Looking for category:', categoryMap[selectedCategory]);
    filtered = filtered.filter((p) => {
      console.log('Product category:', p.category, '===', categoryMap[selectedCategory], '?', p.category === categoryMap[selectedCategory]);
      return p.category === categoryMap[selectedCategory];
    });
    console.log('After category filter:', filtered.length);

    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => {
        const productBrand = (p.brand || '').toUpperCase();
        const filterBrand = selectedBrand.toUpperCase();
        console.log('Brand check:', productBrand, '===', filterBrand, '?', productBrand === filterBrand);
        return productBrand === filterBrand;
      });
    }
    console.log('After brand filter:', filtered.length);

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    console.log('Final filtered:', filtered.length);

    setFilteredProducts(filtered);
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">Modelos 3D</h1>
          <p className="text-base sm:text-lg md:text-xl text-white">
            Biblioteca completa de modelos automotivos profissionais
          </p>
        </div>


        <div className="backdrop-blur border border-gray-800 rounded-lg p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all whitespace-nowrap">
              Solicitar Criação de Arquivo
            </button>
          </div>

          {selectedCategory === 'solid_cars' && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                  selectedBrand === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                TODOS
              </button>
              {solidCarsBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'complete_cars' && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                  selectedBrand === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                TODOS
              </button>
              {completeCarsBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'wheels' && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                  selectedBrand === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                TODOS
              </button>
              {wheelsBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
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

        {selectedCategory === 'bus_truck' ? null : filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4" />
            <p className="text-white text-lg sm:text-xl">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="backdrop-blur border border-gray-800 rounded-lg overflow-hidden hover:border-red-600 transition-all group"
              >
                <div className="aspect-video bg-gray-800 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{product.name}</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {product.formats.map((format) => (
                      <span
                        key={format}
                        className="bg-gray-800 text-white text-xs px-2 py-1 rounded"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-bold text-lg sm:text-xl">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base transition-all">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
