import { useState, useMemo } from 'react';
import { X, AlertTriangle, HardDrive, Cloud, Check, Clock } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils';

interface ConflictResolverProps {
  open: boolean;
  onClose: () => void;
}

export default function ConflictResolver({ open, onClose }: ConflictResolverProps) {
  const { syncConflicts, resolveConflicts, syncStatus, pendingSyncDirection } = useBoxStore();
  const [selections, setSelections] = useState<Map<string, 'local' | 'cloud'>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentConflict = useMemo(() => {
    return syncConflicts[currentIndex] || null;
  }, [syncConflicts, currentIndex]);

  const allResolved = useMemo(() => {
    return syncConflicts.every((c) => selections.has(c.id));
  }, [syncConflicts, selections]);

  if (!open || syncConflicts.length === 0) return null;

  const handleSelect = (choice: 'local' | 'cloud') => {
    if (!currentConflict) return;
    setSelections((prev) => {
      const next = new Map(prev);
      next.set(currentConflict.id, choice);
      return next;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(syncConflicts.length - 1, prev + 1));
  };

  const handleSelectAll = (choice: 'local' | 'cloud') => {
    const all = new Map<string, 'local' | 'cloud'>();
    syncConflicts.forEach((c) => all.set(c.id, choice));
    setSelections(all);
  };

  const handleConfirm = async () => {
    await resolveConflicts(selections);
    onClose();
    setCurrentIndex(0);
    setSelections(new Map());
  };

  const handleClose = () => {
    onClose();
    setCurrentIndex(0);
    setSelections(new Map());
  };

  const isResolving = syncStatus === 'syncing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-kraft-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-kraft-800">同步冲突</h3>
              <p className="text-sm text-kraft-500">
                发现 {syncConflicts.length} 条记录存在冲突，请选择保留的版本
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-kraft-400 hover:text-kraft-600 hover:bg-kraft-50 transition-colors"
            disabled={isResolving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-kraft-50/50 border-b border-kraft-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-kraft-600">
              {currentIndex + 1} / {syncConflicts.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectAll('local')}
                className="text-xs text-kraft-600 hover:text-kraft-800 hover:underline transition-colors"
                disabled={isResolving}
              >
                全部保留本地
              </button>
              <span className="text-kraft-300">|</span>
              <button
                onClick={() => handleSelectAll('cloud')}
                className="text-xs text-kraft-600 hover:text-kraft-800 hover:underline transition-colors"
                disabled={isResolving}
              >
                全部保留云端
              </button>
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            {syncConflicts.map((c, i) => (
              <div
                key={c.id}
                className={cn(
                  'flex-1 h-1.5 rounded-full transition-colors',
                  i === currentIndex
                    ? selections.has(c.id)
                      ? 'bg-forest-400'
                      : 'bg-kraft-400'
                    : selections.has(c.id)
                    ? 'bg-forest-300'
                    : 'bg-kraft-200'
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentConflict && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-kraft-800">{currentConflict.local.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handleSelect('local')}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-4 transition-all duration-200',
                    selections.get(currentConflict.id) === 'local'
                      ? 'border-kraft-500 bg-kraft-50 shadow-md'
                      : 'border-kraft-200 bg-white hover:border-kraft-300 hover:bg-kraft-50/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-kraft-500" />
                      <span className="text-sm font-medium text-kraft-700">本地版本</span>
                    </div>
                    {selections.get(currentConflict.id) === 'local' && (
                      <div className="w-5 h-5 rounded-full bg-kraft-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-kraft-500 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    更新于 {formatDate(currentConflict.local.updatedAt)}
                  </div>
                  <p className="text-sm text-kraft-600 line-clamp-3">
                    {currentConflict.local.description}
                  </p>
                  {currentConflict.localNewer && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-forest-100 text-forest-700 rounded-full">
                      较新
                    </span>
                  )}
                </div>

                <div
                  onClick={() => handleSelect('cloud')}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-4 transition-all duration-200',
                    selections.get(currentConflict.id) === 'cloud'
                      ? 'border-sky-500 bg-sky-50 shadow-md'
                      : 'border-kraft-200 bg-white hover:border-kraft-300 hover:bg-kraft-50/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-sky-500" />
                      <span className="text-sm font-medium text-kraft-700">云端版本</span>
                    </div>
                    {selections.get(currentConflict.id) === 'cloud' && (
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-kraft-500 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    更新于 {formatDate(currentConflict.cloud.updatedAt)}
                  </div>
                  <p className="text-sm text-kraft-600 line-clamp-3">
                    {currentConflict.cloud.description}
                  </p>
                  {!currentConflict.localNewer && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-forest-100 text-forest-700 rounded-full">
                      较新
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-kraft-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || isResolving}
            className="px-4 py-2 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            上一条
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              disabled={isResolving}
              className="px-4 py-2 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors disabled:opacity-40"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!allResolved || isResolving}
              className={cn(
                'px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200',
                allResolved && !isResolving
                  ? 'bg-kraft-500 hover:bg-kraft-600 shadow-sm hover:shadow'
                  : 'bg-kraft-300 cursor-not-allowed'
              )}
            >
              {isResolving ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  同步中...
                </span>
              ) : (
                `确认同步 (${selections.size}/${syncConflicts.length})`
              )}
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === syncConflicts.length - 1 || isResolving}
            className="px-4 py-2 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一条
          </button>
        </div>

        {pendingSyncDirection && (
          <div className="absolute top-4 right-16">
            <span className="text-xs px-2 py-1 bg-kraft-100 text-kraft-600 rounded-full">
              {pendingSyncDirection === 'upload' ? '上传模式' : '下载模式'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
