import type { BoxRecord } from '@/types';

function createBoxSVG(text: string, bgColor: string, textColor: string, pattern: 'box' | 'cat' | 'box-decorated' = 'box'): string {
  const w = 400;
  const h = 300;
  
  let decorSvg = '';
  
  if (pattern === 'cat') {
    decorSvg = `
      <ellipse cx="${w/2}" cy="${h/2 + 20}" rx="60" ry="50" fill="${textColor}" opacity="0.2"/>
      <circle cx="${w/2 - 30}" cy="${h/2 - 20}" r="8" fill="${textColor}" opacity="0.3"/>
      <circle cx="${w/2 + 30}" cy="${h/2 - 20}" r="8" fill="${textColor}" opacity="0.3"/>
      <path d="M${w/2 - 15} ${h/2 + 10} Q${w/2} ${h/2 + 20} ${w/2 + 15} ${h/2 + 10}" stroke="${textColor}" stroke-width="2" fill="none" opacity="0.3"/>
    `;
  } else if (pattern === 'box-decorated') {
    decorSvg = `
      <rect x="${w/2 - 60}" y="${h/2 - 40}" width="120" height="80" rx="4" fill="none" stroke="${textColor}" stroke-width="2" opacity="0.3"/>
      <line x1="${w/2}" y1="${h/2 - 40}" x2="${w/2}" y2="${h/2 + 40}" stroke="${textColor}" stroke-width="2" opacity="0.3"/>
      <circle cx="${w/2 - 30}" cy="${h/2 - 10}" r="12" fill="${textColor}" opacity="0.15"/>
      <circle cx="${w/2 + 30}" cy="${h/2 + 10}" r="12" fill="${textColor}" opacity="0.15"/>
    `;
  } else {
    decorSvg = `
      <rect x="${w/2 - 70}" y="${h/2 - 50}" width="140" height="100" rx="4" fill="none" stroke="${textColor}" stroke-width="2" opacity="0.3"/>
      <line x1="${w/2}" y1="${h/2 - 50}" x2="${w/2}" y2="${h/2 + 50}" stroke="${textColor}" stroke-width="1.5" opacity="0.2"/>
      <line x1="${w/2 - 70}" y1="${h/2}" x2="${w/2 + 70}" y2="${h/2}" stroke="${textColor}" stroke-width="1.5" opacity="0.2"/>
      <path d="M${w/2 - 20} ${h/2 - 50} L${w/2 - 20} ${h/2 - 70} L${w/2 + 20} ${h/2 - 70} L${w/2 + 20} ${h/2 - 50}" fill="none" stroke="${textColor}" stroke-width="2" opacity="0.3"/>
    `;
  }
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="${w}" height="${h}" fill="${bgColor}"/>
      <rect x="20" y="20" width="${w-40}" height="${h-40}" rx="8" fill="none" stroke="${textColor}" stroke-width="1" opacity="0.1"/>
      ${decorSvg}
      <text x="${w/2}" y="${h - 40}" text-anchor="middle" font-family="'Noto Sans SC', sans-serif" font-size="18" font-weight="500" fill="${textColor}" opacity="0.8">${text}</text>
    </svg>
  `;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

const now = new Date();

function daysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const MOCK_RECORDS: BoxRecord[] = [
  {
    id: 'mock-1',
    name: '桌面文件收纳盒',
    category: 'storage',
    description: '用顺丰的大号纸箱改造的三层文件收纳盒，放桌面刚好合适，贴上牛皮纸胶带后质感满满。',
    beforeImage: createBoxSVG('改造前 · 快递纸箱', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 收纳盒', '#D9CCB8', '#6B4523', 'box-decorated'),
    boxLength: 40,
    boxWidth: 30,
    boxHeight: 25,
    corrugateLayers: 5,
    completeness: 'good',
    expressSource: '顺丰速运',
    steps: [
      '测量纸箱尺寸，规划三层分隔结构',
      '裁剪多余的纸板，制作分隔板',
      '用白乳胶将分隔板固定在箱体内',
      '外侧贴上牛皮纸胶带，增加质感',
      '底部加上硬纸板加固，承重更好'
    ],
    materials: [
      { name: '牛皮纸胶带', quantity: 2, unit: '卷' },
      { name: '白乳胶', quantity: 1, unit: '瓶' },
      { name: '硬纸板', quantity: 3, unit: '块' },
    ],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'mock-2',
    name: '猫咪隧道猫窝',
    category: 'catHouse',
    description: '两个中型纸箱拼接成的隧道猫窝，猫咪超喜欢钻来钻去！铺上旧毛衣当垫子，冬暖夏凉。',
    beforeImage: createBoxSVG('改造前 · 两个纸箱', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 猫窝', '#DCE8C8', '#527019', 'cat'),
    boxLength: 50,
    boxWidth: 40,
    boxHeight: 35,
    corrugateLayers: 5,
    completeness: 'perfect',
    expressSource: '京东物流',
    steps: [
      '准备两个相同尺寸的中型纸箱',
      '在纸箱侧面开两个圆形出入口',
      '用胶带将两个纸箱连接起来',
      '内部铺上旧毛巾或毛衣增加舒适度',
      '顶部可以开个天窗，猫咪更爱钻'
    ],
    materials: [
      { name: '宽胶带', quantity: 1, unit: '卷' },
      { name: '旧毛衣', quantity: 1, unit: '件' },
    ],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'mock-3',
    name: '多肉植物小花盆',
    category: 'pot',
    description: '用纸箱边角料做的小花盆套，套在塑料花盆外面，瞬间有了自然田园风。',
    beforeImage: createBoxSVG('改造前 · 边角料', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 花盆', '#BFD69A', '#3D5213', 'box-decorated'),
    boxLength: 20,
    boxWidth: 20,
    boxHeight: 15,
    corrugateLayers: 3,
    completeness: 'fair',
    expressSource: '中通快递',
    steps: [
      '裁剪纸箱底部作为花盆基底',
      '裁成长条状围成圆柱形',
      '用麻绳缠绕固定，增添自然感',
      '底部垫上塑料布防止漏水',
      '放入小多肉，完美！'
    ],
    materials: [
      { name: '麻绳', quantity: 3, unit: '米' },
      { name: '塑料布', quantity: 1, unit: '块' },
    ],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    id: 'mock-4',
    name: '手账素材收纳册',
    category: 'craft',
    description: '用瓦楞纸做封面的手账素材收纳册，可以放贴纸、便签、胶带，是手工爱好者的好帮手。',
    beforeImage: createBoxSVG('改造前 · 硬纸板', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 收纳册', '#FDF8F3', '#6B4523', 'box-decorated'),
    boxLength: 25,
    boxWidth: 18,
    boxHeight: 5,
    corrugateLayers: 3,
    completeness: 'good',
    expressSource: '圆通速递',
    steps: [
      '裁剪两块相同大小的硬纸板做封面',
      '用旧布料或包装纸包裹封面',
      '中间用松紧带或活页环连接',
      '内部贴上分类标签',
      '放入各种手账素材'
    ],
    materials: [
      { name: '松紧带', quantity: 2, unit: '条' },
      { name: '包装纸', quantity: 2, unit: '张' },
      { name: '分类标签', quantity: 5, unit: '个' },
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    id: 'mock-5',
    name: '墙面展示置物架',
    category: 'display',
    description: '用几个纸箱裁剪后拼在墙上的置物架，可以放小摆件和香薰，省钱又有设计感。',
    beforeImage: createBoxSVG('改造前 · 小纸箱', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 展示架', '#D9CCB8', '#4A2F18', 'box-decorated'),
    boxLength: 30,
    boxWidth: 20,
    boxHeight: 15,
    corrugateLayers: 5,
    completeness: 'perfect',
    expressSource: '菜鸟驿站',
    steps: [
      '准备几个大小一致的小纸箱',
      '裁掉纸箱的一面，保留五个面',
      '内部用硬纸板加固承重',
      '用乳胶漆或壁纸美化表面',
      '用无痕钉固定在墙上'
    ],
    materials: [
      { name: '乳胶漆', quantity: 1, unit: '罐' },
      { name: '无痕钉', quantity: 4, unit: '个' },
    ],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
  {
    id: 'mock-6',
    name: '儿童纸箱小城堡',
    category: 'toy',
    description: '用大纸箱给孩子做的小城堡玩具，有门有窗还有小旗子，孩子可以钻进钻出玩半天。',
    beforeImage: createBoxSVG('改造前 · 大纸箱', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 小城堡', '#FDF8F3', '#B07D4E', 'box-decorated'),
    boxLength: 80,
    boxWidth: 60,
    boxHeight: 70,
    corrugateLayers: 7,
    completeness: 'good',
    expressSource: '德邦快递',
    steps: [
      '找到一个足够大的家电纸箱',
      '用美工刀刻出门和窗户',
      '顶部做出城堡的锯齿形状',
      '插上彩色小旗子装饰',
      '让孩子自己涂鸦上色'
    ],
    materials: [
      { name: '美工刀', quantity: 1, unit: '把' },
      { name: '彩色小旗', quantity: 4, unit: '面' },
      { name: '水彩笔', quantity: 1, unit: '套' },
    ],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
  {
    id: 'mock-7',
    name: '抽屉式内衣收纳',
    category: 'storage',
    description: '用快递纸箱做的抽屉式内衣收纳盒，分格设计，袜子内裤都能分类放好。',
    beforeImage: createBoxSVG('改造前 · 长方形箱', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 内衣收纳', '#FDF8F3', '#8B5E34', 'box-decorated'),
    boxLength: 35,
    boxWidth: 25,
    boxHeight: 12,
    corrugateLayers: 3,
    completeness: 'good',
    expressSource: '申通快递',
    steps: [
      '准备一个深度合适的长方形纸箱',
      '裁剪纸板制作内部小格子',
      '每个格子大小根据内衣尺寸调整',
      '外面贴上好看的包装纸',
      '贴上小标签方便查找'
    ],
    materials: [
      { name: '包装纸', quantity: 2, unit: '张' },
      { name: '小标签', quantity: 6, unit: '个' },
    ],
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
  },
  {
    id: 'mock-8',
    name: '瓦楞纸猫咪抓板',
    category: 'catHouse',
    description: '用瓦楞纸一层层粘起来做的猫抓板，比买的还耐用，猫咪超爱磨爪子！',
    beforeImage: createBoxSVG('改造前 · 瓦楞纸条', '#E8E0D5', '#8B5E34', 'box'),
    afterImage: createBoxSVG('改造后 · 猫抓板', '#D9CCB8', '#6B4523', 'cat'),
    boxLength: 45,
    boxWidth: 25,
    boxHeight: 5,
    corrugateLayers: 5,
    completeness: 'fair',
    expressSource: '极兔速递',
    steps: [
      '将纸箱裁成2cm宽的长条',
      '把纸条一条条卷起来或堆叠',
      '每层之间涂上白乳胶',
      '压平晾干一整夜',
      '边缘打磨光滑，防止刮伤猫咪'
    ],
    materials: [
      { name: '白乳胶', quantity: 1, unit: '瓶' },
      { name: '砂纸', quantity: 2, unit: '张' },
    ],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
];
