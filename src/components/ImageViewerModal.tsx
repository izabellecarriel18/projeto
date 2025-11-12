import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export function ImageViewerModal({ isOpen, onClose, imageUrl, alt }: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="text-white hover:text-red-500 transition-colors p-2"
          title="Diminuir zoom"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <span className="text-white text-sm font-medium min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="text-white hover:text-red-500 transition-colors p-2"
          title="Aumentar zoom"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={imageRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-none select-none"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        />
      </div>

      {scale > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
          Arraste para mover a imagem
        </div>
      )}
    </div>
  );
}
