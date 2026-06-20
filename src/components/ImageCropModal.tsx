import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Check, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCropModalProps {
  imageSrc: string;
  onConfirm: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageCropModal({
  imageSrc,
  onConfirm,
  onCancel,
  aspect = 4 / 3,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onConfirm(croppedAreaPixels);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-white dark:bg-kraft-800 rounded-2xl shadow-xl w-[calc(100vw-2rem)] max-w-lg overflow-hidden animate-fade-in-up border border-kraft-100 dark:border-kraft-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-kraft-100 dark:border-kraft-700">
          <h3 className="text-lg font-semibold text-kraft-800 dark:text-kraft-100">裁剪图片</h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-kraft-100 dark:bg-kraft-700 text-kraft-600 dark:text-kraft-300 flex items-center justify-center hover:bg-kraft-200 dark:hover:bg-kraft-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full h-[60vh] max-h-[400px] bg-kraft-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: { background: '#1A1410' },
            }}
          />
        </div>

        <div className="px-5 py-4 border-t border-kraft-100 dark:border-kraft-700">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                zoom <= 1
                  ? 'bg-kraft-50 dark:bg-kraft-700 text-kraft-300 dark:text-kraft-500 cursor-not-allowed'
                  : 'bg-kraft-100 dark:bg-kraft-700 text-kraft-600 dark:text-kraft-300 hover:bg-kraft-200 dark:hover:bg-kraft-600'
              )}
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center">
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-kraft-200 dark:bg-kraft-600 rounded-full appearance-none cursor-pointer accent-kraft-500"
              />
            </div>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                zoom >= 3
                  ? 'bg-kraft-50 dark:bg-kraft-700 text-kraft-300 dark:text-kraft-500 cursor-not-allowed'
                  : 'bg-kraft-100 dark:bg-kraft-700 text-kraft-600 dark:text-kraft-300 hover:bg-kraft-200 dark:hover:bg-kraft-600'
              )}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-lg bg-kraft-100 dark:bg-kraft-700 text-kraft-600 dark:text-kraft-300 flex items-center justify-center hover:bg-kraft-200 dark:hover:bg-kraft-600 transition-colors"
              title="重置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-kraft-600 dark:text-kraft-300 bg-kraft-100 dark:bg-kraft-700 rounded-xl hover:bg-kraft-200 dark:hover:bg-kraft-600 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 text-sm font-medium text-white bg-kraft-500 rounded-xl hover:bg-kraft-600 transition-colors inline-flex items-center gap-2 shadow-paper"
            >
              <Check className="w-4 h-4" />
              确认裁剪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
