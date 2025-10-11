import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  selectedBrand: string;
  onSuccess: () => void;
}

export function AddProductModal({ isOpen, onClose, category, selectedBrand, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState(selectedBrand !== 'all' ? selectedBrand : '');
  const [price, setPrice] = useState('0.00');
  const [formats, setFormats] = useState('STL');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const getCategoryName = (categoryId: string): string => {
    const categoryMap: { [key: string]: string } = {
      'solid_cars': 'Carros Sólidos',
      'complete_cars': 'Carros Completos',
      'wheels': 'Rodas',
      'bus_truck': 'Ônibus e Caminhão'
    };
    return categoryMap[categoryId] || categoryId;
  };

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
    'BMW',
    'CHEVROLET / GM',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'JEEP',
    'LAMBORGHINI',
    'LAND ROVER',
    'LEXUS',
    'MERCEDES',
    'MITSUBISHI',
    'NISSAN',
    'PORSCHE',
    'TOYOTA',
    'VITTORIA',
    'VOLCANO',
    'VOLKSWAGEN',
  ];

  const getBrandsForCategory = (categoryId: string): string[] => {
    switch (categoryId) {
      case 'solid_cars':
        return solidCarsBrands;
      case 'complete_cars':
        return completeCarsBrands;
      case 'wheels':
        return wheelsBrands;
      default:
        return [];
    }
  };

  const availableBrands = getBrandsForCategory(category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !brand.trim()) {
      alert('Nome e marca são obrigatórios');
      return;
    }

    const priceValue = parseFloat(price.replace(',', '.'));
    if (isNaN(priceValue) || priceValue < 0) {
      alert('Preço inválido');
      return;
    }

    setIsCreating(true);

    try {
      const formatsArray = formats
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const { error } = await supabase
        .from('products')
        .insert({
          name: name.trim(),
          brand: brand.trim(),
          category: getCategoryName(category),
          price: priceValue,
          formats: formatsArray,
          image_url: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
          description: '',
          purchase_url: ''
        });

      if (error) {
        console.error('Error creating product:', error);
        alert('Erro ao criar produto');
        return;
      }

      setName('');
      setBrand('');
      setPrice('0.00');
      setFormats('STL');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Erro ao criar produto');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Adicionar Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-950 border border-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">
            Categoria: <span className="text-white font-semibold">{getCategoryName(category)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nome do produto *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: VW Gol G5"
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {selectedBrand === 'all' && (
            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                Marca *
              </label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-600"
                required
              >
                <option value="" disabled>Selecione uma marca</option>
                {availableBrands.map((brandOption) => (
                  <option key={brandOption} value={brandOption}>
                    {brandOption}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedBrand !== 'all' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Marca
              </label>
              <div className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white">
                {brand}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
              Preço
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="formats" className="block text-sm font-medium text-gray-300 mb-2">
              Formatos (separados por vírgula)
            </label>
            <input
              id="formats"
              type="text"
              value={formats}
              onChange={(e) => setFormats(e.target.value)}
              placeholder="STL"
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Criando...' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
