import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Upload, RefreshCw, Trash2, FileUp, FileCheck, ShoppingCart } from 'lucide-react';
import { EditPriceModal } from './EditPriceModal';
import { EditDescriptionModal } from './EditDescriptionModal';
import { EditProductNameModal } from './EditProductNameModal';
import JSZip from 'jszip';

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
  file_url?: string;
  file_name?: string;
  wheel_file_url?: string;
  wheel_file_name?: string;
}

interface ProductCardProps {
  product: Product;
  onImageUpload?: (productId: string) => void;
  onDelete?: () => void;
}

const generatingCache = new Set<string>();

export function ProductCard({ product, onImageUpload, onDelete }: ProductCardProps) {
  const { profile } = useAuth();
  const { addToCart, cart } = useCart();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price);
  const [fileUrl, setFileUrl] = useState(product.file_url || '');
  const [fileName, setFileName] = useState(product.file_name || '');
  const [wheelFileUrl, setWheelFileUrl] = useState(product.wheel_file_url || '');
  const [wheelFileName, setWheelFileName] = useState(product.wheel_file_name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingWheelFile, setIsUploadingWheelFile] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wheelFileInputRef = useRef<HTMLInputElement>(null);
  const hasChecked = useRef(false);
  const isAdmin = profile?.role === 'admin';
  const isInCart = cart.some(item => item.id === product.id);

  console.log('[ProductCard Debug]', {
    productId: product.id,
    productName: product.name,
    profile,
    isAdmin,
    onImageUpload: !!onImageUpload,
    shouldShowButton: isAdmin && onImageUpload
  });

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

  async function generateDescription(forceRegenerate = false) {
    if (isGenerating) return;

    if (!forceRegenerate && generatingCache.has(product.id)) return;

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
    } finally {
      setIsGenerating(false);
      if (forceRegenerate) {
        generatingCache.delete(product.id);
      }
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

  const handleSavePrice = async (newPrice: number) => {
    const { error } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('id', product.id);

    if (error) {
      console.error('Error updating price:', error);
      throw error;
    }

    setPrice(newPrice);
  };

  const handleSaveDescription = async (newDescription: string) => {
    const { error } = await supabase
      .from('products')
      .update({ description: newDescription })
      .eq('id', product.id);

    if (error) {
      console.error('Error updating description:', error);
      throw error;
    }

    setDescription(newDescription);
  };

  const handleDescriptionClick = () => {
    if (!isAdmin) return;
    setIsDescriptionModalOpen(true);
  };

  const handleRegenerateDescription = () => {
    if (!isAdmin) return;
    generateDescription(true);
  };

  const handleSaveName = async (newName: string) => {
    const { error } = await supabase
      .from('products')
      .update({ name: newName })
      .eq('id', product.id);

    if (error) {
      console.error('Error updating name:', error);
      throw error;
    }

    setName(newName);
  };

  const handleNameClick = () => {
    if (!isAdmin) return;
    setIsNameModalOpen(true);
  };

  const handleDelete = async () => {
    if (!isAdmin) return;

    const confirmDelete = confirm(`Tem certeza que deseja excluir "${name}"?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) {
        console.error('Error deleting product:', error);
        alert('Erro ao excluir produto');
        return;
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir produto');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isAdmin) return;

    setIsUploadingFile(true);

    try {
      const maxSize = 50 * 1024 * 1024;
      let fileToUpload: File | Blob = file;
      let uploadFileName = file.name;
      let originalFileName = file.name;

      let wasCompressed = false;

      console.log(`[Upload Debug] File name: ${file.name}`);
      console.log(`[Upload Debug] File size: ${file.size} bytes (${(file.size / 1024).toFixed(2)} KB, ${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`[Upload Debug] Max size: ${maxSize} bytes (${(maxSize / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`[Upload Debug] File exceeds limit: ${file.size > maxSize}`);

      const isAlreadyCompressed = /\.(zip|rar|7z)$/i.test(file.name);
      console.log(`[Upload Debug] File is already compressed: ${isAlreadyCompressed}`);

      if (file.size > maxSize) {
        if (isAlreadyCompressed) {
          alert(
            `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB).\n\n` +
            `O arquivo já está comprimido e excede o limite de 50MB.\n` +
            `Por favor, reduza o tamanho do arquivo ou divida em partes menores.`
          );
          setIsUploadingFile(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        try {
          console.log('[Compression] Starting compression with maximum settings...');
          const zip = new JSZip();
          zip.file(file.name, file);

          const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
              level: 9
            },
            streamFiles: true
          });

          console.log(`[Compression] Original: ${(file.size / 1024 / 1024).toFixed(2)}MB -> Compressed: ${(zipBlob.size / 1024 / 1024).toFixed(2)}MB`);
          console.log(`[Compression] Compression ratio: ${((1 - zipBlob.size / file.size) * 100).toFixed(1)}%`);

          if (zipBlob.size > maxSize) {
            alert(
              `Mesmo após compressão, o arquivo ainda é muito grande (${(zipBlob.size / 1024 / 1024).toFixed(2)}MB).\n\n` +
              `O limite é 50MB. Por favor, reduza o tamanho do arquivo original.`
            );
            setIsUploadingFile(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            return;
          }

          fileToUpload = zipBlob;
          uploadFileName = file.name.replace(/\.[^/.]+$/, '') + '.zip';
          wasCompressed = true;
        } catch (zipError) {
          console.error('Error compressing file:', zipError);
          alert('Erro ao comprimir arquivo. Tente novamente.');
          setIsUploadingFile(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }
      }

      const fileExt = uploadFileName.split('.').pop();
      const filePath = `${product.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(filePath, fileToUpload, {
          upsert: true,
          contentType: uploadFileName.endsWith('.zip') ? 'application/zip' : (file.type || 'application/octet-stream'),
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('products')
        .update({
          file_url: filePath,
          file_name: originalFileName
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      setFileUrl(filePath);
      setFileName(originalFileName);

      if (wasCompressed) {
        alert('Arquivo comprimido e adicionado ao card');
      } else {
        alert('Arquivo enviado com sucesso!');
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error,
      });

      if (error.message?.includes('exceeded the maximum allowed size') || error.message?.includes('Payload too large')) {
        alert(`Arquivo muito grande!\n\nTamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB\nLimite: 50 MB`);
      } else {
        alert(`Erro ao enviar arquivo: ${error.message || 'Tente novamente.'}`);
      }
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleWheelFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isAdmin) return;

    setIsUploadingWheelFile(true);

    try {
      const maxSize = 50 * 1024 * 1024;
      let fileToUpload: File | Blob = file;
      let uploadFileName = file.name;
      let originalFileName = file.name;

      let wasCompressed = false;

      const isAlreadyCompressed = /\.(zip|rar|7z)$/i.test(file.name);

      if (file.size > maxSize) {
        if (isAlreadyCompressed) {
          alert(
            `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB).\n\n` +
            `O arquivo já está comprimido e excede o limite de 50MB.\n` +
            `Por favor, reduza o tamanho do arquivo ou divida em partes menores.`
          );
          setIsUploadingWheelFile(false);
          if (wheelFileInputRef.current) {
            wheelFileInputRef.current.value = '';
          }
          return;
        }

        try {
          const zip = new JSZip();
          zip.file(file.name, file);

          const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
              level: 9
            },
            streamFiles: true
          });

          if (zipBlob.size > maxSize) {
            alert(
              `Mesmo após compressão, o arquivo ainda é muito grande (${(zipBlob.size / 1024 / 1024).toFixed(2)}MB).\n\n` +
              `O limite é 50MB. Por favor, reduza o tamanho do arquivo original.`
            );
            setIsUploadingWheelFile(false);
            if (wheelFileInputRef.current) {
              wheelFileInputRef.current.value = '';
            }
            return;
          }

          fileToUpload = zipBlob;
          uploadFileName = file.name.replace(/\.[^/.]+$/, '') + '.zip';
          wasCompressed = true;
        } catch (zipError) {
          console.error('Error compressing file:', zipError);
          alert('Erro ao comprimir arquivo. Tente novamente.');
          setIsUploadingWheelFile(false);
          if (wheelFileInputRef.current) {
            wheelFileInputRef.current.value = '';
          }
          return;
        }
      }

      const fileExt = uploadFileName.split('.').pop();
      const filePath = `${product.id}_wheel.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(filePath, fileToUpload, {
          upsert: true,
          contentType: uploadFileName.endsWith('.zip') ? 'application/zip' : (file.type || 'application/octet-stream'),
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('products')
        .update({
          wheel_file_url: filePath,
          wheel_file_name: originalFileName
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      setWheelFileUrl(filePath);
      setWheelFileName(originalFileName);

      if (wasCompressed) {
        alert('Arquivo da roda comprimido e adicionado ao card');
      } else {
        alert('Arquivo da roda enviado com sucesso!');
      }
    } catch (error: any) {
      console.error('Error uploading wheel file:', error);

      if (error.message?.includes('exceeded the maximum allowed size') || error.message?.includes('Payload too large')) {
        alert(`Arquivo muito grande!\n\nTamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB\nLimite: 50 MB`);
      } else {
        alert(`Erro ao enviar arquivo da roda: ${error.message || 'Tente novamente.'}`);
      }
    } finally {
      setIsUploadingWheelFile(false);
      if (wheelFileInputRef.current) {
        wheelFileInputRef.current.value = '';
      }
    }
  };

  const handleBuyClick = async () => {
    if (isProcessingPayment) return;

    try {
      setIsProcessingPayment(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Por favor, faça login para comprar');
        setIsProcessingPayment(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: name,
          price: price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Checkout error:', data);
        console.error('Checkout error details:', data.details);
        if (data.code === 'STRIPE_NOT_CONFIGURED') {
          alert(data.error);
        } else {
          const errorMsg = data.error || 'Erro ao processar pagamento. Tente novamente.';
          alert(errorMsg);
          console.log('Error message shown to user:', errorMsg);
        }
        setIsProcessingPayment(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setIsProcessingPayment(false);
    }
  };

  const handlePriceClick = () => {
    if (isAdmin) {
      setIsPriceModalOpen(true);
    }
  };

  const handleAddToCart = () => {
    if (!fileUrl || !wheelFileUrl) {
      alert('Este produto precisa ter os 2 arquivos (carro e roda) disponíveis');
      return;
    }

    addToCart({
      id: product.id,
      name: name,
      price: price,
      image_url: product.image_url,
    });
  };

  const hasBothFiles = fileUrl && wheelFileUrl;

  return (
    <>
      <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
        <div className="aspect-[16/11] bg-gray-950 overflow-hidden relative group">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {isAdmin && onImageUpload && (
            <button
              onClick={() => onImageUpload(product.id)}
              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
            >
              <div className="text-center pointer-events-none">
                <Upload className="w-10 h-10 text-white mx-auto mb-2" />
                <span className="text-white text-sm font-semibold">Alterar Imagem</span>
              </div>
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
              title="Excluir produto"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3
            onClick={handleNameClick}
            className={`text-white font-bold text-lg mb-1 ${isAdmin ? 'cursor-pointer hover:text-red-500 transition-colors' : ''}`}
            title={isAdmin ? 'Clique para editar nome' : ''}
          >
            {name}
          </h3>
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
            {product.formats.join(' , ')}
          </p>
          <div className="flex-1 mb-3">
            <p
              onClick={handleDescriptionClick}
              className={`text-gray-300 text-sm leading-relaxed ${isAdmin ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
              title={isAdmin ? 'Clique para editar descrição' : ''}
            >
              {isGenerating ? 'Gerando descrição...' : description}
            </p>
            {isAdmin && (
              <button
                onClick={handleRegenerateDescription}
                disabled={isGenerating}
                className="mt-2 flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Gerar nova descrição com IA"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Gerando...' : 'Regenerar com IA'}
              </button>
            )}
          </div>
          <div
            onClick={handlePriceClick}
            className={`text-white font-bold text-2xl mb-3 ${isAdmin ? 'cursor-pointer hover:text-red-500 transition-colors' : ''}`}
            title={isAdmin ? 'Clique para editar preço' : ''}
          >
            R$ {price.toFixed(2).replace('.', ',')}
          </div>
          {isAdmin && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".zip,.rar,.7z,.blend,.fbx,.obj,.stl,.max,.c4d"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                className={`w-full ${fileUrl ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 mb-2`}
              >
                {isUploadingFile ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : fileUrl ? (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>Arquivo já incluído</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-5 h-5" />
                    <span>Upload Arquivo</span>
                  </>
                )}
              </button>
              {fileName && (
                <p className="text-xs text-gray-400 mb-2 truncate" title={fileName}>
                  📎 Carro: {fileName}
                </p>
              )}
              <input
                ref={wheelFileInputRef}
                type="file"
                onChange={handleWheelFileUpload}
                className="hidden"
                accept=".zip,.rar,.7z,.blend,.fbx,.obj,.stl,.max,.c4d"
              />
              <button
                onClick={() => wheelFileInputRef.current?.click()}
                disabled={isUploadingWheelFile}
                className={`w-full ${wheelFileUrl ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 mb-2`}
              >
                {isUploadingWheelFile ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enviando Roda...</span>
                  </>
                ) : wheelFileUrl ? (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>Arquivo Roda incluído</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-5 h-5" />
                    <span>Upload Arquivo Roda</span>
                  </>
                )}
              </button>
              {wheelFileName && (
                <p className="text-xs text-gray-400 mb-2 truncate" title={wheelFileName}>
                  📎 Roda: {wheelFileName}
                </p>
              )}
            </>
          )}
          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              disabled={!hasBothFiles || isInCart}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors z-20 relative mt-auto flex items-center justify-center gap-2 mb-2"
              title={!hasBothFiles ? 'Produto precisa ter os 2 arquivos (carro e roda)' : isInCart ? 'Já está no carrinho' : ''}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isInCart ? 'No Carrinho' : 'Adicionar ao Carrinho'}</span>
            </button>
          )}
          <button
            onClick={handleBuyClick}
            disabled={isProcessingPayment || !hasBothFiles}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-colors z-20 relative mt-auto flex items-center justify-center gap-2"
            title={!hasBothFiles ? 'Produto precisa ter os 2 arquivos (carro e roda)' : ''}
          >
            {isProcessingPayment ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando...</span>
              </>
            ) : (
              <span>Comprar</span>
            )}
          </button>
        </div>
      </div>

      <EditPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        currentPrice={price}
        onSave={handleSavePrice}
      />

      <EditDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        currentDescription={description}
        onSave={handleSaveDescription}
      />

      <EditProductNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        currentName={name}
        onSave={handleSaveName}
      />
    </>
  );
}
