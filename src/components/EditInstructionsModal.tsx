import { useState } from 'react';
import { X } from 'lucide-react';

interface EditInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInstructions: string;
  onSave: (newInstructions: string) => Promise<void>;
}

export function EditInstructionsModal({
  isOpen,
  onClose,
  currentInstructions,
  onSave,
}: EditInstructionsModalProps) {
  const [instructions, setInstructions] = useState(currentInstructions);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(instructions);
      onClose();
    } catch (error) {
      console.error('Error saving instructions:', error);
      alert('Erro ao salvar instruções');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Editar Instruções de Uso</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Digite as instruções de uso para este produto..."
            className="w-full h-64 bg-gray-800 text-white border border-gray-700 rounded-lg p-4 focus:border-red-600 focus:outline-none resize-none"
          />
          <p className="text-gray-400 text-sm mt-2">
            Dica: Use linhas vazias para separar parágrafos e deixar as instruções mais legíveis.
          </p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
