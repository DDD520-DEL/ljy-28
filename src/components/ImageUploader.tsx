import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Crop } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileToBase64, getCroppedImage, formatFileSize, getBase64SizeKB } from '@/utils';
import { toast } from './Toast';
import ImageCropModal from './ImageCropModal';
import type { Area } from 'react-easy-crop';

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  placeholder?: string;
  maxSizeKB?: number;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  placeholder = '点击或拖拽上传图片',
  maxSizeKB = 150,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('请选择图片文件（JPG、PNG、GIF 等）');
        return;
      }

      const originalSizeKB = file.size / 1024;
      setOriginalSize(originalSizeKB);
      setOriginalImageSrc(null);

      try {
        const base64 = await fileToBase64(file);
        setOriginalImageSrc(base64);
        setCropImageSrc(base64);
      } catch {
        toast.error('图片读取失败，请换一张图片试试');
      }
    },
    []
  );

  const handleCropConfirm = useCallback(
    async (croppedAreaPixels: Area) => {
      if (!originalImageSrc) return;

      setCropImageSrc(null);
      setIsCompressing(true);

      try {
        const compressed = await getCroppedImage(originalImageSrc, croppedAreaPixels, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.7,
          maxSizeKB,
          minQuality: 0.4,
        });

        const finalSizeKB = getBase64SizeKB(compressed);
        setCompressedSize(finalSizeKB);
        onChange(compressed);

        const savedPercent = originalSize && originalSize > 0
          ? Math.round((1 - finalSizeKB / originalSize) * 100)
          : 0;

        if (savedPercent > 10) {
          toast.success(
            `裁剪并压缩 ${savedPercent}%（${formatFileSize(originalSize ?? 0)} → ${formatFileSize(finalSizeKB)}）`
          );
        } else {
          toast.success('图片裁剪完成');
        }
      } catch (e) {
        console.error('图片处理失败:', e);
        toast.error('图片处理失败，请换一张图片试试');
      } finally {
        setIsCompressing(false);
      }
    },
    [originalImageSrc, onChange, maxSizeKB, originalSize]
  );

  const handleCropCancel = useCallback(() => {
    setCropImageSrc(null);
    if (!value) {
      setOriginalImageSrc(null);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [value]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => {
    if (!isCompressing && !cropImageSrc) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setOriginalSize(null);
    setCompressedSize(null);
    setOriginalImageSrc(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRecrop = (e: React.MouseEvent) => {
    e.stopPropagation();
    const source = originalImageSrc || value;
    if (source) {
      if (!originalImageSrc) {
        toast.warning('当前图片无原图，重新裁剪可能损失画质');
      }
      setCropImageSrc(source);
    }
  };

  return (
    <div className={className}>
      {label && <p className="label-text">{label}</p>}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden',
          'flex flex-col items-center justify-center',
          isCompressing ? 'cursor-wait' : 'cursor-pointer',
          isDragging
            ? 'border-kraft-400 bg-kraft-50'
            : 'border-kraft-200 bg-paper-white hover:border-kraft-300 hover:bg-kraft-50/50',
          value ? 'p-0' : 'p-8 min-h-[200px]'
        )}
      >
        {isCompressing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-kraft-500 animate-spin mb-2" />
            <p className="text-sm text-kraft-600 font-medium">正在压缩图片...</p>
            <p className="text-xs text-kraft-400 mt-1">
              原图 {originalSize ? formatFileSize(originalSize) : '...'}
            </p>
          </div>
        )}

        {value ? (
          <>
            <img
              src={value}
              alt="预览"
              className="w-full h-full object-contain max-h-[300px]"
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-kraft-700 flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleRecrop}
              className="absolute top-3 right-14 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-kraft-700 flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
              title="重新裁剪"
            >
              <Crop className="w-4 h-4" />
            </button>
            {compressedSize !== null && (
              <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs text-kraft-600 shadow-sm flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                {formatFileSize(compressedSize)}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kraft-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-kraft-500" />
            </div>
            <p className="text-sm font-medium text-kraft-700 mb-1">{placeholder}</p>
            <p className="text-xs text-kraft-400 mb-2">支持 JPG、PNG、GIF 格式</p>
            <p className="text-xs text-forest-600 bg-forest-50 inline-block px-2 py-0.5 rounded-full">
              裁剪并压缩至 {maxSizeKB}KB 以内
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
