import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [isPinching, setIsPinching] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchMoved, setTouchMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
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

  const toggleZoom = useCallback(() => {
    if (scale === 1) {
      setScale(2.5);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const constrainPosition = useCallback((x: number, y: number, currentScale: number) => {
    if (!imageRef.current || !containerRef.current) return { x, y };

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    const scaledWidth = (imgRect.width / scale) * currentScale;
    const scaledHeight = (imgRect.height / scale) * currentScale;

    let constrainedX = x;
    let constrainedY = y;

    if (scaledWidth <= containerRect.width) {
      constrainedX = 0;
    } else {
      const maxOffsetX = (scaledWidth - containerRect.width) / 2;
      constrainedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, x));
    }

    if (scaledHeight <= containerRect.height) {
      constrainedY = 0;
    } else {
      const maxOffsetY = (scaledHeight - containerRect.height) / 2;
      constrainedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, y));
    }

    return { x: constrainedX, y: constrainedY };
  }, [scale]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    const newScale = Math.max(0.5, Math.min(10, scale + delta));

    if (newScale !== scale) {
      setScale(newScale);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        setPosition(prev => constrainPosition(prev.x, prev.y, newScale));
      }
    }
  }, [scale, constrainPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOpen) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isOpen, handleWheel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const constrained = constrainPosition(newX, newY, scale);
      setPosition(constrained);
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
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length === 2) {
      setIsDragging(false);
      setIsPinching(true);
      setTouchMoved(true);
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1) {
      setTouchStartTime(Date.now());
      setTouchMoved(false);
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length === 2 && lastTouchDistance !== null) {
      setTouchMoved(true);

      const currentDistance = getTouchDistance(e.touches);
      const scaleDelta = currentDistance / lastTouchDistance;
      const newScale = Math.max(0.5, Math.min(10, scale * scaleDelta));

      setScale(newScale);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      setLastTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setTouchMoved(true);
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      const constrained = constrainPosition(newX, newY, scale);
      setPosition(constrained);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const touchDuration = Date.now() - touchStartTime;

    if (e.touches.length === 1 && isPinching) {
      setPosition(prev => constrainPosition(prev.x, prev.y, scale));
      setLastTouchDistance(null);
      setIsPinching(false);
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
      setTouchMoved(true);
      return;
    }

    if (e.touches.length < 2) {
      setLastTouchDistance(null);
      if (isPinching) {
        setPosition(prev => constrainPosition(prev.x, prev.y, scale));
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

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging && (e.target === containerRef.current || e.target === imageRef.current)) {
      toggleZoom();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onClick={handleContainerClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          className="max-w-full max-h-full select-none object-contain"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: (isDragging || isPinching) ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div className="flex-shrink-0 bg-black px-4 py-4 flex flex-col items-center gap-3 safe-area-bottom">
        <div className="text-white text-xs sm:text-sm bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg text-center">
          {scale === 1 ? 'Toque para dar zoom' : 'Arraste para mover | Toque para resetar'}
        </div>

        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
        >
          <X className="w-5 h-5" />
          Fechar
        </button>
      </div>
    </div>,
    document.body
  );
}
