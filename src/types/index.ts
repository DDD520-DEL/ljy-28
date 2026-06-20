export type CategoryType = 'storage' | 'catHouse' | 'craft' | 'toy' | 'pot' | 'display' | 'other';

export type CompletenessType = 'perfect' | 'good' | 'fair' | 'poor';

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
  createdAt: string;
  updatedAt: string;
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

export interface StatsData {
  total: number;
  savedBoxes: number;
  categoryStats: Record<CategoryType, number>;
}
