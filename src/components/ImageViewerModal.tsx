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
  const [positionX, setPositionX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [isPinching, setIsPinching] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchMoved, setTouchMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPositionX(0);
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

  const toggleZoom = () => {
    if (scale === 1) {
      setScale(2.5);
    } else {
      setScale(1);
      setPositionX(0);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    toggleZoom();
  };


  const constrainPositionX = (x: number, currentScale: number) => {
    if (!imageRef.current || !containerRef.current) return x;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();
    const scaledWidth = imgRect.width * currentScale / scale;

    if (scaledWidth <= containerRect.width) {
      return 0;
    }

    const maxOffset = (scaledWidth - containerRect.width) / 2;
    return Math.max(-maxOffset, Math.min(maxOffset, x));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    const newScale = Math.max(0.5, Math.min(10, scale + delta));

    if (newScale !== scale) {
      setScale(newScale);
      if (newScale <= 1) {
        setPositionX(0);
      } else {
        setPositionX(prev => constrainPositionX(prev, newScale));
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStartX(e.clientX - positionX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStartX;
      setPositionX(constrainPositionX(newX, scale));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsDragging(false);
      setIsPinching(true);
      setTouchMoved(true);
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1) {
      setTouchStartTime(Date.now());
      setTouchMoved(false);
      if (scale > 1) {
        e.preventDefault();
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX - positionX);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault();
      setTouchMoved(true);

      const currentDistance = getTouchDistance(e.touches);
      const scaleDelta = currentDistance / lastTouchDistance;
      const newScale = Math.max(0.5, Math.min(10, scale * scaleDelta));

      setScale(newScale);
      if (newScale <= 1) {
        setPositionX(0);
      }
      setLastTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      setTouchMoved(true);
      const newX = e.touches[0].clientX - dragStartX;
      setPositionX(constrainPositionX(newX, scale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;

    if (e.touches.length === 1 && isPinching) {
      setPositionX(prev => constrainPositionX(prev, scale));
      setLastTouchDistance(null);
      setIsPinching(false);
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX - positionX);
      setTouchMoved(true);
      return;
    }

    if (e.touches.length < 2) {
      setLastTouchDistance(null);
      if (isPinching) {
        setPositionX(prev => constrainPositionX(prev, scale));
      }
      setIsPinching(false);
    }

    if (e.touches.length === 0) {
      const wasTap = !touchMoved && touchDuration < 300;
      if (wasTap && e.changedTouches.length === 1) {
        toggleZoom();
      }
      setIsDragging(false);
      setTouchMoved(false);
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
          cursor: scale > 1 ? (isDragging && !isPinching ? 'grabbing' : 'grab') : 'zoom-in',
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
            transform: `translateX(${positionX}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: (isDragging || isPinching) ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg pointer-events-none text-center max-w-[90%]">
        {scale === 1 ? 'Toque para dar zoom' : 'Arraste para os lados • Toque para resetar'}
      </div>
    </div>
  );
}
