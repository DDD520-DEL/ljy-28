export * from './storage';

import type { Area } from 'react-easy-crop';

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  minQuality?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7,
    maxSizeKB = 150,
    minQuality = 0.4,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas 2D context not supported'));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      let currentQuality = quality;
      let result = '';

      const tryCompress = () => {
        result = canvas.toDataURL('image/jpeg', currentQuality);
        const sizeKB = (result.length * 0.75) / 1024;

        if (sizeKB > maxSizeKB && currentQuality > minQuality) {
          currentQuality = Math.max(currentQuality - 0.15, minQuality);
          tryCompress();
        } else {
          URL.revokeObjectURL(img.src);
          resolve(result);
        }
      };

      try {
        tryCompress();
      } catch (e) {
        URL.revokeObjectURL(img.src);
        reject(e);
      }
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function getBase64SizeKB(base64: string): number {
  const base64Length = base64.length - (base64.indexOf(',') + 1);
  return (base64Length * 0.75) / 1024;
}

export function formatFileSize(kb: number): string {
  if (kb < 1) return `${Math.round(kb * 1024)} B`;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatDateRelative(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return formatDate(dateString);
}

export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7,
    maxSizeKB = 150,
    minQuality = 0.4,
  } = options;

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  let finalWidth = pixelCrop.width;
  let finalHeight = pixelCrop.height;

  if (finalWidth > maxWidth || finalHeight > maxHeight) {
    const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight);
    finalWidth = Math.floor(finalWidth * ratio);
    finalHeight = Math.floor(finalHeight * ratio);
  }

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, finalWidth, finalHeight);
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    finalWidth,
    finalHeight
  );

  let currentQuality = quality;
  let result = '';

  const tryCompress = () => {
    result = canvas.toDataURL('image/jpeg', currentQuality);
    const sizeKB = getBase64SizeKB(result);

    if (sizeKB > maxSizeKB && currentQuality > minQuality) {
      currentQuality = Math.max(currentQuality - 0.15, minQuality);
      tryCompress();
    }
  };

  tryCompress();

  return result;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}
