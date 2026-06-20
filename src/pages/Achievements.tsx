import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { BADGE_TIER_CONFIG, BADGE_CATEGORY_LABELS } from '@/constants';
import type { BadgeCategory } from '@/types';
import { cn } from '@/lib/utils';

export default function Achievements() {
  const navigate = useNavigate();
  const { badges, earnedCount, totalCount } = useAchievements();

  const categories: BadgeCategory[] = ['records', 'categories', 'tools', 'materials', 'features'];

  const progressPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

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
          <h1 className="text-lg font-bold font-display text-kraft-800">我的成就</h1>
        </div>
      </header>

      <main className="container py-6 pb-20">
        <div className="card-kraft p-6 mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-kraft-300 to-kraft-500 flex items-center justify-center shadow-paper">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="text-3xl font-bold font-display text-kraft-800 mb-1">
            {earnedCount} <span className="text-lg font-normal text-kraft-500">/ {totalCount}</span>
          </div>
          <p className="text-sm text-kraft-500 mb-4">已解锁徽章</p>
          <div className="w-full max-w-xs mx-auto bg-kraft-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-kraft-400 to-kraft-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-kraft-400 mt-2">完成度 {progressPercent}%</p>
        </div>

        {categories.map((cat) => {
          const catBadges = badges.filter((b) => b.badge.category === cat);
          if (catBadges.length === 0) return null;

          return (
            <section key={cat} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold font-display text-kraft-800">
                  {BADGE_CATEGORY_LABELS[cat]}
                </h2>
                <span className="text-xs text-kraft-400 bg-kraft-100 px-2 py-0.5 rounded-full">
                  {catBadges.filter((b) => b.earned).length}/{catBadges.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {catBadges.map((badgeStatus) => {
                  const { badge, earned, earnedAt, progress, target } = badgeStatus;
                  const tierConfig = BADGE_TIER_CONFIG[badge.tier];
                  const progressPct = target > 0 ? Math.min(Math.round((progress / target) * 100), 100) : 0;

                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        'relative rounded-2xl border-2 p-4 transition-all duration-300',
                        earned
                          ? cn(tierConfig.bgColor, tierConfig.borderColor, 'shadow-paper hover:shadow-paper-hover hover:-translate-y-0.5')
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      )}
                    >
                      {earned && (
                        <div className={cn(
                          'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                          badge.tier === 'bronze' && 'bg-amber-500',
                          badge.tier === 'silver' && 'bg-slate-400',
                          badge.tier === 'gold' && 'bg-yellow-400',
                          badge.tier === 'diamond' && 'bg-cyan-500'
                        )}>
                          {tierConfig.label}
                        </div>
                      )}

                      <div className={cn(
                        'w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300',
                        earned ? 'scale-100' : 'grayscale scale-90'
                      )}>
                        {badge.icon}
                      </div>

                      <h3 className={cn(
                        'text-sm font-bold text-center mb-1',
                        earned ? 'text-kraft-800' : 'text-gray-400'
                      )}>
                        {badge.name}
                      </h3>

                      <p className={cn(
                        'text-xs text-center leading-relaxed',
                        earned ? 'text-kraft-500' : 'text-gray-400'
                      )}>
                        {badge.description}
                      </p>

                      {!earned && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-kraft-300 rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 text-center mt-1">
                            {progress}/{target}
                          </p>
                        </div>
                      )}

                      {earned && earnedAt && (
                        <p className="text-xs text-center mt-2 text-kraft-400">
                          {new Date(earnedAt).toLocaleDateString('zh-CN')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
