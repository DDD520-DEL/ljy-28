import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Recycle, Sparkles, Plus, Star, Search, X, Settings2, Trash2, CheckSquare, Square, AlertTriangle, ChevronDown, Award, Settings, Wrench, Trophy, Bell } from 'lucide-react';
import { useReminder } from '@/hooks/useReminder';
import { useBoxStore } from '@/store/useBoxStore';
import { useAchievements } from '@/hooks/useAchievements';
import StatCard from '@/components/StatCard';
import TrendChart from '@/components/TrendChart';
import CategoryTabs from '@/components/CategoryTabs';
import IdeaCard from '@/components/IdeaCard';
import SyncStatusBar from '@/components/SyncStatusBar';
import ConflictResolver from '@/components/ConflictResolver';
import DailyRecommend from '@/components/DailyRecommend';
import { DIFFICULTY_OPTIONS, DIFFICULTY_LABELS } from '@/constants';
import type { CategoryType } from '@/types';
import { cn } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const {
    records,
    currentCategory,
    searchKeyword,
    difficultyFilter,
    setCategory,
    setSearchKeyword,
    setDifficultyFilter,
    getStats,
    init,
    isLoaded,
    favorites,
    batchDeleteRecords,
    syncConflicts,
    clearConflicts,
    reminderSettings,
  } = useBoxStore();

  const { earnedCount, totalCount } = useAchievements();
  const { getNextReminderText } = useReminder();

  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(e.target as Node)) {
        setShowDifficultyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRecords = useMemo(() => {
    let result = records;

    if (currentCategory === 'favorites') {
      result = result.filter((r) => favorites.includes(r.id));
    } else if (currentCategory !== 'all') {
      result = result.filter((r) => r.category === currentCategory);
    }

    if (difficultyFilter !== 'all') {
      result = result.filter((r) => r.difficulty === difficultyFilter);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword) ||
          r.description.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [records, currentCategory, searchKeyword, difficultyFilter, favorites]);

  const stats = useMemo(() => getStats(), [getStats, records]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: stats.total, favorites: favorites.length };
    Object.entries(stats.categoryStats).forEach(([key, value]) => {
      counts[key] = value;
    });
    return counts;
  }, [stats, favorites]);

  const handleCategoryChange = (category: CategoryType | 'all' | 'favorites') => {
    setCategory(category);
  };

  const enterManageMode = () => {
    setIsManageMode(true);
    setSelectedIds(new Set());
  };

  const exitManageMode = () => {
    setIsManageMode(false);
    setSelectedIds(new Set());
    setShowConfirmDialog(false);
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    setShowConfirmDialog(true);
  };

  const confirmBatchDelete = () => {
    batchDeleteRecords(Array.from(selectedIds));
    exitManageMode();
  };

  const isAllSelected = filteredRecords.length > 0 && selectedIds.size === filteredRecords.length;

  const hasConflicts = syncConflicts.length > 0;

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-corrugate opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/80 via-paper-cream/60 to-paper-cream" />
        
        <div className="relative container py-12 md:py-16">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-10">
            <button
              onClick={() => navigate('/box-size-recommender')}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-paper-white/80 backdrop-blur-sm border border-kraft-200 text-kraft-600 hover:text-kraft-800 hover:bg-paper-white hover:border-kraft-300 hover:shadow-paper transition-all duration-200 dark:bg-white/5 dark:border-kraft-700 dark:text-kraft-400 dark:hover:bg-white/10 dark:hover:text-kraft-200"
              title="纸箱尺寸推荐"
            >
              <Wrench className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-paper-white/80 backdrop-blur-sm border border-kraft-200 text-kraft-600 hover:text-kraft-800 hover:bg-paper-white hover:border-kraft-300 hover:shadow-paper transition-all duration-200 dark:bg-white/5 dark:border-kraft-700 dark:text-kraft-400 dark:hover:bg-white/10 dark:hover:text-kraft-200"
              title="设置"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
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

          <div className="mt-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-kraft-400" />
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索项目名称或描述..."
                className="w-full pl-12 pr-12 py-3.5 bg-paper-white border-2 border-kraft-200 rounded-2xl text-kraft-800 placeholder-kraft-400 focus:outline-none focus:border-kraft-400 focus:ring-4 focus:ring-kraft-100 transition-all duration-200 shadow-paper-sm"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-kraft-400 hover:text-kraft-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchKeyword && (
              <p className="text-center text-sm text-kraft-500 mt-2">
                找到 <span className="font-semibold text-kraft-700">{filteredRecords.length}</span> 个相关结果
                {currentCategory !== 'all' && (
                  <span> · 在 <span className="font-medium text-kraft-600">{currentCategory === 'favorites' ? '我的收藏' : '当前分类'}</span> 中</span>
                )}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="container pb-16 flex-1">
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

        <button
          onClick={() => navigate('/achievements')}
          className="w-full mb-4 card-kraft p-4 flex items-center gap-4 hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200 text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-paper-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-kraft-800 mb-0.5">我的成就</h3>
            <p className="text-sm text-kraft-500">
              已解锁 <span className="font-semibold text-kraft-700">{earnedCount}</span>/{totalCount} 枚徽章
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-20 bg-kraft-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%` }}
              />
            </div>
            <span className="text-xs text-kraft-400 group-hover:text-kraft-600 transition-colors">›</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/reminder-settings')}
          className="w-full mb-10 card-kraft p-4 flex items-center gap-4 hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200 text-left group"
        >
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-paper-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200",
            reminderSettings.enabled
              ? "bg-gradient-to-br from-kraft-400 to-kraft-500"
              : "bg-gradient-to-br from-kraft-200 to-kraft-300"
          )}>
            <Bell className={cn(
              "w-6 h-6",
              reminderSettings.enabled ? "text-white" : "text-kraft-500"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-kraft-800 mb-0.5">创意提醒</h3>
            <p className={cn(
              "text-sm",
              reminderSettings.enabled ? "text-kraft-600" : "text-kraft-400"
            )}>
              {getNextReminderText()}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium",
              reminderSettings.enabled
                ? "bg-forest-50 text-forest-600"
                : "bg-kraft-100 text-kraft-500"
            )}>
              {reminderSettings.enabled ? "已开启" : "未开启"}
            </span>
            <span className="text-xs text-kraft-400 group-hover:text-kraft-600 transition-colors">›</span>
          </div>
        </button>

        <TrendChart />

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-kraft-800">
              创意灵感
            </h2>
            <div className="flex items-center gap-3">
              {filteredRecords.length > 0 && !isManageMode && (
                <button
                  onClick={enterManageMode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors"
                >
                  <Settings2 className="w-4 h-4" />
                  管理
                </button>
              )}
              {!isManageMode && (
                <span className="text-sm text-kraft-400">
                  共 {filteredRecords.length} 个作品
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
              <CategoryTabs
                activeCategory={currentCategory}
                onCategoryChange={handleCategoryChange}
                counts={categoryCounts}
              />
            </div>
            <div className="relative flex-shrink-0" ref={difficultyDropdownRef}>
              <button
                onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                  difficultyFilter !== 'all'
                    ? 'bg-kraft-400 text-white border-kraft-400 shadow-paper'
                    : 'bg-paper-white text-kraft-600 border-kraft-200 hover:bg-kraft-50 hover:border-kraft-300'
                )}
              >
                <Award className="w-4 h-4" />
                <span>{difficultyFilter === 'all' ? '难度' : DIFFICULTY_LABELS[difficultyFilter]}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', showDifficultyDropdown && 'rotate-180')} />
              </button>
              {showDifficultyDropdown && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-kraft-100 py-1 z-20 animate-fade-in-up">
                  <button
                    onClick={() => { setDifficultyFilter('all'); setShowDifficultyDropdown(false); }}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-kraft-50 transition-colors',
                      difficultyFilter === 'all' ? 'text-kraft-800 font-medium bg-kraft-50' : 'text-kraft-600'
                    )}
                  >
                    全部难度
                  </button>
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setDifficultyFilter(opt.key); setShowDifficultyDropdown(false); }}
                      className={cn(
                        'w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-kraft-50 transition-colors',
                        difficultyFilter === opt.key ? 'text-kraft-800 font-medium bg-kraft-50' : 'text-kraft-600'
                      )}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                      <span className="text-xs text-kraft-400 ml-auto">{opt.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <DailyRecommend records={records} />

        {isManageMode && (
          <div className="sticky top-0 z-30 mb-4 animate-fade-in-up">
            <div className="flex items-center justify-between px-5 py-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-paper border border-kraft-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSelectAll}
                  className="inline-flex items-center gap-2 text-sm font-medium text-kraft-700 hover:text-kraft-800 transition-colors"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-5 h-5 text-kraft-500" />
                  ) : (
                    <Square className="w-5 h-5 text-kraft-400" />
                  )}
                  {isAllSelected ? '取消全选' : '全选'}
                </button>
                <span className="text-sm text-kraft-500">
                  已选择 <span className="font-semibold text-kraft-700">{selectedIds.size}</span> 项
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBatchDelete}
                  disabled={selectedIds.size === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  批量删除
                </button>
                <button
                  onClick={exitManageMode}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredRecords.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record, index) => (
              <IdeaCard
                key={record.id}
                record={record}
                index={index}
                isManageMode={isManageMode}
                isSelected={selectedIds.has(record.id)}
                onSelect={toggleSelect}
              />
            ))}
          </section>
        ) : searchKeyword ? (
          <div className="card-kraft p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="48" cy="48" r="40" fill="#F5E6D3" />
                <g transform="translate(24, 20)">
                  <rect x="8" y="12" width="32" height="28" rx="3" fill="#D4A574" />
                  <path d="M8 12 L24 2 L40 12" fill="#C4956A" />
                  <line x1="24" y1="2" x2="24" y2="12" stroke="#8B6914" strokeWidth="1" />
                  <rect x="12" y="16" width="24" height="4" rx="1" fill="#F5E6D3" />
                  <rect x="16" y="24" width="16" height="12" rx="1" fill="#E8D5C4" opacity="0.5" />
                  <circle cx="44" cy="36" r="6" fill="#C4956A" />
                  <line x1="48" y1="40" x2="56" y2="48" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
                </g>
                <g transform="translate(52, 48)">
                  <circle cx="16" cy="16" r="14" fill="#E8D5C4" />
                  <line x1="10" y1="16" x2="22" y2="16" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="10" x2="16" y2="22" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
                </g>
                <g transform="translate(16, 52)">
                  <path d="M8 12 Q16 4 24 12 Q32 4 40 12" fill="none" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-kraft-700 mb-2">
              没有找到相关结果
            </h3>
            <p className="text-kraft-500 mb-4 max-w-sm mx-auto">
              换个关键词试试，或者检查一下拼写是否正确～
            </p>
            <button
              onClick={() => setSearchKeyword('')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-kraft-100 text-kraft-700 rounded-xl hover:bg-kraft-200 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              清除搜索
            </button>
          </div>
        ) : (
          <div className="card-kraft p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-kraft-100 flex items-center justify-center">
              {currentCategory === 'favorites' ? (
                <Star className="w-10 h-10 text-kraft-400" />
              ) : (
                <Package className="w-10 h-10 text-kraft-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-kraft-700 mb-2">
              {currentCategory === 'favorites' ? '还没有收藏的记录' : '还没有改造记录'}
            </h3>
            <p className="text-kraft-500 mb-6 max-w-sm mx-auto">
              {currentCategory === 'favorites'
                ? '点击卡片右上角的星标，收藏你喜欢的创意作品吧！'
                : '开始记录你的第一个纸箱改造项目吧，让废弃的纸箱焕发新生！'}
            </p>
            {currentCategory !== 'favorites' && (
              <button
                onClick={() => navigate('/record')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                新建记录
              </button>
            )}
          </div>
        )}
      </main>

      <div className="mt-auto">
        <footer className="py-8 text-center text-sm text-kraft-400 border-t border-kraft-100">
          <p>🌿 纸箱二次利用 · 让环保成为一种生活方式</p>
        </footer>
        <SyncStatusBar />
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirmDialog(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-kraft-800">确认删除</h3>
            </div>
            <p className="text-sm text-kraft-600 mb-6">
              确定要删除选中的 <span className="font-semibold text-red-600">{selectedIds.size}</span> 条记录吗？此操作不可撤销。
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmBatchDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      <ConflictResolver
        open={hasConflicts}
        onClose={clearConflicts}
      />
    </div>
  );
}
