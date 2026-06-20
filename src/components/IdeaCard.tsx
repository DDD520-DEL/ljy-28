import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/constants';
import { formatDateRelative } from '@/utils';
import { Ruler, Layers, ArrowRight } from 'lucide-react';
import type { BoxRecord } from '@/types';
import { cn } from '@/lib/utils';

interface IdeaCardProps {
  record: BoxRecord;
  index?: number;
  className?: string;
}

export default function IdeaCard({ record, index = 0, className }: IdeaCardProps) {
  const navigate = useNavigate();
  const categoryLabel = CATEGORY_LABELS[record.category];

  const handleClick = () => {
    navigate(`/detail/${record.id}`);
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
          </div>
          <span>{formatDateRelative(record.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
