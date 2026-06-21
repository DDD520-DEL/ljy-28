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
  SortType,
  RecordVersion,
  ReminderSettings,
} from '@/types';
import { CATEGORY_LABELS } from '@/constants';
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
  STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  LIKED_STORAGE_KEY,
  CURRENT_USER_ID_KEY,
  CURRENT_USER_NAME_KEY,
  VERSIONS_STORAGE_KEY,
  REMINDER_SETTINGS_KEY,
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
  recordVersions: RecordVersion[];
  currentCategory: CategoryType | 'all' | 'favorites';
  searchKeyword: string;
  difficultyFilter: DifficultyType | 'all';
  favorites: string[];
  likedRecords: string[];
  currentUserId: string;
  currentUserName: string;
  communityCategory: CategoryType | 'all';
  communitySortBy: SortType;
  isLoaded: boolean;
  isSaving: boolean;
  user: User | null;
  syncStatus: SyncStatus;
  syncConflicts: SyncConflict[];
  lastSyncAt: string | null;
  pendingSyncDirection: 'upload' | 'download' | null;
  reminderSettings: ReminderSettings;

  init: () => void;
  addRecord: (record: Omit<BoxRecord, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'authorId' | 'authorName'>) => boolean;
  updateRecord: (id: string, record: Partial<BoxRecord>) => boolean;
  deleteRecord: (id: string) => void;
  batchDeleteRecords: (ids: string[]) => void;
  getRecordById: (id: string) => BoxRecord | undefined;
  addVersion: (recordId: string, snapshot: BoxRecord) => void;
  getVersionsByRecordId: (recordId: string) => RecordVersion[];
  restoreVersion: (versionId: string) => boolean;
  deleteVersionsByRecordId: (recordId: string) => void;
  setCategory: (category: CategoryType | 'all' | 'favorites') => void;
  setSearchKeyword: (keyword: string) => void;
  setDifficultyFilter: (difficulty: DifficultyType | 'all') => void;
  getFilteredRecords: () => BoxRecord[];
  getStats: () => StatsData;
  getTrendData: (range: TrendRangeType) => TrendData;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  setCommunityCategory: (category: CategoryType | 'all') => void;
  setCommunitySortBy: (sortBy: SortType) => void;
  getPublishedRecords: () => BoxRecord[];
  togglePublish: (id: string) => boolean;
  toggleLike: (id: string) => void;
  hasLiked: (id: string) => boolean;

  login: (name: string) => Promise<void>;
  logout: () => void;
  uploadToCloud: () => Promise<void>;
  downloadFromCloud: () => Promise<void>;
  resolveConflicts: (resolutions: Map<string, 'local' | 'cloud'>) => Promise<void>;
  clearConflicts: () => void;
  refreshSyncStatus: () => void;
  clearAllData: () => void;
  initReminderSettings: () => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  getReminderSettings: () => ReminderSettings;
  markReminderTriggered: () => void;
}

export const useBoxStore = create<BoxStore>((set, get) => ({
  records: [],
  recordVersions: [],
  currentCategory: 'all',
  searchKeyword: '',
  difficultyFilter: 'all',
  favorites: [],
  likedRecords: [],
  currentUserId: '',
  currentUserName: '',
  communityCategory: 'all',
  communitySortBy: 'latest',
  isLoaded: false,
  isSaving: false,
  user: null,
  syncStatus: 'idle',
  syncConflicts: [],
  lastSyncAt: null,
  pendingSyncDirection: null,
  reminderSettings: {
    enabled: false,
    weekdays: [],
    time: '09:00',
    lastTriggeredAt: null,
  },

  init: () => {
    const saved = loadFromStorage<BoxRecord[]>(STORAGE_KEY, []);
    const savedVersions = loadFromStorage<RecordVersion[]>(VERSIONS_STORAGE_KEY, []);
    const savedFavorites = loadFromStorage<string[]>(FAVORITES_STORAGE_KEY, []);
    const savedLiked = loadFromStorage<string[]>(LIKED_STORAGE_KEY, []);
    const savedUserId = loadFromStorage<string>(CURRENT_USER_ID_KEY, '');
    const savedUserName = loadFromStorage<string>(CURRENT_USER_NAME_KEY, '');
    const savedReminder = loadFromStorage<ReminderSettings | null>(REMINDER_SETTINGS_KEY, null);
    const user = getCurrentUser();
    const lastSyncAt = getLastSyncTime();
    
    const defaultReminder: ReminderSettings = {
      enabled: false,
      weekdays: [],
      time: '09:00',
      lastTriggeredAt: null,
    };

    let userId = savedUserId;
    let userName = savedUserName;
    if (!userId) {
      userId = generateId();
      userName = '纸箱创意家';
      saveToStorage(CURRENT_USER_ID_KEY, userId);
      saveToStorage(CURRENT_USER_NAME_KEY, userName);
    }

    if (saved.length === 0) {
      try {
        saveToStorage(STORAGE_KEY, MOCK_RECORDS);
        set({
          records: MOCK_RECORDS,
          recordVersions: savedVersions,
          favorites: savedFavorites,
          likedRecords: savedLiked,
          currentUserId: userId,
          currentUserName: userName,
          isLoaded: true,
          user,
          lastSyncAt,
          reminderSettings: savedReminder || defaultReminder,
        });
      } catch (e) {
        if (e instanceof StorageQuotaExceededError) {
          toast.warning('初始数据加载时存储空间不足，部分功能可能受限');
        }
        set({
          records: MOCK_RECORDS.slice(0, 3),
          recordVersions: savedVersions,
          favorites: savedFavorites,
          likedRecords: savedLiked,
          currentUserId: userId,
          currentUserName: userName,
          isLoaded: true,
          user,
          lastSyncAt,
          reminderSettings: savedReminder || defaultReminder,
        });
      }
    } else {
      const updatedRecords = saved.map(record => ({
        likes: record.likes ?? 0,
        likedBy: record.likedBy ?? [],
        authorId: record.authorId ?? userId,
        authorName: record.authorName ?? userName,
        ...record,
      }));
      set({
        records: updatedRecords,
        recordVersions: savedVersions,
        favorites: savedFavorites,
        likedRecords: savedLiked,
        currentUserId: userId,
        currentUserName: userName,
        isLoaded: true,
        user,
        lastSyncAt,
        reminderSettings: savedReminder || defaultReminder,
      });
    }
  },

  addRecord: (record) => {
    const now = new Date().toISOString();
    const { currentUserId, currentUserName } = get();
    const newRecord: BoxRecord = {
      ...record,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      isPublished: false,
      likes: 0,
      likedBy: [],
      authorId: currentUserId,
      authorName: currentUserName,
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
    const { records, addVersion } = get();
    const existingRecord = records.find((r) => r.id === id);
    
    if (existingRecord) {
      addVersion(id, existingRecord);
    }

    const newRecords = records.map((r) =>
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
    
    get().deleteVersionsByRecordId(id);
    
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

    ids.forEach((id) => get().deleteVersionsByRecordId(id));

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

  addVersion: (recordId, snapshot) => {
    const { recordVersions } = get();
    const newVersion: RecordVersion = {
      id: generateId(),
      recordId,
      snapshot: JSON.parse(JSON.stringify(snapshot)),
      savedAt: new Date().toISOString(),
    };
    const newVersions = [newVersion, ...recordVersions];
    try {
      saveToStorage(VERSIONS_STORAGE_KEY, newVersions);
      set({ recordVersions: newVersions });
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.warning('存储空间不足，无法保存此版本历史');
      }
    }
  },

  getVersionsByRecordId: (recordId) => {
    return get()
      .recordVersions
      .filter((v) => v.recordId === recordId)
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  },

  restoreVersion: (versionId) => {
    const { recordVersions, records } = get();
    const version = recordVersions.find((v) => v.id === versionId);
    if (!version) {
      toast.error('版本不存在');
      return false;
    }

    const existingRecord = records.find((r) => r.id === version.recordId);
    if (existingRecord) {
      get().addVersion(version.recordId, existingRecord);
    }

    const now = new Date().toISOString();
    const restoredRecord: BoxRecord = {
      ...version.snapshot,
      updatedAt: now,
    };

    const newRecords = records.map((r) =>
      r.id === version.recordId ? restoredRecord : r
    );

    try {
      saveToStorage(STORAGE_KEY, newRecords);
      set({ records: newRecords });
      toast.success('已恢复到所选版本');
      return true;
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error('存储空间不足，恢复失败');
      } else {
        toast.error('恢复失败，请重试');
      }
      return false;
    }
  },

  deleteVersionsByRecordId: (recordId) => {
    const newVersions = get().recordVersions.filter((v) => v.recordId !== recordId);
    try {
      saveToStorage(VERSIONS_STORAGE_KEY, newVersions);
      set({ recordVersions: newVersions });
    } catch {
      // 忽略删除版本时的存储错误
    }
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

  clearAllData: () => {
    const LAST_SYNC_KEY = 'box_creative_log_last_sync';
    const CLOUD_USER_KEY = 'box_creative_log_cloud_user';
    const CLOUD_STORAGE_KEY = 'box_creative_log_cloud';
    const USER_STORAGE_KEY = 'box_creative_log_user';
    const THEME_KEY = 'theme';

    const allKnownKeys = [
      STORAGE_KEY,
      FAVORITES_STORAGE_KEY,
      LIKED_STORAGE_KEY,
      CURRENT_USER_ID_KEY,
      CURRENT_USER_NAME_KEY,
      VERSIONS_STORAGE_KEY,
      LAST_SYNC_KEY,
      CLOUD_USER_KEY,
      CLOUD_STORAGE_KEY,
      USER_STORAGE_KEY,
    ];

    allKnownKeys.forEach((key) => removeFromStorage(key));

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('box_creative_log_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // ignore
    }

    localStorage.setItem(THEME_KEY, 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');

    set({
      records: [],
      recordVersions: [],
      favorites: [],
      likedRecords: [],
      currentUserId: '',
      currentUserName: '',
      user: null,
      syncConflicts: [],
      lastSyncAt: null,
      pendingSyncDirection: null,
      syncStatus: 'idle',
      isLoaded: true,
    });
  },

  refreshSyncStatus: () => {
    const user = getCurrentUser();
    const lastSyncAt = getLastSyncTime();
    set({ user, lastSyncAt });
  },

  setCommunityCategory: (category) => {
    set({ communityCategory: category });
  },

  setCommunitySortBy: (sortBy) => {
    set({ communitySortBy: sortBy });
  },

  getPublishedRecords: () => {
    const { records, communityCategory, communitySortBy } = get();
    let result = records.filter(r => r.isPublished);

    if (communityCategory !== 'all') {
      result = result.filter(r => r.category === communityCategory);
    }

    if (communitySortBy === 'popular') {
      result = [...result].sort((a, b) => b.likes - a.likes);
    } else {
      result = [...result].sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    }

    return result;
  },

  togglePublish: (id) => {
    const { records, currentUserId } = get();
    const record = records.find(r => r.id === id);
    
    if (!record) return false;
    if (record.authorId !== currentUserId) {
      toast.error('只能发布自己的记录');
      return false;
    }

    const now = new Date().toISOString();
    const newRecords = records.map(r =>
      r.id === id
        ? {
            ...r,
            isPublished: !r.isPublished,
            publishedAt: !r.isPublished ? now : r.publishedAt,
            updatedAt: now,
          }
        : r
    );

    try {
      saveToStorage(STORAGE_KEY, newRecords);
      set({ records: newRecords });
      const published = !record.isPublished;
      toast.success(published ? '已发布到社区广场' : '已从社区广场下架');
      return true;
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error('存储空间不足，操作失败');
      } else {
        toast.error('操作失败，请重试');
      }
      return false;
    }
  },

  toggleLike: (id) => {
    const { records, likedRecords, currentUserId } = get();
    const record = records.find(r => r.id === id);
    
    if (!record) return;

    const hasLiked = likedRecords.includes(id);
    let newLikedRecords: string[];
    let newLikes: number;
    let newLikedBy: string[];

    if (hasLiked) {
      newLikedRecords = likedRecords.filter(lid => lid !== id);
      newLikes = Math.max(0, record.likes - 1);
      newLikedBy = record.likedBy.filter(uid => uid !== currentUserId);
      toast.success('已取消点赞');
    } else {
      newLikedRecords = [...likedRecords, id];
      newLikes = record.likes + 1;
      newLikedBy = [...record.likedBy, currentUserId];
      toast.success('点赞成功！');
    }

    const newRecords = records.map(r =>
      r.id === id
        ? { ...r, likes: newLikes, likedBy: newLikedBy }
        : r
    );

    try {
      saveToStorage(STORAGE_KEY, newRecords);
      saveToStorage(LIKED_STORAGE_KEY, newLikedRecords);
      set({ records: newRecords, likedRecords: newLikedRecords });
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error('存储空间不足，点赞失败');
      } else {
        toast.error('点赞失败，请重试');
      }
    }
  },

  hasLiked: (id) => {
    return get().likedRecords.includes(id);
  },

  initReminderSettings: () => {
    const saved = loadFromStorage<ReminderSettings | null>(REMINDER_SETTINGS_KEY, null);
    if (saved) {
      set({ reminderSettings: saved });
    }
  },

  updateReminderSettings: (settings) => {
    const { reminderSettings } = get();
    const newSettings = { ...reminderSettings, ...settings };
    try {
      saveToStorage(REMINDER_SETTINGS_KEY, newSettings);
      set({ reminderSettings: newSettings });
      toast.success('提醒设置已保存');
    } catch (e) {
      if (e instanceof StorageQuotaExceededError) {
        toast.error('存储空间不足，保存失败');
      } else {
        toast.error('保存失败，请重试');
      }
    }
  },

  getReminderSettings: () => {
    return get().reminderSettings;
  },

  markReminderTriggered: () => {
    const { reminderSettings } = get();
    const newSettings = {
      ...reminderSettings,
      lastTriggeredAt: new Date().toISOString(),
    };
    try {
      saveToStorage(REMINDER_SETTINGS_KEY, newSettings);
      set({ reminderSettings: newSettings });
    } catch {
      set({ reminderSettings: newSettings });
    }
  },
}));
