const STORAGE_KEY = 'box_creative_log_records';

export class StorageQuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageQuotaExceededError';
  }
}

export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    if (e instanceof DOMException) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        throw new StorageQuotaExceededError(
          '存储空间不足，请删除一些旧记录或压缩图片后再试'
        );
      }
    }
    console.error('保存到本地存储失败:', e);
    throw e;
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error('从本地存储读取失败:', e);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('删除本地存储失败:', e);
  }
}

export function getStorageUsageKB(key: string): number {
  try {
    const item = localStorage.getItem(key);
    if (!item) return 0;
    return (item.length * 2) / 1024;
  } catch {
    return 0;
  }
}

export function getTotalStorageUsageKB(): number {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += (key.length + value.length) * 2;
        }
      }
    }
    return total / 1024;
  } catch {
    return 0;
  }
}

export async function getStorageQuotaInfo(): Promise<{
  usage: number;
  quota: number | null;
  usagePercent: number | null;
}> {
  let usage = 0;
  let quota: number | null = null;
  let usagePercent: number | null = null;

  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      usage = estimate.usage || 0;
      quota = estimate.quota || null;
      if (quota && quota > 0) {
        usagePercent = (usage / quota) * 100;
      }
    } catch {
      // ignore
    }
  }

  if (usage === 0) {
    usage = getTotalStorageUsageKB() * 1024;
  }

  return {
    usage: usage / 1024,
    quota: quota ? quota / 1024 : null,
    usagePercent,
  };
}

export function checkStorageSpace(additionalBytes: number): {
  canSave: boolean;
  availableBytes: number | null;
  message: string;
} {
  let canSave = true;
  let availableBytes: number | null = null;
  let message = '';

  if ('storage' in navigator && 'estimate' in navigator.storage) {
    // 同步检查不可用，返回乐观结果
    return {
      canSave: true,
      availableBytes: null,
      message: '',
    };
  }

  // 用 localStorage 长度估算
  try {
    const totalChars = Object.entries(localStorage).reduce(
      (sum, [k, v]) => sum + k.length + v.length,
      0
    );
    const usedBytes = totalChars * 2;
    const estimatedQuota = 5 * 1024 * 1024; // 5MB 估算
    availableBytes = estimatedQuota - usedBytes;
    canSave = availableBytes > additionalBytes;

    if (!canSave) {
      message = '存储空间即将不足，建议删除一些旧记录';
    }
  } catch {
    // ignore
  }

  return { canSave, availableBytes, message };
}

export { STORAGE_KEY };
