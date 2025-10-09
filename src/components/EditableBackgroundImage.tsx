import { Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface EditableBackgroundImageProps {
  slotId: string;
  currentUrl: string;
  isAdmin: boolean;
  onUpdate: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function EditableBackgroundImage({
  slotId,
  currentUrl,
  isAdmin,
  onUpdate,
  className = '',
  style,
  children,
}: EditableBackgroundImageProps) {
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

  return (
    <section className={`relative ${className}`} style={style}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${currentUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          {uploading ? (
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Enviando...</span>
            </div>
          ) : (
            <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-semibold">Alterar Fundo</span>
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

      {children}
    </section>
  );
}
