import { Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface EditableImageProps {
  slotId: string;
  currentUrl: string;
  isAdmin: boolean;
  onUpdate: () => void;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  children?: React.ReactNode;
}

export default function EditableImage({
  slotId,
  currentUrl,
  isAdmin,
  onUpdate,
  className = '',
  style,
  alt = '',
  children,
}: EditableImageProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${slotId}-${Date.now()}.${fileExt}`;
      const filePath = `site/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('site_images')
        .update({ image_url: publicUrl })
        .eq('slot_id', slotId);

      if (dbError) throw dbError;

      onUpdate();
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const imageUrl = currentUrl || 'https://via.placeholder.com/800x450/1f2937/ffffff?text=Clique+para+adicionar';

  return (
    <div className={`relative group ${className}`} style={style}>
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {children}

      {isAdmin && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <div className="text-white flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Enviando...</span>
            </div>
          ) : (
            <label className="cursor-pointer text-white flex flex-col items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              <Upload className="w-6 h-6" />
              <span className="text-sm font-semibold">Clique para alterar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
