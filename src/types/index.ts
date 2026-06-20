export type CategoryType = 'storage' | 'catHouse' | 'craft' | 'toy' | 'pot' | 'display' | 'other';

export type CompletenessType = 'perfect' | 'good' | 'fair' | 'poor';

export type DifficultyType = 'beginner' | 'intermediate' | 'expert';

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface BoxRecord {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  beforeImage: string;
  afterImage: string;
  boxLength: number;
  boxWidth: number;
  boxHeight: number;
  corrugateLayers: number;
  completeness: CompletenessType;
  expressSource: string;
  steps: string[];
  materials: MaterialItem[];
  difficulty: DifficultyType;
  createdAt: string;
  updatedAt: string;
  isPublished?: boolean;
  likes: number;
  likedBy: string[];
  authorId: string;
  authorName: string;
  publishedAt?: string;
}

export type SortType = 'latest' | 'popular';

export interface CommunityFilter {
  category: CategoryType | 'all';
  sortBy: SortType;
}

export interface CategoryInfo {
  key: CategoryType | 'all';
  label: string;
  icon: string;
  color: string;
}

export interface CompletenessInfo {
  key: CompletenessType;
  label: string;
  description: string;
}

export interface DifficultyInfo {
  key: DifficultyType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export interface StatsData {
  total: number;
  savedBoxes: number;
  categoryStats: Record<CategoryType, number>;
}

export type TrendRangeType = 'week' | 'month' | 'all';

export interface TrendCategoryData {
  category: CategoryType;
  label: string;
  count: number;
}

export interface TrendData {
  range: TrendRangeType;
  categories: TrendCategoryData[];
  maxCount: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'conflict';

export type SyncDirection = 'upload' | 'download';

export interface SyncConflict {
  id: string;
  local: BoxRecord;
  cloud: BoxRecord;
  localNewer: boolean;
}

export interface CloudSyncData {
  records: BoxRecord[];
  favorites: string[];
  lastSyncAt: string;
  userId: string;
}

export interface RecordVersion {
  id: string;
  recordId: string;
  snapshot: BoxRecord;
  savedAt: string;
}
