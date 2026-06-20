import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function CompareSlider({
  beforeImage,
  afterImage,
  beforeLabel = '改造前',
  afterLabel = '改造后',
  className,
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updatePosition(e.clientX);
      }
    },
    [isDragging, updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) {
        updatePosition(e.touches[0].clientX);
      }
    },
    [isDragging, updatePosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-card select-none',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={afterImage}
        alt={afterLabel}
        className="w-full h-auto block"
        draggable={false}
      />

      <div
        className="absolute top-0 left-0 bottom-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute top-0 left-0 h-full w-auto max-w-none"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            minWidth: '100%',
          }}
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-4 rounded-full bg-kraft-300" />
            <div className="w-0.5 h-4 rounded-full bg-kraft-300" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4">
        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-black/50 backdrop-blur-sm text-white">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 right-4">
        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-forest-500/80 backdrop-blur-sm text-white">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
