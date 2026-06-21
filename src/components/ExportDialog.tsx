import { useState } from 'react';
import { X, Download, Check, Printer } from 'lucide-react';
import { CATEGORIES } from '@/constants';
import type { CategoryType, BoxRecord } from '@/types';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  records: BoxRecord[];
}

export default function ExportDialog({ isOpen, onClose, records }: ExportDialogProps) {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryType | 'all'>>(new Set(['all']));
  const [isExporting, setIsExporting] = useState(false);

  const exportableCategories = CATEGORIES.filter(c => c.key !== 'all');

  const handleCategoryToggle = (categoryKey: CategoryType | 'all') => {
    const newSelected = new Set(selectedCategories);
    
    if (categoryKey === 'all') {
      if (newSelected.has('all')) {
        newSelected.clear();
      } else {
        newSelected.clear();
        newSelected.add('all');
        exportableCategories.forEach(c => newSelected.add(c.key as CategoryType));
      }
    } else {
      if (newSelected.has(categoryKey)) {
        newSelected.delete(categoryKey);
        newSelected.delete('all');
      } else {
        newSelected.add(categoryKey);
        const allSelected = exportableCategories.every(c => newSelected.has(c.key as CategoryType));
        if (allSelected) {
          newSelected.add('all');
        }
      }
    }
    
    setSelectedCategories(newSelected);
  };

  const getSelectedCount = () => {
    if (selectedCategories.has('all')) return records.length;
    return records.filter(r => selectedCategories.has(r.category)).length;
  };

  const handleExport = () => {
    setIsExporting(true);
    
    const filteredRecords = selectedCategories.has('all')
      ? records
      : records.filter(r => selectedCategories.has(r.category));
    
    const exportData = encodeURIComponent(JSON.stringify({
      records: filteredRecords,
      exportedAt: new Date().toISOString(),
      categories: Array.from(selectedCategories),
    }));
    
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      navigate(`/export?data=${exportData}`);
    }, 500);
  };

  const handlePrint = () => {
    handleExport();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-kraft-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up border border-kraft-100 dark:border-kraft-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-forest-50 dark:bg-forest-900/30 flex items-center justify-center flex-shrink-0">
              <Printer className="w-6 h-6 text-forest-600 dark:text-forest-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-kraft-800 dark:text-kraft-100">导出改造记录</h3>
              <p className="text-xs text-kraft-500">选择要导出的分类范围</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-kraft-400 hover:text-kraft-600 hover:bg-kraft-100 dark:hover:bg-kraft-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-kraft-50 dark:bg-kraft-900/20 border border-kraft-100 dark:border-kraft-800">
            <p className="text-sm font-medium text-kraft-700 dark:text-kraft-200 mb-3">选择导出分类</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCategoryToggle('all')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-200',
                  selectedCategories.has('all')
                    ? 'bg-forest-50 dark:bg-forest-900/30 border-forest-300 dark:border-forest-700 text-forest-700 dark:text-forest-300'
                    : 'bg-white dark:bg-kraft-800 border-kraft-200 dark:border-kraft-700 text-kraft-600 dark:text-kraft-400 hover:border-kraft-300'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded flex items-center justify-center flex-shrink-0',
                  selectedCategories.has('all') ? 'bg-forest-500' : 'border-2 border-current'
                )}>
                  {selectedCategories.has('all') && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium">全部分类</span>
              </button>
              
              {exportableCategories.map((category) => {
                const categoryRecords = records.filter(r => r.category === category.key);
                const isSelected = selectedCategories.has(category.key as CategoryType);
                
                return (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryToggle(category.key as CategoryType)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-200',
                      isSelected
                        ? 'bg-forest-50 dark:bg-forest-900/30 border-forest-300 dark:border-forest-700 text-forest-700 dark:text-forest-300'
                        : 'bg-white dark:bg-kraft-800 border-kraft-200 dark:border-kraft-700 text-kraft-600 dark:text-kraft-400 hover:border-kraft-300'
                    )}
                    disabled={categoryRecords.length === 0}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded flex items-center justify-center flex-shrink-0',
                      isSelected ? 'bg-forest-500' : categoryRecords.length === 0 ? 'bg-kraft-100 dark:bg-kraft-700' : 'border-2 border-current'
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium truncate">{category.label}</span>
                    <span className="text-xs opacity-70 ml-auto">({categoryRecords.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-forest-50 dark:bg-forest-900/20 border border-forest-100 dark:border-forest-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-forest-700 dark:text-forest-300">预计导出记录数</span>
              <span className="text-lg font-bold text-forest-600 dark:text-forest-400">
                {getSelectedCount()} 条
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              💡 导出后将生成适合打印的页面，您可以选择直接打印或保存为PDF文件。
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-kraft-600 dark:text-kraft-300 bg-kraft-100 dark:bg-kraft-700 rounded-lg hover:bg-kraft-200 dark:hover:bg-kraft-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handlePrint}
            disabled={getSelectedCount() === 0 || isExporting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-forest-500 rounded-lg hover:bg-forest-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
                </svg>
                生成中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                导出并打印
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
