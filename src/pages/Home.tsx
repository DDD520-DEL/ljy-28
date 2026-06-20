import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Recycle, Sparkles, Plus } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import StatCard from '@/components/StatCard';
import CategoryTabs from '@/components/CategoryTabs';
import IdeaCard from '@/components/IdeaCard';
import type { CategoryType } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const { records, currentCategory, setCategory, getFilteredRecords, getStats, init, isLoaded } =
    useBoxStore();

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const filteredRecords = useMemo(() => getFilteredRecords(), [records, currentCategory, getFilteredRecords]);
  const stats = useMemo(() => getStats(), [records, getStats]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: stats.total };
    Object.entries(stats.categoryStats).forEach(([key, value]) => {
      counts[key] = value;
    });
    return counts;
  }, [stats]);

  const handleCategoryChange = (category: CategoryType | 'all') => {
    setCategory(category);
  };

  return (
    <div className="min-h-screen bg-paper-cream">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-corrugate opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/80 via-paper-cream/60 to-paper-cream" />
        
        <div className="relative container py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-kraft-400 to-kraft-500 flex items-center justify-center shadow-paper">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-kraft-500">纸箱创意日志</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-kraft-800 mb-3">
                让每个快递纸箱
                <br />
                <span className="text-forest-600">焕发新生</span>
              </h1>
              <p className="text-kraft-500 max-w-md">
                记录每一次纸箱改造的灵感与过程，积累属于你的环保创意宝库
              </p>
            </div>

            <button
              onClick={() => navigate('/record')}
              className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-kraft-400 to-kraft-500 text-white rounded-2xl font-medium shadow-paper hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200 animate-breathe opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Plus className="w-5 h-5" />
              新建改造记录
            </button>
          </div>
        </div>
      </header>

      <main className="container pb-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 -mt-2 relative z-10">
          <StatCard
            icon={Package}
            label="已改造纸箱"
            value={stats.total}
            subtext="个创意项目"
            color="kraft"
            delay={200}
          />
          <StatCard
            icon={Recycle}
            label="减少浪费"
            value={`约${(stats.savedBoxes * 0.5).toFixed(1)}kg`}
            subtext={`相当于种了 ${Math.round(stats.savedBoxes * 0.3)} 棵树`}
            color="forest"
            delay={300}
          />
          <StatCard
            icon={Sparkles}
            label="改造类型"
            value={Object.values(stats.categoryStats).filter(v => v > 0).length}
            subtext="种不同创意"
            color="warm"
            delay={400}
          />
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-kraft-800">
              创意灵感
            </h2>
            <span className="text-sm text-kraft-400">
              共 {filteredRecords.length} 个作品
            </span>
          </div>

          <CategoryTabs
            activeCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
            counts={categoryCounts}
          />
        </section>

        {filteredRecords.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record, index) => (
              <IdeaCard key={record.id} record={record} index={index} />
            ))}
          </section>
        ) : (
          <div className="card-kraft p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-kraft-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-kraft-400" />
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
              <Plus className="w-4 h-4" />
              新建记录
            </button>
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-kraft-400 border-t border-kraft-100">
        <p>🌿 纸箱二次利用 · 让环保成为一种生活方式</p>
      </footer>
    </div>
  );
}
