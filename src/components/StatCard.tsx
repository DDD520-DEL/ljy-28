import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subtext?: string;
  color?: 'kraft' | 'forest' | 'warm';
  className?: string;
  delay?: number;
  onClick?: () => void;
  clickable?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = 'kraft',
  className,
  delay = 0,
  onClick,
  clickable = false,
}: StatCardProps) {
  const colorClasses = {
    kraft: 'from-kraft-100 to-paper-cream text-kraft-700',
    forest: 'from-forest-50 to-forest-100 text-forest-700',
    warm: 'from-orange-50 to-amber-100 text-amber-700',
  };

  const iconBgClasses = {
    kraft: 'bg-kraft-200/60 text-kraft-600',
    forest: 'bg-forest-200/60 text-forest-600',
    warm: 'bg-amber-200/60 text-amber-600',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'card-kraft p-6 bg-gradient-to-br opacity-0 animate-fade-in-up',
        colorClasses[color],
        clickable && 'cursor-pointer hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-kraft-600 mb-1">{label}</p>
          <p className="text-3xl font-bold font-display text-kraft-800">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-kraft-500 mt-1">{subtext}</p>
          )}
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            iconBgClasses[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
