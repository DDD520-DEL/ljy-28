import { create } from 'zustand';
import type { BoxRecord, CategoryType, StatsData } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEY, generateId, StorageQuotaExceededError } from '@/utils';
import { MOCK_RECORDS } from '@/data/mockData';
import { toast } from '@/components/Toast';

interface BoxStore {
  records: BoxRecord[];
  currentCategory: CategoryType | 'all';
  isLoaded: boolean;
  isSaving: boolean;
  
  init: () => void;
  addRecord: (record: Omit<BoxRecord, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateRecord: (id: string, record: Partial<BoxRecord>) => boolean;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => BoxRecord | undefined;
  setCategory: (category: CategoryType | 'all') => void;
  getFilteredRecords: () => BoxRecord[];
  getStats: () => StatsData;
}

export const useBoxStore = create<BoxStore>((set, get) => ({
  records: [],
  currentCategory: 'all',
  isLoaded: false,
  isSaving: false,

  init: () => {
    const saved = loadFromStorage<BoxRecord[]>(STORAGE_KEY, []);
    if (saved.length === 0) {
      try {
        saveToStorage(STORAGE_KEY, MOCK_RECORDS);
        set({ records: MOCK_RECORDS, isLoaded: true });
      } catch (e) {
        if (e instanceof StorageQuotaExceededError) {
          toast.warning('初始数据加载时存储空间不足，部分功能可能受限');
        }
        set({ records: MOCK_RECORDS.slice(0, 3), isLoaded: true });
      }
    } else {
      set({ records: saved, isLoaded: true });
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
    
    try {
      saveToStorage(STORAGE_KEY, newRecords);
      set({ records: newRecords });
      toast.success('记录已删除');
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        // 删除操作应该不会触发存储空间不足，但以防万一
        set({ records: newRecords });
        toast.warning('记录已从列表移除，但存储更新异常');
      } else {
        toast.error('删除失败，请重试');
      }
    }
  },

  getRecordById: (id) => {
    return get().records.find((r) => r.id === id);
  },

  setCategory: (category) => {
    set({ currentCategory: category });
  },

  getFilteredRecords: () => {
    const { records, currentCategory } = get();
    if (currentCategory === 'all') return records;
    return records.filter((r) => r.category === currentCategory);
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
}));
