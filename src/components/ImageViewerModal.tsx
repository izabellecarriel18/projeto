import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

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
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();

    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clickPercentX = clickX / rect.width;
    const clickPercentY = clickY / rect.height;

    if (scale === 1) {
      const newScale = 2.5;
      setScale(newScale);

      const containerRect = containerRef.current.getBoundingClientRect();
      const scaledWidth = rect.width * newScale;
      const scaledHeight = rect.height * newScale;

      const targetX = containerRect.width / 2 - clickPercentX * scaledWidth;
      const targetY = containerRect.height / 2 - clickPercentY * scaledHeight;

      setPosition({ x: targetX, y: targetY });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
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

    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mousePercentX = mouseX / rect.width;
    const mousePercentY = mouseY / rect.height;

    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    const newScale = Math.max(0.5, Math.min(5, scale + delta));

    if (newScale !== scale) {
      setScale(newScale);

      if (newScale > 1) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const scaledWidth = (rect.width / scale) * newScale;
        const scaledHeight = (rect.height / scale) * newScale;

        const targetX = containerRect.width / 2 - mousePercentX * scaledWidth;
        const targetY = containerRect.height / 2 - mousePercentY * scaledHeight;

        setPosition({ x: targetX, y: targetY });
      } else if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault();

      if (!imageRef.current || !containerRef.current) return;

      const currentDistance = getTouchDistance(e.touches);
      const touchCenter = getTouchCenter(e.touches);

      const rect = imageRef.current.getBoundingClientRect();
      const touchX = touchCenter.x - rect.left;
      const touchY = touchCenter.y - rect.top;

      const touchPercentX = touchX / rect.width;
      const touchPercentY = touchY / rect.height;

      const scaleDelta = currentDistance / lastTouchDistance;
      const newScale = Math.max(0.5, Math.min(5, scale * scaleDelta));

      if (newScale !== scale) {
        setScale(newScale);

        if (newScale > 1) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const scaledWidth = (rect.width / scale) * newScale;
          const scaledHeight = (rect.height / scale) * newScale;

          const targetX = containerRect.width / 2 - touchPercentX * scaledWidth;
          const targetY = containerRect.height / 2 - touchPercentY * scaledHeight;

          setPosition({ x: targetX, y: targetY });
        } else if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      }

      setLastTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(null);
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          touchAction: 'none',
        }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={alt}
          onClick={handleImageClick}
          className="max-w-full max-h-full select-none object-contain"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg pointer-events-none text-center max-w-[90%]">
        {scale === 1 ? 'Toque na imagem para dar zoom' : 'Arraste para mover • Toque para resetar'}
      </div>
    </div>
  );
}
