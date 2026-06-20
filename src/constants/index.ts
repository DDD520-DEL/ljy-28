import type { CategoryInfo, CompletenessInfo, CategoryType } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  { key: 'all', label: '全部', icon: 'Grid3x3', color: 'kraft' },
  { key: 'storage', label: '收纳盒', icon: 'Archive', color: 'kraft' },
  { key: 'catHouse', label: '猫窝', icon: 'Cat', color: 'forest' },
  { key: 'craft', label: '手工材料', icon: 'Scissors', color: 'kraft' },
  { key: 'toy', label: '玩具', icon: 'Puzzle', color: 'forest' },
  { key: 'pot', label: '花盆种植', icon: 'Flower2', color: 'forest' },
  { key: 'display', label: '展示架', icon: 'LayoutGrid', color: 'kraft' },
  { key: 'other', label: '其他创意', icon: 'Lightbulb', color: 'kraft' },
];

export const COMPLETENESS_OPTIONS: CompletenessInfo[] = [
  { key: 'perfect', label: '完好无损', description: '纸箱棱角分明，没有折痕' },
  { key: 'good', label: '轻微折痕', description: '有轻微压痕，不影响使用' },
  { key: 'fair', label: '有破损但可用', description: '局部破损，裁剪后可用' },
  { key: 'poor', label: '破损较严重', description: '破损较多，只能做小物件' },
];

export const CORRUGATE_LAYERS = [3, 5, 7];

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  storage: '收纳盒',
  catHouse: '猫窝',
  craft: '手工材料',
  toy: '玩具',
  pot: '花盆种植',
  display: '展示架',
  other: '其他创意',
};

export const COMPLETENESS_LABELS: Record<string, string> = {
  perfect: '完好无损',
  good: '轻微折痕',
  fair: '有破损但可用',
  poor: '破损较严重',
};
