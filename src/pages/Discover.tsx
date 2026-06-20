import { useEffect, useMemo, useState } from 'react';
import { Compass, TrendingUp, Clock, Filter, Search, X, Sparkles } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import CommunityCard from '@/components/CommunityCard';
import { CATEGORIES } from '@/constants';
import type { CategoryType, SortType } from '@/types';
import { cn } from '@/lib/utils';

export default function Discover() {
  const {
    init,
    isLoaded,
    communityCategory,
    communitySortBy,
    setCommunityCategory,
    setCommunitySortBy,
    getPublishedRecords,
  } = useBoxStore();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const publishedRecords = useMemo(() => getPublishedRecords(), [getPublishedRecords, communityCategory, communitySortBy]);

  const filteredRecords = useMemo(() => {
    if (!searchKeyword.trim()) return publishedRecords;
    const keyword = searchKeyword.toLowerCase().trim();
    return publishedRecords.filter(
      (r) =>
        r.name.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword) ||
        r.authorName.toLowerCase().includes(keyword)
    );
  }, [publishedRecords, searchKeyword]);

  const sortOptions = [
    { key: 'latest' as SortType, label: '最新发布', icon: Clock },
    { key: 'popular' as SortType, label: '最多点赞', icon: TrendingUp },
  ];

  const activeSort = sortOptions.find(s => s.key === communitySortBy);

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-corrugate opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/80 via-paper-cream/60 to-paper-cream" />
        
        <div className="relative container py-12 md:py-16">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-500 flex items-center justify-center shadow-paper">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-kraft-500">社区分享广场</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-kraft-800 mb-3">
              发现精彩创意
              <br />
              <span className="text-forest-600">灵感无限可能</span>
            </h1>
            <p className="text-kraft-500 max-w-md">
              浏览其他用户分享的纸箱改造作品，获取灵感，为喜欢的创意点赞
            </p>
          </div>

          <div className="mt-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-kraft-400" />
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索创意作品、作者..."
                className="w-full pl-12 pr-12 py-3.5 bg-paper-white border-2 border-kraft-200 rounded-2xl text-kraft-800 placeholder-kraft-400 focus:outline-none focus:border-forest-400 focus:ring-4 focus:ring-forest-100 transition-all duration-200 shadow-paper-sm"
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
          </div>
        </div>
      </header>

      <main className="container pb-24 flex-1">
        <section className="mb-6 -mt-2 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-kraft-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              创意广场
            </h2>
            <span className="text-sm text-kraft-400">
              共 {filteredRecords.length} 个作品
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                {CATEGORIES.map((cat) => {
                  const isActive = communityCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setCommunityCategory(cat.key as CategoryType | 'all')}
                      className={cn(
                        'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full',
                        'text-sm font-medium transition-all duration-200',
                        'border whitespace-nowrap',
                        isActive
                          ? 'bg-forest-500 text-white border-forest-500 shadow-paper'
                          : 'bg-paper-white text-kraft-600 border-kraft-200 hover:bg-kraft-50 hover:border-kraft-300'
                      )}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                  communitySortBy !== 'latest'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-paper'
                    : 'bg-paper-white text-kraft-600 border-kraft-200 hover:bg-kraft-50 hover:border-kraft-300'
                )}
              >
                <Filter className="w-4 h-4" />
                <span>{activeSort?.label || '排序'}</span>
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-kraft-100 py-1 z-20 animate-fade-in-up">
                  {sortOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = communitySortBy === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setCommunitySortBy(opt.key);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-kraft-50 transition-colors',
                          isActive ? 'text-kraft-800 font-medium bg-kraft-50' : 'text-kraft-600'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {filteredRecords.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record, index) => (
              <CommunityCard
                key={record.id}
                record={record}
                index={index}
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
              没有找到相关作品
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
              <Compass className="w-10 h-10 text-kraft-400" />
            </div>
            <h3 className="text-lg font-semibold text-kraft-700 mb-2">
              社区广场还没有作品
            </h3>
            <p className="text-kraft-500 mb-6 max-w-sm mx-auto">
              快来成为第一个分享创意的人吧！在你的记录详情页开启"发布到社区"开关即可分享。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
