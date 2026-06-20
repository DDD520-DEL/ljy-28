import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  placeholder = '点击或拖拽上传图片',
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

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
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
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
          'relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden',
          'flex flex-col items-center justify-center',
          isDragging
            ? 'border-kraft-400 bg-kraft-50'
            : 'border-kraft-200 bg-paper-white hover:border-kraft-300 hover:bg-kraft-50/50',
          value ? 'p-0' : 'p-8 min-h-[200px]'
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="预览"
              className="w-full h-full object-contain max-h-[300px]"
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-kraft-700 flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kraft-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-kraft-500" />
            </div>
            <p className="text-sm font-medium text-kraft-700 mb-1">{placeholder}</p>
            <p className="text-xs text-kraft-400">支持 JPG、PNG、GIF 格式</p>
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
    </div>
  );
}
