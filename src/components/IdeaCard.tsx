import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/constants';
import { formatDateRelative } from '@/utils';
import { Ruler, Layers, ArrowRight, Star, Wrench } from 'lucide-react';
import type { BoxRecord } from '@/types';
import { cn } from '@/lib/utils';
import { useBoxStore } from '@/store/useBoxStore';

interface IdeaCardProps {
  record: BoxRecord;
  index?: number;
  className?: string;
}

export default function IdeaCard({ record, index = 0, className }: IdeaCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useBoxStore();
  const categoryLabel = CATEGORY_LABELS[record.category];
  const favorited = isFavorite(record.id);

  const handleClick = () => {
    navigate(`/detail/${record.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(record.id);
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
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-kraft-700 shadow-sm border border-kraft-100">
            {categoryLabel}
          </span>
        </div>
        {favorited && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-kraft-100 text-amber-500 hover:bg-white transition-colors"
            title="取消收藏"
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        )}
        {!favorited && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/0 backdrop-blur-sm shadow-sm border border-transparent text-transparent group-hover:bg-white/90 group-hover:text-kraft-400 group-hover:border-kraft-100 hover:text-amber-500 transition-all duration-300"
            title="收藏"
          >
            <Star className="w-4 h-4" />
          </button>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-white text-kraft-700 shadow-md">
            查看详情
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="p-4">
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
          <span>{formatDateRelative(record.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
