import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import type { BoxRecord } from '@/types';
import { CATEGORY_LABELS } from '@/constants';
import { cn } from '@/lib/utils';

interface DailyRecommendProps {
  records: BoxRecord[];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function getTodaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function shuffle<T>(arr: T[], randomFn: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function DailyRecommend({ records }: DailyRecommendProps) {
  const navigate = useNavigate();

  const dailyPicks = useMemo(() => {
    if (records.length === 0) return [];
    const randomFn = seededRandom(getTodaySeed());
    const shuffled = shuffle(records, randomFn);
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }, [records]);

  if (dailyPicks.length === 0) return null;

  const handleClick = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <section className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold font-display text-kraft-800">
            今日推荐
          </h2>
          <span className="text-xs text-kraft-400 bg-kraft-100 px-2 py-0.5 rounded-full">
            每日灵感
          </span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {dailyPicks.map((record, index) => (
          <div
            key={record.id}
            onClick={() => handleClick(record.id)}
            className={cn(
              'flex-shrink-0 w-64 snap-start cursor-pointer group',
              'card-paper hover:shadow-paper-hover hover:-translate-y-1 transition-all duration-300',
              'animate-fade-in-up'
            )}
            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
          >
            <div className="relative overflow-hidden aspect-[4/3] bg-kraft-100 rounded-t-2xl">
              <img
                src={record.afterImage}
                alt={record.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-kraft-700 shadow-sm border border-kraft-100">
                  {CATEGORY_LABELS[record.category]}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white text-kraft-700 shadow-md">
                  查看
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-display font-semibold text-kraft-800 line-clamp-1 group-hover:text-kraft-600 transition-colors">
                {record.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
