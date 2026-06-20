import { CATEGORIES } from '@/constants';
import {
  Grid3x3,
  Archive,
  Cat,
  Scissors,
  Puzzle,
  Flower2,
  LayoutGrid,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryType } from '@/types';

const iconMap: Record<string, any> = {
  Grid3x3,
  Archive,
  Cat,
  Scissors,
  Puzzle,
  Flower2,
  LayoutGrid,
  Lightbulb,
};

interface CategoryTabsProps {
  activeCategory: CategoryType | 'all';
  onCategoryChange: (category: CategoryType | 'all') => void;
  counts?: Record<string, number>;
}

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
  counts,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon] || Grid3x3;
        const isActive = activeCategory === cat.key;
        const count = counts?.[cat.key] ?? 0;

        return (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key as CategoryType | 'all')}
            className={cn(
              'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full',
              'text-sm font-medium transition-all duration-200',
              'border whitespace-nowrap',
              isActive
                ? 'bg-kraft-400 text-white border-kraft-400 shadow-paper'
                : 'bg-paper-white text-kraft-600 border-kraft-200 hover:bg-kraft-50 hover:border-kraft-300'
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
            {cat.key !== 'all' && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-kraft-100 text-kraft-500'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
