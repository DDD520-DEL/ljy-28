import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ruler, Box, Layers, Info, RefreshCw, Calculator } from 'lucide-react';
import { CORRUGATE_LAYERS } from '@/constants';
import { cn } from '@/lib/utils';

interface BoxSizeRecommendation {
  minLength: number;
  maxLength: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  recommendedLayers: number;
  weightCapacity: string;
  useCase: string;
  explanation: string;
}

const STANDARD_BOX_SIZES = [
  { length: 20, width: 15, height: 10, label: '小号', layers: 3, weight: '1-3kg' },
  { length: 30, width: 20, height: 15, label: '中小号', layers: 3, weight: '3-5kg' },
  { length: 40, width: 30, height: 20, label: '中号', layers: 5, weight: '5-10kg' },
  { length: 50, width: 40, height: 30, label: '大号', layers: 5, weight: '10-15kg' },
  { length: 60, width: 45, height: 40, label: '特大号', layers: 7, weight: '15-25kg' },
  { length: 70, width: 50, height: 50, label: '超大号', layers: 7, weight: '25-40kg' },
];

const USAGE_SCENARIOS = [
  { key: 'storage', label: '收纳储存', icon: '📦', desc: '衣物、书籍、生活用品' },
  { key: 'shipping', label: '快递邮寄', icon: '🚚', desc: '易碎物品、贵重物品' },
  { key: 'moving', label: '搬家打包', icon: '🏠', desc: '家居用品、厨房器具' },
  { key: 'gift', label: '礼品包装', icon: '🎁', desc: '节日礼物、礼盒包装' },
  { key: 'craft', label: '手工改造', icon: '✂️', desc: 'DIY创意、儿童手工' },
];

export default function BoxSizeRecommender() {
  const navigate = useNavigate();
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [scenario, setScenario] = useState<string>('storage');
  const [itemWeight, setItemWeight] = useState<string>('');
  const [isFragile, setIsFragile] = useState(false);
  const [recommendation, setRecommendation] = useState<BoxSizeRecommendation | null>(null);

  const calculateRecommendation = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const weight = parseFloat(itemWeight) || 0;

    if (!l || !w || !h) {
      return;
    }

    const padding = 2;
    const extraPadding = isFragile ? 3 : 1;
    const totalPadding = padding + extraPadding;

    const scenarioMultiplier = {
      storage: 1.0,
      shipping: 1.1,
      moving: 1.15,
      gift: 1.05,
      craft: 1.0,
    };

    const multiplier = scenarioMultiplier[scenario as keyof typeof scenarioMultiplier] || 1.0;

    const minLength = Math.ceil(l + totalPadding);
    const maxLength = Math.ceil(l * multiplier + totalPadding + 2);
    const minWidth = Math.ceil(w + totalPadding);
    const maxWidth = Math.ceil(w * multiplier + totalPadding + 2);
    const minHeight = Math.ceil(h + totalPadding);
    const maxHeight = Math.ceil(h * multiplier + totalPadding + 2);

    let recommendedLayers = 3;
    const maxDimension = Math.max(l, w, h);
    
    if (weight > 15 || maxDimension > 50 || isFragile) {
      recommendedLayers = 7;
    } else if (weight > 5 || maxDimension > 30) {
      recommendedLayers = 5;
    }

    if (scenario === 'shipping' && weight > 3) {
      recommendedLayers = Math.max(recommendedLayers, 5);
    }
    if (scenario === 'moving' && weight > 5) {
      recommendedLayers = Math.max(recommendedLayers, 5);
    }

    const weightCapacityMap: Record<number, string> = {
      3: '适合承重 1-5kg',
      5: '适合承重 5-15kg',
      7: '适合承重 15-40kg',
    };

    const scenarioExplanation: Record<string, string> = {
      storage: `收纳使用时，建议在物品四周预留 ${totalPadding}cm 的缓冲空间，方便取用和整理。`,
      shipping: `快递邮寄时，建议预留 ${totalPadding}cm 空间用于填充缓冲材料，保护物品安全。`,
      moving: `搬家打包时，建议预留 ${totalPadding}cm 空间，便于搬运时的堆叠和保护。`,
      gift: `礼品包装时，预留 ${totalPadding}cm 空间用于装饰和填充物，提升礼品质感。`,
      craft: `手工改造时，预留 ${totalPadding}cm 空间便于裁剪和创意发挥。`,
    };

    setRecommendation({
      minLength,
      maxLength,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      recommendedLayers,
      weightCapacity: weightCapacityMap[recommendedLayers],
      useCase: scenario,
      explanation: scenarioExplanation[scenario] || '',
    });
  };

  const findMatchingBoxes = () => {
    if (!recommendation) return [];
    return STANDARD_BOX_SIZES.filter(
      (box) =>
        box.length >= recommendation.minLength &&
        box.width >= recommendation.minWidth &&
        box.height >= recommendation.minHeight
    ).slice(0, 3);
  };

  const resetForm = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setItemWeight('');
    setIsFragile(false);
    setScenario('storage');
    setRecommendation(null);
  };

  const isFormValid = length && width && height;

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-corrugate opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/80 via-paper-cream/60 to-paper-cream" />
        
        <div className="relative container py-8">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper-white/80 backdrop-blur-sm border border-kraft-200 text-kraft-600 hover:text-kraft-800 hover:bg-paper-white hover:border-kraft-300 transition-all duration-200 z-10 dark:bg-white/5 dark:border-kraft-700 dark:text-kraft-400 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>

          <div className="pt-12 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-kraft-400 to-forest-500 flex items-center justify-center shadow-paper">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-kraft-500">智能工具</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-kraft-800 mb-3">
              纸箱尺寸
              <span className="text-forest-600">推荐</span>
            </h1>
            <p className="text-kraft-500 max-w-md">
              输入物品尺寸，智能推荐最合适的纸箱规格和瓦楞层数
            </p>
          </div>
        </div>
      </header>

      <main className="container pb-16 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="card-paper p-6 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-semibold text-kraft-800 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-kraft-500" />
              物品尺寸信息
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="label-text">长 (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="例如: 20"
                  className="input-field text-center"
                />
              </div>
              <div>
                <label className="label-text">宽 (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="例如: 15"
                  className="input-field text-center"
                />
              </div>
              <div>
                <label className="label-text">高 (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例如: 10"
                  className="input-field text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label-text">预估重量 (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={itemWeight}
                  onChange={(e) => setItemWeight(e.target.value)}
                  placeholder="可选"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">物品属性</label>
                <button
                  onClick={() => setIsFragile(!isFragile)}
                  className={cn(
                    'w-full h-12 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2',
                    isFragile
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-paper-white border-kraft-200 text-kraft-600 hover:border-kraft-300'
                  )}
                >
                  {isFragile ? '🔔 易碎物品' : '📦 普通物品'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="label-text">使用场景</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {USAGE_SCENARIOS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setScenario(s.key)}
                    className={cn(
                      'p-3 rounded-xl border-2 transition-all duration-200 text-center',
                      scenario === s.key
                        ? 'bg-kraft-400 border-kraft-400 text-white shadow-paper'
                        : 'bg-paper-white border-kraft-200 text-kraft-600 hover:border-kraft-300'
                    )}
                  >
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="text-xs font-medium">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重置
              </button>
              <button
                onClick={calculateRecommendation}
                disabled={!isFormValid}
                className={cn(
                  'btn-primary flex-1 flex items-center justify-center gap-2',
                  !isFormValid && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-paper'
                )}
              >
                <Calculator className="w-5 h-5" />
                开始计算
              </button>
            </div>
          </div>

          {recommendation && (
            <>
              <div className="card-kraft p-6 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold text-kraft-800 mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-forest-600" />
                  推荐纸箱尺寸
                </h2>

                <div className="bg-paper-white/70 rounded-2xl p-5 mb-4">
                  <div className="text-center mb-4">
                    <div className="text-sm text-kraft-500 mb-1">推荐内部尺寸范围</div>
                    <div className="text-2xl font-bold text-kraft-800 font-display">
                      <span className="text-forest-600">{recommendation.minLength}</span>
                      <span className="text-kraft-400 mx-1">-</span>
                      <span className="text-forest-600">{recommendation.maxLength}</span>
                      <span className="text-kraft-400 mx-2">×</span>
                      <span className="text-forest-600">{recommendation.minWidth}</span>
                      <span className="text-kraft-400 mx-1">-</span>
                      <span className="text-forest-600">{recommendation.maxWidth}</span>
                      <span className="text-kraft-400 mx-2">×</span>
                      <span className="text-forest-600">{recommendation.minHeight}</span>
                      <span className="text-kraft-400 mx-1">-</span>
                      <span className="text-forest-600">{recommendation.maxHeight}</span>
                      <span className="text-kraft-500 text-lg ml-2">cm</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-kraft-50 rounded-xl p-3">
                      <div className="text-xs text-kraft-500 mb-1">长度</div>
                      <div className="font-semibold text-kraft-800">
                        {recommendation.minLength}-{recommendation.maxLength} cm
                      </div>
                    </div>
                    <div className="bg-kraft-50 rounded-xl p-3">
                      <div className="text-xs text-kraft-500 mb-1">宽度</div>
                      <div className="font-semibold text-kraft-800">
                        {recommendation.minWidth}-{recommendation.maxWidth} cm
                      </div>
                    </div>
                    <div className="bg-kraft-50 rounded-xl p-3">
                      <div className="text-xs text-kraft-500 mb-1">高度</div>
                      <div className="font-semibold text-kraft-800">
                        {recommendation.minHeight}-{recommendation.maxHeight} cm
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-forest-50 rounded-2xl p-5 mb-4 border border-forest-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-500 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-800 mb-1">
                        推荐瓦楞层数: <span className="text-2xl">{recommendation.recommendedLayers}层</span>
                      </h3>
                      <p className="text-sm text-forest-700 mb-1">
                        {recommendation.weightCapacity}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {CORRUGATE_LAYERS.map((layer) => (
                          <div
                            key={layer}
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium',
                              layer === recommendation.recommendedLayers
                                ? 'bg-forest-500 text-white'
                                : layer < recommendation.recommendedLayers
                                ? 'bg-forest-200 text-forest-700'
                                : 'bg-forest-100 text-forest-600'
                            )}
                          >
                            {layer}层
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">温馨提示</h3>
                      <p className="text-sm text-amber-700">{recommendation.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-paper p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-lg font-semibold text-kraft-800 mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-kraft-500" />
                  匹配的标准纸箱
                </h2>
                <div className="space-y-3">
                  {findMatchingBoxes().length > 0 ? (
                    findMatchingBoxes().map((box, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-kraft-50 to-paper-white rounded-xl p-4 border border-kraft-200 hover:border-kraft-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-kraft-400 text-white text-xs font-medium rounded-full">
                                {box.label}
                              </span>
                              <span className="px-2 py-0.5 bg-forest-100 text-forest-700 text-xs font-medium rounded-full">
                                {box.layers}层瓦楞
                              </span>
                            </div>
                            <div className="text-xl font-bold text-kraft-800 font-display">
                              {box.length} × {box.width} × {box.height} cm
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-kraft-500">承重约</div>
                            <div className="text-lg font-semibold text-forest-600">{box.weight}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-kraft-500">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-kraft-100 flex items-center justify-center">
                        <Box className="w-8 h-8 text-kraft-400" />
                      </div>
                      <p>暂无完全匹配的标准尺寸</p>
                      <p className="text-sm">建议根据推荐范围定制纸箱</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="card-paper p-6 mt-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-semibold text-kraft-800 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-kraft-500" />
              瓦楞层数说明
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-kraft-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-kraft-300 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-kraft-800">三层瓦楞</div>
                  <p className="text-sm text-kraft-600">适用于轻量物品，如衣物、文件、日用品等，承重1-5kg</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-kraft-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-forest-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  5
                </div>
                <div>
                  <div className="font-medium text-kraft-800">五层瓦楞</div>
                  <p className="text-sm text-kraft-600">适用于中等重量物品，如书籍、电器、家居用品等，承重5-15kg</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-kraft-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  7
                </div>
                <div>
                  <div className="font-medium text-kraft-800">七层瓦楞</div>
                  <p className="text-sm text-kraft-600">适用于重型或易碎物品，如家电、家具、精密仪器等，承重15-40kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
