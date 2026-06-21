import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Archive, Cat, Scissors, Puzzle, Flower2, LayoutGrid, Lightbulb } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { CATEGORIES, CATEGORY_LABELS } from '@/constants';
import type { CategoryType, BoxRecord } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Archive> = {
  Archive,
  Cat,
  Scissors,
  Puzzle,
  Flower2,
  LayoutGrid,
  Lightbulb,
};

const rankColors = [
  'from-amber-400 to-amber-600',
  'from-slate-300 to-slate-500',
  'from-amber-600 to-amber-800',
  'from-kraft-300 to-kraft-500',
  'from-kraft-300 to-kraft-500',
  'from-kraft-300 to-kraft-500',
  'from-kraft-300 to-kraft-500',
];

export default function CategoryRanking() {
  const navigate = useNavigate();
  const { records, init, isLoaded } = useBoxStore();

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const rankingData = useMemo(() => {
    const categoryStats: Record<CategoryType, { count: number; latestRecord: BoxRecord | null }> = {
      storage: { count: 0, latestRecord: null },
      catHouse: { count: 0, latestRecord: null },
      craft: { count: 0, latestRecord: null },
      toy: { count: 0, latestRecord: null },
      pot: { count: 0, latestRecord: null },
      display: { count: 0, latestRecord: null },
      other: { count: 0, latestRecord: null },
    };

    records.forEach((record) => {
      const cat = record.category;
      categoryStats[cat].count += 1;
      if (!categoryStats[cat].latestRecord || 
          new Date(record.createdAt) > new Date(categoryStats[cat].latestRecord!.createdAt)) {
        categoryStats[cat].latestRecord = record;
      }
    });

    const total = records.length;

    const sortedCategories = (Object.entries(categoryStats) as [CategoryType, { count: number; latestRecord: BoxRecord | null }][])
      .sort((a, b) => b[1].count - a[1].count)
      .map(([category, data], index) => ({
        category,
        count: data.count,
        latestRecord: data.latestRecord,
        rank: index + 1,
        percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      }));

    return { sortedCategories, total };
  }, [records]);

  const categoryInfoMap = useMemo(() => {
    const map: Record<string, typeof CATEGORIES[0]> = {};
    CATEGORIES.forEach((cat) => {
      map[cat.key] = cat;
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-paper-cream">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-kraft-100">
        <div className="container flex items-center gap-3 h-14">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-kraft-100 transition-colors text-kraft-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold font-display text-kraft-800">分类排行榜</h1>
        </div>
      </header>

      <main className="container py-6 pb-20">
        <div className="card-kraft p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-paper flex-shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-kraft-800 mb-1">
                创意总榜
              </h2>
              <p className="text-kraft-500">
                共 <span className="font-semibold text-kraft-700">{rankingData.total}</span> 个改造记录，
                <span className="font-semibold text-kraft-700">{rankingData.sortedCategories.filter(c => c.count > 0).length}</span> 个分类有作品
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {rankingData.sortedCategories.map((item, index) => {
            const catInfo = categoryInfoMap[item.category];
            const Icon = iconMap[catInfo?.icon || 'Archive'] || Archive;
            const rankColor = rankColors[index] || rankColors[rankColors.length - 1];
            const isTopThree = index < 3;
            const hasRecords = item.count > 0;

            return (
              <div
                key={item.category}
                className={cn(
                  'card-kraft p-4 transition-all duration-300',
                  hasRecords && 'hover:shadow-paper-hover hover:-translate-y-0.5 cursor-pointer'
                )}
                onClick={() => {
                  if (hasRecords) {
                    navigate('/');
                    setTimeout(() => {
                      const event = new CustomEvent('navigateToCategory', { detail: item.category });
                      window.dispatchEvent(event);
                    }, 100);
                  }
                }}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg',
                    isTopThree
                      ? cn('bg-gradient-to-br text-white shadow-paper', rankColor)
                      : 'bg-kraft-100 text-kraft-500'
                  )}>
                    {isTopThree ? (
                      <Trophy className="w-6 h-6" />
                    ) : (
                      <span>{item.rank}</span>
                    )}
                  </div>

                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    hasRecords
                      ? 'bg-gradient-to-br from-kraft-200 to-kraft-300 text-kraft-700'
                      : 'bg-kraft-100 text-kraft-400'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-kraft-800">
                        {CATEGORY_LABELS[item.category]}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-display text-kraft-800">
                          {item.count}
                        </span>
                        <span className="text-xs text-kraft-400">个</span>
                      </div>
                    </div>

                    <div className="w-full bg-kraft-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700 ease-out',
                          hasRecords
                            ? 'bg-gradient-to-r from-kraft-400 to-kraft-500'
                            : 'bg-kraft-200'
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-kraft-400 mt-1 text-right">
                      占比 {item.percentage}%
                    </p>
                  </div>

                  {item.latestRecord && (
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-card border border-kraft-200">
                        <img
                          src={item.latestRecord.afterImage}
                          alt={item.latestRecord.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {rankingData.total === 0 && (
          <div className="card-kraft p-12 text-center mt-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-kraft-100 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-kraft-400" />
            </div>
            <h3 className="text-lg font-semibold text-kraft-700 mb-2">
              还没有改造记录
            </h3>
            <p className="text-kraft-500 mb-6 max-w-sm mx-auto">
              开始记录你的第一个纸箱改造项目吧，让废弃的纸箱焕发新生！
            </p>
            <button
              onClick={() => navigate('/record')}
              className="btn-primary inline-flex items-center gap-2"
            >
              新建记录
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
