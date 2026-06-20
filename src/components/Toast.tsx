import { create } from 'zustand';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newToast = { id, duration: 4000, ...toast };
    set({ toasts: [...get().toasts, newToast] });

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }

    return id;
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

export function toast(message: string, type: ToastType = 'info', duration?: number) {
  return useToastStore.getState().addToast({ message, type, duration });
}

toast.success = (message: string, duration?: number) => toast(message, 'success', duration);
toast.error = (message: string, duration?: number) => toast(message, 'error', duration);
toast.warning = (message: string, duration?: number) => toast(message, 'warning', duration);
toast.info = (message: string, duration?: number) => toast(message, 'info', duration);

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-forest-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-kraft-500',
};

const bgMap = {
  success: 'bg-forest-50 border-forest-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-kraft-50 border-kraft-200',
};

const textColorMap = {
  success: 'text-forest-700',
  error: 'text-red-700',
  warning: 'text-amber-700',
  info: 'text-kraft-700',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    // noop - toasts auto-remove
  }, [toasts]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = iconMap[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg',
              'animate-fade-in-up',
              bgMap[t.type]
            )}
          >
            <div className={cn('w-5 h-5 flex-shrink-0', colorMap[t.type], 'rounded-full p-0.5')}>
              <Icon className="w-full h-full text-white" />
            </div>
            <p className={cn('text-sm flex-1', textColorMap[t.type])}>
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className={cn('flex-shrink-0 p-0.5 rounded', textColorMap[t.type], 'opacity-60 hover:opacity-100 transition-opacity')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
