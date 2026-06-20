import { create } from 'zustand';
import type {
  BoxRecord,
  CategoryType,
  DifficultyType,
  StatsData,
  TrendRangeType,
  TrendData,
  User,
  SyncStatus,
  SyncConflict,
} from '@/types';
import { CATEGORY_LABELS } from '@/constants';
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  generateId,
  StorageQuotaExceededError,
} from '@/utils';
import { MOCK_RECORDS } from '@/data/mockData';
import { toast } from '@/components/Toast';
import {
  getCurrentUser,
  loginUser as cloudLogin,
  logoutUser as cloudLogout,
  uploadToCloud,
  downloadFromCloud,
  getCloudData,
  findConflicts,
  mergeRecords,
  mergeFavorites,
  getLastSyncTime,
} from '@/services/cloudSync';

interface BoxStore {
  records: BoxRecord[];
  currentCategory: CategoryType | 'all' | 'favorites';
  searchKeyword: string;
  difficultyFilter: DifficultyType | 'all';
  favorites: string[];
  isLoaded: boolean;
  isSaving: boolean;
  user: User | null;
  syncStatus: SyncStatus;
  syncConflicts: SyncConflict[];
  lastSyncAt: string | null;
  pendingSyncDirection: 'upload' | 'download' | null;

  init: () => void;
  addRecord: (record: Omit<BoxRecord, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateRecord: (id: string, record: Partial<BoxRecord>) => boolean;
  deleteRecord: (id: string) => void;
  batchDeleteRecords: (ids: string[]) => void;
  getRecordById: (id: string) => BoxRecord | undefined;
  setCategory: (category: CategoryType | 'all' | 'favorites') => void;
  setSearchKeyword: (keyword: string) => void;
  setDifficultyFilter: (difficulty: DifficultyType | 'all') => void;
  getFilteredRecords: () => BoxRecord[];
  getStats: () => StatsData;
  getTrendData: (range: TrendRangeType) => TrendData;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  login: (name: string) => Promise<void>;
  logout: () => void;
  uploadToCloud: () => Promise<void>;
  downloadFromCloud: () => Promise<void>;
  resolveConflicts: (resolutions: Map<string, 'local' | 'cloud'>) => Promise<void>;
  clearConflicts: () => void;
  refreshSyncStatus: () => void;
}

export const useBoxStore = create<BoxStore>((set, get) => ({
  records: [],
  currentCategory: 'all',
  searchKeyword: '',
  difficultyFilter: 'all',
  favorites: [],
  isLoaded: false,
  isSaving: false,
  user: null,
  syncStatus: 'idle',
  syncConflicts: [],
  lastSyncAt: null,
  pendingSyncDirection: null,

  init: () => {
    const saved = loadFromStorage<BoxRecord[]>(STORAGE_KEY, []);
    const savedFavorites = loadFromStorage<string[]>(FAVORITES_STORAGE_KEY, []);
    const user = getCurrentUser();
    const lastSyncAt = getLastSyncTime();

    if (saved.length === 0) {
      try {
        saveToStorage(STORAGE_KEY, MOCK_RECORDS);
        set({
          records: MOCK_RECORDS,
          favorites: savedFavorites,
          isLoaded: true,
          user,
          lastSyncAt,
        });
      } catch (e) {
        if (e instanceof StorageQuotaExceededError) {
          toast.warning('初始数据加载时存储空间不足，部分功能可能受限');
        }
        set({
          records: MOCK_RECORDS.slice(0, 3),
          favorites: savedFavorites,
          isLoaded: true,
          user,
          lastSyncAt,
        });
      }
    } else {
      set({
        records: saved,
        favorites: savedFavorites,
        isLoaded: true,
        user,
        lastSyncAt,
      });
    }
  },

  addRecord: (record) => {
    const now = new Date().toISOString();
    const newRecord: BoxRecord = {
      ...record,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const newRecords = [newRecord, ...get().records];
    
    try {
      saveToStorage(STORAGE_KEY, newRecords);
      set({ records: newRecords });
      toast.success('记录保存成功！');
      return true;
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error(
          '存储空间不足！请删除一些旧记录，或尝试使用更小的图片',
          6000
        );
      } else {
        toast.error('保存失败，请重试');
      }
      return false;
    }
  },

  updateRecord: (id, record) => {
    const newRecords = get().records.map((r) =>
      r.id === id
        ? { ...r, ...record, updatedAt: new Date().toISOString() }
        : r
    );
    
    try {
      saveToStorage(STORAGE_KEY, newRecords);
      set({ records: newRecords });
      toast.success('记录更新成功！');
      return true;
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error(
          '存储空间不足！请删除一些旧记录，或尝试使用更小的图片',
          6000
        );
      } else {
        toast.error('保存失败，请重试');
      }
      return false;
    }
  },

  deleteRecord: (id) => {
    const newRecords = get().records.filter((r) => r.id !== id);
    const newFavorites = get().favorites.filter((fid) => fid !== id);
    
    try {
      saveToStorage(STORAGE_KEY, newRecords);
      saveToStorage(FAVORITES_STORAGE_KEY, newFavorites);
      set({ records: newRecords, favorites: newFavorites });
      toast.success('记录已删除');
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        // 删除操作应该不会触发存储空间不足，但以防万一
        set({ records: newRecords, favorites: newFavorites });
        toast.warning('记录已从列表移除，但存储更新异常');
      } else {
        toast.error('删除失败，请重试');
      }
    }
  },

  batchDeleteRecords: (ids) => {
    const idSet = new Set(ids);
    const newRecords = get().records.filter((r) => !idSet.has(r.id));
    const newFavorites = get().favorites.filter((fid) => !idSet.has(fid));

    try {
      saveToStorage(STORAGE_KEY, newRecords);
      saveToStorage(FAVORITES_STORAGE_KEY, newFavorites);
      set({ records: newRecords, favorites: newFavorites });
      toast.success(`已删除 ${ids.length} 条记录`);
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        set({ records: newRecords, favorites: newFavorites });
        toast.warning('记录已从列表移除，但存储更新异常');
      } else {
        toast.error('批量删除失败，请重试');
      }
    }
  },

  getRecordById: (id) => {
    return get().records.find((r) => r.id === id);
  },

  setCategory: (category) => {
    set({ currentCategory: category });
  },

  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword });
  },

  setDifficultyFilter: (difficulty) => {
    set({ difficultyFilter: difficulty });
  },

  getFilteredRecords: () => {
    const { records, currentCategory, searchKeyword, difficultyFilter, favorites } = get();
    let result = records;

    if (currentCategory === 'favorites') {
      result = result.filter((r) => favorites.includes(r.id));
    } else if (currentCategory !== 'all') {
      result = result.filter((r) => r.category === currentCategory);
    }

    if (difficultyFilter !== 'all') {
      result = result.filter((r) => r.difficulty === difficultyFilter);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword) ||
          r.description.toLowerCase().includes(keyword)
      );
    }

    return result;
  },

  toggleFavorite: (id) => {
    const { favorites } = get();
    const isFav = favorites.includes(id);
    let newFavorites: string[];
    if (isFav) {
      newFavorites = favorites.filter((fid) => fid !== id);
      toast.success('已取消收藏');
    } else {
      newFavorites = [...favorites, id];
      toast.success('已收藏');
    }
    try {
      saveToStorage(FAVORITES_STORAGE_KEY, newFavorites);
      set({ favorites: newFavorites });
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error('存储空间不足，收藏失败');
      } else {
        toast.error('收藏失败，请重试');
      }
    }
  },

  isFavorite: (id) => {
    return get().favorites.includes(id);
  },

  getStats: () => {
    const { records } = get();
    const categoryStats = {} as Record<CategoryType, number>;
    
    const categories: CategoryType[] = ['storage', 'catHouse', 'craft', 'toy', 'pot', 'display', 'other'];
    categories.forEach(cat => {
      categoryStats[cat] = 0;
    });

    records.forEach(r => {
      categoryStats[r.category] = (categoryStats[r.category] || 0) + 1;
    });

    return {
      total: records.length,
      savedBoxes: records.length,
      categoryStats,
    };
  },

  getTrendData: (range: TrendRangeType): TrendData => {
    const { records } = get();
    const now = new Date();
    let startDate: Date | null = null;

    if (range === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === 'month') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
    }

    const filteredRecords = startDate
      ? records.filter(r => new Date(r.createdAt) >= startDate)
      : records;

    const categoryCounts: Record<CategoryType, number> = {
      storage: 0,
      catHouse: 0,
      craft: 0,
      toy: 0,
      pot: 0,
      display: 0,
      other: 0,
    };

    filteredRecords.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    const categories: CategoryType[] = ['storage', 'catHouse', 'craft', 'toy', 'pot', 'display', 'other'];
    const trendCategories = categories.map(cat => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      count: categoryCounts[cat],
    }));

    const maxCount = Math.max(...trendCategories.map(c => c.count), 1);
    const total = filteredRecords.length;

    return {
      range,
      categories: trendCategories,
      maxCount,
      total,
    };
  },

  login: async (name: string) => {
    try {
      set({ syncStatus: 'syncing' });
      const user = await cloudLogin(name);
      const lastSyncAt = getLastSyncTime();
      set({ user, lastSyncAt, syncStatus: 'idle' });
      toast.success(`欢迎，${user.name}！`);
    } catch (e) {
      set({ syncStatus: 'error' });
      toast.error('登录失败，请重试');
      throw e;
    }
  },

  logout: () => {
    cloudLogout();
    set({ user: null, lastSyncAt: null, syncStatus: 'idle', syncConflicts: [] });
    toast.info('已退出登录');
  },

  uploadToCloud: async () => {
    const { user, records, favorites } = get();
    if (!user) {
      toast.warning('请先登录');
      return;
    }

    try {
      set({ syncStatus: 'syncing' });

      const cloudData = await getCloudData(user.id);
      if (cloudData && cloudData.records.length > 0) {
        const conflicts = findConflicts(records, cloudData.records);
        if (conflicts.length > 0) {
          set({
            syncConflicts: conflicts,
            syncStatus: 'conflict',
            pendingSyncDirection: 'upload',
          });
          toast.warning(`发现 ${conflicts.length} 条冲突记录，请选择保留版本`);
          return;
        }
      }

      const result = await uploadToCloud(records, favorites, user.id);
      set({ syncStatus: 'success', lastSyncAt: result.lastSyncAt });
      toast.success('数据已同步到云端');

      setTimeout(() => {
        set({ syncStatus: 'idle' });
      }, 2000);
    } catch (e) {
      set({ syncStatus: 'error' });
      toast.error(e instanceof Error ? e.message : '上传失败');
      setTimeout(() => {
        set({ syncStatus: 'idle' });
      }, 2000);
    }
  },

  downloadFromCloud: async () => {
    const { user, records, favorites } = get();
    if (!user) {
      toast.warning('请先登录');
      return;
    }

    try {
      set({ syncStatus: 'syncing' });

      const cloudData = await getCloudData(user.id);
      if (!cloudData || cloudData.records.length === 0) {
        set({ syncStatus: 'idle' });
        toast.info('云端暂无数据');
        return;
      }

      const conflicts = findConflicts(records, cloudData.records);
      if (conflicts.length > 0) {
        set({
          syncConflicts: conflicts,
          syncStatus: 'conflict',
          pendingSyncDirection: 'download',
        });
        toast.warning(`发现 ${conflicts.length} 条冲突记录，请选择保留版本`);
        return;
      }

      const mergedRecords = mergeRecords(records, cloudData.records, new Map());
      const allIds = mergedRecords.map((r) => r.id);
      const mergedFavorites = mergeFavorites(favorites, cloudData.favorites, allIds);

      saveToStorage(STORAGE_KEY, mergedRecords);
      saveToStorage(FAVORITES_STORAGE_KEY, mergedFavorites);

      set({
        records: mergedRecords,
        favorites: mergedFavorites,
        lastSyncAt: cloudData.lastSyncAt,
        syncStatus: 'success',
      });
      toast.success('已从云端拉取数据');

      setTimeout(() => {
        set({ syncStatus: 'idle' });
      }, 2000);
    } catch (e) {
      set({ syncStatus: 'error' });
      toast.error(e instanceof Error ? e.message : '拉取失败');
      setTimeout(() => {
        set({ syncStatus: 'idle' });
      }, 2000);
    }
  },

  resolveConflicts: async (resolutions: Map<string, 'local' | 'cloud'>) => {
    const { user, records, favorites, pendingSyncDirection } = get();
    if (!user) return;

    try {
      set({ syncStatus: 'syncing' });

      const cloudData = await getCloudData(user.id);
      if (!cloudData) {
        throw new Error('云端数据不存在');
      }

      const mergedRecords = mergeRecords(records, cloudData.records, resolutions);
      const allIds = mergedRecords.map((r) => r.id);
      const mergedFavorites = mergeFavorites(favorites, cloudData.favorites, allIds);

      if (pendingSyncDirection === 'upload') {
        const result = await uploadToCloud(mergedRecords, mergedFavorites, user.id);
        saveToStorage(STORAGE_KEY, mergedRecords);
        saveToStorage(FAVORITES_STORAGE_KEY, mergedFavorites);
        set({
          records: mergedRecords,
          favorites: mergedFavorites,
          syncConflicts: [],
          pendingSyncDirection: null,
          syncStatus: 'success',
          lastSyncAt: result.lastSyncAt,
        });
        toast.success('数据已同步到云端');
      } else {
        saveToStorage(STORAGE_KEY, mergedRecords);
        saveToStorage(FAVORITES_STORAGE_KEY, mergedFavorites);
        set({
          records: mergedRecords,
          favorites: mergedFavorites,
          syncConflicts: [],
          pendingSyncDirection: null,
          syncStatus: 'success',
          lastSyncAt: cloudData.lastSyncAt,
        });
        toast.success('已从云端拉取数据');
      }

      setTimeout(() => {
        set({ syncStatus: 'idle' });
      }, 2000);
    } catch (e) {
      set({ syncStatus: 'error' });
      toast.error(e instanceof Error ? e.message : '同步失败');
      setTimeout(() => {
        set({ syncStatus: 'idle' });
      }, 2000);
    }
  },

  clearConflicts: () => {
    set({ syncConflicts: [], pendingSyncDirection: null, syncStatus: 'idle' });
  },

  refreshSyncStatus: () => {
    const user = getCurrentUser();
    const lastSyncAt = getLastSyncTime();
    set({ user, lastSyncAt });
  },
}));
