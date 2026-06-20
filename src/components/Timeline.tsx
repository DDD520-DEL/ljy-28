import { cn } from '@/lib/utils';

interface TimelineStep {
  id?: string | number;
  content: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export default function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, index) => (
        <div key={step.id || index} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kraft-300 to-kraft-400 text-white text-sm font-bold flex items-center justify-center shadow-paper flex-shrink-0 z-10">
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 flex-1 bg-gradient-to-b from-kraft-200 to-kraft-100 my-1" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="card-paper p-4 hover:shadow-paper transition-shadow">
              <p className="text-kraft-700 leading-relaxed">{step.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
