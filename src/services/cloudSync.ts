import type { BoxRecord, CloudSyncData, SyncConflict, User } from '@/types';

const CLOUD_STORAGE_KEY = 'box_creative_log_cloud';
const USER_STORAGE_KEY = 'box_creative_log_user';
const LAST_SYNC_KEY = 'box_creative_log_last_sync';

const SIMULATED_DELAY = 800;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginUser(name: string): Promise<User> {
  await delay(SIMULATED_DELAY);
  const user: User = {
    id: 'user_' + Date.now().toString(36),
    name,
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getLastSyncTime(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

export async function uploadToCloud(
  records: BoxRecord[],
  favorites: string[],
  userId: string
): Promise<{ success: boolean; lastSyncAt: string }> {
  await delay(SIMULATED_DELAY);

  try {
    const cloudData: CloudSyncData = {
      records,
      favorites,
      lastSyncAt: new Date().toISOString(),
      userId,
    };
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(cloudData));
    localStorage.setItem(LAST_SYNC_KEY, cloudData.lastSyncAt);
    return { success: true, lastSyncAt: cloudData.lastSyncAt };
  } catch (e) {
    console.error('Upload to cloud failed:', e);
    throw new Error('上传到云端失败，请稍后重试');
  }
}

export async function downloadFromCloud(
  userId: string
): Promise<{ records: BoxRecord[]; favorites: string[]; lastSyncAt: string }> {
  await delay(SIMULATED_DELAY);

  try {
    const cloudStr = localStorage.getItem(CLOUD_STORAGE_KEY);
    if (!cloudStr) {
      return { records: [], favorites: [], lastSyncAt: '' };
    }
    const cloudData = JSON.parse(cloudStr) as CloudSyncData;
    if (cloudData.userId !== userId) {
      throw new Error('用户不匹配');
    }
    localStorage.setItem(LAST_SYNC_KEY, cloudData.lastSyncAt);
    return {
      records: cloudData.records,
      favorites: cloudData.favorites,
      lastSyncAt: cloudData.lastSyncAt,
    };
  } catch (e) {
    console.error('Download from cloud failed:', e);
    throw new Error('从云端拉取失败，请稍后重试');
  }
}

export async function getCloudData(
  userId: string
): Promise<{ records: BoxRecord[]; favorites: string[]; lastSyncAt: string } | null> {
  await delay(SIMULATED_DELAY / 2);

  try {
    const cloudStr = localStorage.getItem(CLOUD_STORAGE_KEY);
    if (!cloudStr) {
      return null;
    }
    const cloudData = JSON.parse(cloudStr) as CloudSyncData;
    if (cloudData.userId !== userId) {
      return null;
    }
    return {
      records: cloudData.records,
      favorites: cloudData.favorites,
      lastSyncAt: cloudData.lastSyncAt,
    };
  } catch {
    return null;
  }
}

export function findConflicts(
  localRecords: BoxRecord[],
  cloudRecords: BoxRecord[]
): SyncConflict[] {
  const conflicts: SyncConflict[] = [];
  const cloudMap = new Map(cloudRecords.map((r) => [r.id, r]));

  for (const local of localRecords) {
    const cloud = cloudMap.get(local.id);
    if (cloud && cloud.updatedAt !== local.updatedAt) {
      const localTime = new Date(local.updatedAt).getTime();
      const cloudTime = new Date(cloud.updatedAt).getTime();
      conflicts.push({
        id: local.id,
        local,
        cloud,
        localNewer: localTime > cloudTime,
      });
    }
  }

  return conflicts;
}

export function mergeRecords(
  localRecords: BoxRecord[],
  cloudRecords: BoxRecord[],
  conflictResolutions: Map<string, 'local' | 'cloud'>
): BoxRecord[] {
  const merged = new Map<string, BoxRecord>();

  for (const record of cloudRecords) {
    merged.set(record.id, record);
  }

  for (const record of localRecords) {
    const existing = merged.get(record.id);
    if (!existing) {
      merged.set(record.id, record);
    } else {
      const resolution = conflictResolutions.get(record.id);
      if (resolution === 'local') {
        merged.set(record.id, record);
      }
    }
  }

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function mergeFavorites(
  localFavorites: string[],
  cloudFavorites: string[],
  allRecordIds: string[]
): string[] {
  const merged = new Set([...localFavorites, ...cloudFavorites]);
  return Array.from(merged).filter((id) => allRecordIds.includes(id));
}
