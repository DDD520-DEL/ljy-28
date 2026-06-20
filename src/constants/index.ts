import type { CategoryInfo, CompletenessInfo, DifficultyInfo, CategoryType, DifficultyType, BadgeDefinition } from '@/types';

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

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'record_1', name: '初出茅庐', description: '创建第1条改造记录', icon: '📝', category: 'records', condition: 'totalRecords >= 1', tier: 'bronze' },
  { id: 'record_5', name: '小有成就', description: '累计创建5条改造记录', icon: '📦', category: 'records', condition: 'totalRecords >= 5', tier: 'bronze' },
  { id: 'record_10', name: '改造达人', description: '累计创建10条改造记录', icon: '🎯', category: 'records', condition: 'totalRecords >= 10', tier: 'silver' },
  { id: 'record_25', name: '纸箱大师', description: '累计创建25条改造记录', icon: '🏠', category: 'records', condition: 'totalRecords >= 25', tier: 'gold' },
  { id: 'record_50', name: '传奇匠人', description: '累计创建50条改造记录', icon: '👑', category: 'records', condition: 'totalRecords >= 50', tier: 'diamond' },
  { id: 'cat_2', name: '初探新路', description: '覆盖2种不同分类', icon: '🔀', category: 'categories', condition: 'categoriesCovered >= 2', tier: 'bronze' },
  { id: 'cat_4', name: '多面手', description: '覆盖4种不同分类', icon: '🎨', category: 'categories', condition: 'categoriesCovered >= 4', tier: 'silver' },
  { id: 'cat_6', name: '全能工匠', description: '覆盖6种不同分类', icon: '🌟', category: 'categories', condition: 'categoriesCovered >= 6', tier: 'gold' },
  { id: 'cat_all', name: '创意百科', description: '覆盖全部7种分类', icon: '💎', category: 'categories', condition: 'categoriesCovered >= 7', tier: 'diamond' },
  { id: 'diff_beginner', name: '入门新手', description: '完成1个入门难度项目', icon: '🌱', category: 'tools', condition: 'beginnerCount >= 1', tier: 'bronze' },
  { id: 'diff_intermediate', name: '技艺精进', description: '完成1个进阶难度项目', icon: '🔧', category: 'tools', condition: 'intermediateCount >= 1', tier: 'silver' },
  { id: 'diff_expert', name: '登峰造极', description: '完成1个达人难度项目', icon: '🏆', category: 'tools', condition: 'expertCount >= 1', tier: 'gold' },
  { id: 'diff_all', name: '全能挑战者', description: '完成所有难度等级的项目', icon: '⚔️', category: 'tools', condition: 'allDifficulties >= 3', tier: 'diamond' },
  { id: 'mat_5', name: '材料新手', description: '使用过5种不同材料', icon: '🧵', category: 'materials', condition: 'uniqueMaterials >= 5', tier: 'bronze' },
  { id: 'mat_15', name: '材料达人', description: '使用过15种不同材料', icon: '🧶', category: 'materials', condition: 'uniqueMaterials >= 15', tier: 'silver' },
  { id: 'mat_30', name: '材料收藏家', description: '使用过30种不同材料', icon: '🏺', category: 'materials', condition: 'uniqueMaterials >= 30', tier: 'gold' },
  { id: 'fav_first', name: '心动收藏', description: '收藏第1个作品', icon: '❤️', category: 'features', condition: 'favoriteCount >= 1', tier: 'bronze' },
  { id: 'fav_5', name: '精选集', description: '收藏5个作品', icon: '⭐', category: 'features', condition: 'favoriteCount >= 5', tier: 'silver' },
  { id: 'pub_first', name: '社区新星', description: '首次发布作品到社区', icon: '🚀', category: 'features', condition: 'publishedCount >= 1', tier: 'silver' },
  { id: 'pub_5', name: '社区红人', description: '发布5个作品到社区', icon: '📢', category: 'features', condition: 'publishedCount >= 5', tier: 'gold' },
];

export const BADGE_TIER_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string; glowColor: string }> = {
  bronze: { label: '铜', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', glowColor: 'shadow-amber-200/50' },
  silver: { label: '银', color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-200', glowColor: 'shadow-slate-300/50' },
  gold: { label: '金', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', glowColor: 'shadow-yellow-200/50' },
  diamond: { label: '钻石', color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', glowColor: 'shadow-cyan-200/50' },
};

export const BADGE_CATEGORY_LABELS: Record<string, string> = {
  records: '记录里程碑',
  categories: '分类探索',
  tools: '难度挑战',
  materials: '材料收集',
  features: '功能使用',
};
