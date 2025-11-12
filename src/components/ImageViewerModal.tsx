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
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  const [isPinching, setIsPinching] = useState(false);
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    e.stopPropagation();

    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const clickPercentX = clickX / rect.width;
    const clickPercentY = clickY / rect.height;

    if (scale === 1) {
      const newScale = 2.5;
      setScale(newScale);

      const imageNaturalWidth = rect.width;
      const imageNaturalHeight = rect.height;

      const scaledWidth = imageNaturalWidth * newScale;
      const scaledHeight = imageNaturalHeight * newScale;

      const offsetX = (containerRect.width - imageNaturalWidth) / 2;
      const offsetY = (containerRect.height - imageNaturalHeight) / 2;

      const targetX = offsetX + (containerRect.width / 2 - (clickX + offsetX) * newScale);
      const targetY = offsetY + (containerRect.height / 2 - (clickY + offsetY) * newScale);

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

  const getImageDimensions = () => {
    if (!imageRef.current) return { width: 0, height: 0 };

    const img = imageRef.current;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { width: 0, height: 0 };

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let baseWidth, baseHeight;

    if (imgAspect > containerAspect) {
      baseWidth = Math.min(img.naturalWidth, containerRect.width);
      baseHeight = baseWidth / imgAspect;
    } else {
      baseHeight = Math.min(img.naturalHeight, containerRect.height);
      baseWidth = baseHeight * imgAspect;
    }

    return { width: baseWidth, height: baseHeight };
  };

  const constrainPosition = (x: number, y: number, currentScale: number) => {
    if (!imageRef.current || !containerRef.current) return { x, y };

    const containerRect = containerRef.current.getBoundingClientRect();
    const { width: baseWidth, height: baseHeight } = getImageDimensions();

    const scaledWidth = baseWidth * currentScale;
    const scaledHeight = baseHeight * currentScale;

    let constrainedX = x;
    let constrainedY = y;

    if (scaledWidth > containerRect.width) {
      const minX = containerRect.width - scaledWidth;
      const maxX = 0;
      constrainedX = Math.min(maxX, Math.max(minX, x));
    } else {
      constrainedX = (containerRect.width - scaledWidth) / 2;
    }

    if (scaledHeight > containerRect.height) {
      const minY = containerRect.height - scaledHeight;
      const maxY = 0;
      constrainedY = Math.min(maxY, Math.max(minY, y));
    } else {
      constrainedY = (containerRect.height - scaledHeight) / 2;
    }

    return { x: constrainedX, y: constrainedY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newPos = constrainPosition(
        e.clientX - dragStart.x,
        e.clientY - dragStart.y,
        scale
      );
      setPosition(newPos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (!imageRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const { width: baseWidth, height: baseHeight } = getImageDimensions();

    const currentImgWidth = baseWidth * scale;
    const currentImgHeight = baseHeight * scale;

    const imgCenterX = containerRect.width / 2 + position.x;
    const imgCenterY = containerRect.height / 2 + position.y;

    const mouseRelativeToContainerX = e.clientX - containerRect.left;
    const mouseRelativeToContainerY = e.clientY - containerRect.top;

    const offsetFromCenterX = mouseRelativeToContainerX - imgCenterX;
    const offsetFromCenterY = mouseRelativeToContainerY - imgCenterY;

    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    const newScale = Math.max(0.5, Math.min(10, scale + delta));

    if (newScale !== scale) {
      setScale(newScale);

      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        const scaleRatio = newScale / scale;

        const newOffsetX = offsetFromCenterX * scaleRatio;
        const newOffsetY = offsetFromCenterY * scaleRatio;

        const newCenterX = mouseRelativeToContainerX - newOffsetX;
        const newCenterY = mouseRelativeToContainerY - newOffsetY;

        const newX = newCenterX - containerRect.width / 2;
        const newY = newCenterY - containerRect.height / 2;

        const constrainedPos = constrainPosition(newX, newY, newScale);
        setPosition(constrainedPos);
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
      setIsDragging(false);
      setIsPinching(true);
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    } else if (e.touches.length === 1) {
      if (scale > 1) {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null && lastTouchCenter !== null) {
      e.preventDefault();

      if (!imageRef.current || !containerRef.current) return;

      const currentDistance = getTouchDistance(e.touches);
      const currentCenter = getTouchCenter(e.touches);

      const containerRect = containerRef.current.getBoundingClientRect();
      const { width: baseWidth, height: baseHeight } = getImageDimensions();

      const pinchCenterX = currentCenter.x - containerRect.left;
      const pinchCenterY = currentCenter.y - containerRect.top;

      const imgCenterX = containerRect.width / 2 + position.x;
      const imgCenterY = containerRect.height / 2 + position.y;

      const offsetFromCenterX = pinchCenterX - imgCenterX;
      const offsetFromCenterY = pinchCenterY - imgCenterY;

      const scaleDelta = currentDistance / lastTouchDistance;
      const newScale = Math.max(0.5, Math.min(10, scale * scaleDelta));

      setScale(newScale);

      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        const newOffsetX = offsetFromCenterX * scaleDelta;
        const newOffsetY = offsetFromCenterY * scaleDelta;

        const newCenterX = pinchCenterX - newOffsetX;
        const newCenterY = pinchCenterY - newOffsetY;

        const newX = newCenterX - containerRect.width / 2;
        const newY = newCenterY - containerRect.height / 2;

        const constrainedPos = constrainPosition(newX, newY, newScale);
        setPosition(constrainedPos);
      }

      setLastTouchDistance(currentDistance);
      setLastTouchCenter(currentCenter);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      const newPos = constrainPosition(
        e.touches[0].clientX - dragStart.x,
        e.touches[0].clientY - dragStart.y,
        scale
      );
      setPosition(newPos);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(null);
      setLastTouchCenter(null);
      setIsPinching(false);
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
          onTouchEnd={(e) => {
            if (e.touches.length === 0 && !isDragging && e.changedTouches.length === 1) {
              handleImageClick(e as any);
            }
          }}
          className="max-w-full max-h-full select-none object-contain"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: (isDragging || isPinching) ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg pointer-events-none text-center max-w-[90%]">
        {scale === 1 ? 'Toque na imagem para dar zoom' : 'Arraste para mover • Toque para resetar'}
      </div>
    </div>
  );
}
