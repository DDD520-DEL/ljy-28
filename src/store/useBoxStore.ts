import { create } from 'zustand';
import type { BoxRecord, CategoryType, StatsData } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEY, generateId } from '@/utils';
import { MOCK_RECORDS } from '@/data/mockData';

interface BoxStore {
  records: BoxRecord[];
  currentCategory: CategoryType | 'all';
  isLoaded: boolean;
  
  init: () => void;
  addRecord: (record: Omit<BoxRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, record: Partial<BoxRecord>) => void;
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

  init: () => {
    const saved = loadFromStorage<BoxRecord[]>(STORAGE_KEY, []);
    if (saved.length === 0) {
      saveToStorage(STORAGE_KEY, MOCK_RECORDS);
      set({ records: MOCK_RECORDS, isLoaded: true });
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
    set({ records: newRecords });
    saveToStorage(STORAGE_KEY, newRecords);
  },

  updateRecord: (id, record) => {
    const newRecords = get().records.map((r) =>
      r.id === id
        ? { ...r, ...record, updatedAt: new Date().toISOString() }
        : r
    );
    set({ records: newRecords });
    saveToStorage(STORAGE_KEY, newRecords);
  },

  deleteRecord: (id) => {
    const newRecords = get().records.filter((r) => r.id !== id);
    set({ records: newRecords });
    saveToStorage(STORAGE_KEY, newRecords);
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
