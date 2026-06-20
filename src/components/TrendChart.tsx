import { useState, useMemo } from 'react';
import { ChevronDown, TrendingUp, BarChart3 } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import type { TrendRangeType } from '@/types';
import { cn } from '@/lib/utils';

const RANGE_OPTIONS: { key: TrendRangeType; label: string }[] = [
  { key: 'week', label: '近一周' },
  { key: 'month', label: '近一月' },
  { key: 'all', label: '全部' },
];

const BAR_COLORS: Record<string, string> = {
  storage: 'from-kraft-400 to-kraft-500',
  catHouse: 'from-forest-400 to-forest-500',
  craft: 'from-amber-400 to-amber-500',
  toy: 'from-rose-400 to-rose-500',
  pot: 'from-emerald-400 to-emerald-500',
  display: 'from-sky-400 to-sky-500',
  other: 'from-purple-400 to-purple-500',
};

export default function TrendChart() {
  const { records, getTrendData } = useBoxStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeRange, setActiveRange] = useState<TrendRangeType>('week');

  const trendData = useMemo(() => getTrendData(activeRange), [getTrendData, activeRange, records]);

  const maxBarHeight = 160;

  return (
    <section className="mb-10">
      <div className="card-kraft overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-5 hover:bg-kraft-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-400 to-forest-500 flex items-center justify-center shadow-paper">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold font-display text-kraft-800">
                改造趋势
              </h3>
              <p className="text-sm text-kraft-500">
                各分类新增数量统计 · 共 <span className="font-semibold text-kraft-700">{trendData.total}</span> 个项目
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-kraft-100/80 rounded-full p-1">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRange(opt.key);
                  }}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                    activeRange === opt.key
                      ? 'bg-white text-kraft-700 shadow-sm'
                      : 'text-kraft-500 hover:text-kraft-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-kraft-400 transition-transform duration-300',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-5 pb-5">
            <div className="sm:hidden flex items-center gap-1 bg-kraft-100/80 rounded-full p-1 mb-5 w-fit">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setActiveRange(opt.key)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                    activeRange === opt.key
                      ? 'bg-white text-kraft-700 shadow-sm'
                      : 'text-kraft-500 hover:text-kraft-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="bg-paper-white/60 rounded-2xl p-5 border border-kraft-100">
              {trendData.total === 0 ? (
                <div className="py-12 text-center">
                  <BarChart3 className="w-12 h-12 text-kraft-300 mx-auto mb-3" />
                  <p className="text-kraft-500 text-sm">
                    该时间段内暂无改造记录
                  </p>
                </div>
              ) : (
                <div className="flex items-end justify-between gap-2 h-48">
                  {trendData.categories.map((item, index) => {
                    const barHeight = item.count > 0
                      ? Math.max((item.count / trendData.maxCount) * maxBarHeight, 8)
                      : 4;
                    return (
                      <div
                        key={item.category}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div className="relative flex-1 flex items-end w-full">
                          <div
                            className={cn(
                              'w-full rounded-t-lg bg-gradient-to-t shadow-sm transition-all duration-500 ease-out',
                              BAR_COLORS[item.category] || 'from-kraft-400 to-kraft-500'
                            )}
                            style={{
                              height: `${barHeight}px`,
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            {item.count > 0 && (
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-kraft-700 whitespace-nowrap">
                                {item.count}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-kraft-500 text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-kraft-100">
                {trendData.categories
                  .filter(item => item.count > 0)
                  .map((item) => (
                    <div key={item.category} className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          'w-2.5 h-2.5 rounded-sm bg-gradient-to-br',
                          BAR_COLORS[item.category] || 'from-kraft-400 to-kraft-500'
                        )}
                      />
                      <span className="text-xs text-kraft-500">{item.label}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
