import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
  onSave: (price: number) => Promise<void>;
}

export function EditPriceModal({ isOpen, onClose, currentPrice, onSave }: EditPriceModalProps) {
  const [price, setPrice] = useState(currentPrice.toFixed(2));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPrice(currentPrice.toFixed(2));
  }, [currentPrice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        alert('Por favor, insira um preço válido');
        return;
      }
      await onSave(numericPrice);
      onClose();
    } catch (error) {
      console.error('Error saving price:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Editar Preço</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
              Preço (R$)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              required
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
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
