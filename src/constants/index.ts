import type { CategoryInfo, CompletenessInfo, DifficultyInfo, CategoryType, DifficultyType } from '@/types';

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

export const DIFFICULTY_OPTIONS: DifficultyInfo[] = [
  { key: 'beginner', label: '入门', description: '简单易上手，适合新手', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', icon: '🌱' },
  { key: 'intermediate', label: '进阶', description: '需要一定动手能力', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', icon: '🔧' },
  { key: 'expert', label: '达人', description: '高难度，需要丰富经验', color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', icon: '🏆' },
];

export const DIFFICULTY_LABELS: Record<DifficultyType, string> = {
  beginner: '入门',
  intermediate: '进阶',
  expert: '达人',
};

export const DIFFICULTY_ICONS: Record<DifficultyType, string> = {
  beginner: '🌱',
  intermediate: '🔧',
  expert: '🏆',
};
