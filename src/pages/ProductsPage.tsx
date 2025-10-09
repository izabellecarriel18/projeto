import { Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'solid_cars', label: 'Carros Sólidos' },
    { id: 'complete_cars', label: 'Carros Completos' },
    { id: 'wheels', label: 'Rodas' },
    { id: 'bus_truck', label: 'Ônibus e Caminhão' },
  ];

  const brands = [
    'Audi',
    'BMW',
    'Cadillac',
    'Chevrolet',
    'Ferrari',
    'Ford',
    'Honda',
    'Lamborghini',
    'Mercedes',
    'Porsche',
    'Toyota',
    'Volkswagen',
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, selectedBrand, searchTerm]);

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
  }

  function filterProducts() {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">Modelos 3D</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Biblioteca completa de modelos automotivos profissionais
          </p>
        </div>

        <div className="backdrop-blur border border-gray-800 rounded-lg p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-2.5 sm:px-4 py-1 rounded text-xs sm:text-sm transition-all ${
                selectedBrand === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Todas Marcas
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-2.5 sm:px-4 py-1 rounded text-xs sm:text-sm transition-all ${
                  selectedBrand === brand
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm sm:text-base pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none"
              />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all whitespace-nowrap">
              Solicitar Criação de Arquivo
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg sm:text-xl">Nenhum produto encontrado</p>
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
                        className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded"
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
