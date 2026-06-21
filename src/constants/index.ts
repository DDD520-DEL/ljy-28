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

export const WEEKDAY_LABELS: Record<number, string> = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
};

export const WEEKDAY_OPTIONS = [
  { key: 1, label: '周一' },
  { key: 2, label: '周二' },
  { key: 3, label: '周三' },
  { key: 4, label: '周四' },
  { key: 5, label: '周五' },
  { key: 6, label: '周六' },
  { key: 0, label: '周日' },
];

export const CREATIVE_IDEAS = [
  '用快递纸箱做一个复古风格的收纳盒，贴上旧邮票当装饰！',
  '试试把纸箱改造成猫咪隧道，加几个小洞让猫咪更有探索欲。',
  '用瓦楞纸一层层粘起来做一个耐用的猫抓板，比买的还好用。',
  '把小纸箱裁成方形格，做成抽屉式内衣收纳，整洁又环保。',
  '用大纸箱给孩子做一个小城堡，刻上门窗让他们尽情玩耍。',
  '快递盒裁一裁，套在塑料花盆外面，立刻有了田园风。',
  '试试用纸箱做一个手账素材收纳册，贴上好看的包装纸。',
  '把几个纸箱拼在墙上做展示架，放小摆件超有设计感。',
  '用纸箱边角料做一套桌面文具收纳，笔筒、便签盒都能做。',
  '把纸箱裁成条状，编织成一个美观的收纳篮。',
  '用厚纸箱做一个简易的宠物食盆架，保护宠物颈椎。',
  '试试把纸箱改造成绘本收纳架，让孩子的书有个温馨的家。',
  '快递纸箱剪成格子，做一个衣柜抽屉分隔板，收纳袜子超方便。',
  '用纸箱做一个复古风相框，贴上旧照片，别有风味。',
  '把纸箱做成鞋架，每层放两双鞋，门口再也不乱了。',
  '试试用瓦楞纸做一个手机支架，追剧再也不用手举着。',
  '用大纸箱做一个儿童玩具收纳箱，贴上卡通贴纸，孩子超喜欢。',
  '快递盒改造成文件盒，给每个盒子贴上标签，办公更高效。',
  '把纸箱裁成圆形，一层层粘起来做一个创意小凳子。',
  '用纸箱做一个壁挂式收纳袋，挂在门后收纳小物件。',
  '试试用纸箱做一个迷你温室，给小绿植保暖保湿。',
  '把纸箱剪成各种形状，让孩子涂色做手工，乐趣无穷。',
  '用厚纸箱做一个厨房调料架，瓶瓶罐罐都能整齐摆放。',
  '快递盒改造一下，变成漂亮的礼品包装盒，送礼更有心意。',
  '用纸箱做一个简易书架，靠墙摆放，小户型的福音。',
  '试试把纸箱改造成宠物窝，铺上软垫子，毛孩子会很喜欢。',
  '用纸箱边角料做一套杯垫，涂上防水漆，实用又好看。',
  '把纸箱做成杂志架，放在沙发旁，随手就能取阅。',
  '用纸箱做一个键盘手托，打游戏更舒服。',
  '试试用纸箱做一个投影仪支架，在家也能享受大屏电影。',
];
