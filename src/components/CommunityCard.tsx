import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, DIFFICULTY_LABELS, DIFFICULTY_ICONS, DIFFICULTY_OPTIONS } from '@/constants';
import { formatDateRelative } from '@/utils';
import { Ruler, Layers, ArrowRight, Heart, Wrench, User } from 'lucide-react';
import type { BoxRecord } from '@/types';
import { cn } from '@/lib/utils';
import { useBoxStore } from '@/store/useBoxStore';

interface CommunityCardProps {
  record: BoxRecord;
  index?: number;
  className?: string;
}

export default function CommunityCard({ record, index = 0, className }: CommunityCardProps) {
  const navigate = useNavigate();
  const { toggleLike, hasLiked } = useBoxStore();
  const categoryLabel = CATEGORY_LABELS[record.category];
  const difficultyLabel = DIFFICULTY_LABELS[record.difficulty];
  const difficultyIcon = DIFFICULTY_ICONS[record.difficulty];
  const difficultyOpt = DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty);
  const liked = hasLiked(record.id);

  const handleClick = () => {
    navigate(`/detail/${record.id}?from=community`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(record.id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'card-paper cursor-pointer group opacity-0 animate-fade-in-up',
        'hover:shadow-paper-hover hover:-translate-y-1 transition-all duration-300',
        className
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-kraft-100">
        <img
          src={record.afterImage}
          alt={record.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-kraft-700 shadow-sm border border-kraft-100">
            {categoryLabel}
          </span>
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm border',
            difficultyOpt?.bgColor, difficultyOpt?.color, difficultyOpt?.borderColor
          )}>
            <span className="text-xs">{difficultyIcon}</span>
            {difficultyLabel}
          </span>
        </div>
        <button
          onClick={handleLikeClick}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm shadow-sm border transition-all duration-300 flex items-center gap-1',
            liked
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white/90 text-kraft-400 border-kraft-100 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
          )}
          title={liked ? '取消点赞' : '点赞'}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          <span className="text-xs font-medium">{record.likes}</span>
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white text-kraft-700 shadow-md">
            查看详情
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-kraft-100 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-kraft-500" />
          </div>
          <span className="text-xs text-kraft-500 font-medium">{record.authorName}</span>
          <span className="text-xs text-kraft-300">·</span>
          <span className="text-xs text-kraft-400">{formatDateRelative(record.publishedAt || record.createdAt)}</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-kraft-800 mb-2 line-clamp-1 group-hover:text-kraft-600 transition-colors">
          {record.name}
        </h3>
        <p className="text-sm text-kraft-500 line-clamp-2 mb-3 min-h-[2.5rem]">
          {record.description}
        </p>
        <div className="flex items-center justify-between text-xs text-kraft-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {record.boxLength}×{record.boxWidth}cm
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {record.corrugateLayers}层
            </span>
            {record.materials && record.materials.length > 0 && (
              <span className="flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" />
                {record.materials.length}种材料
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
