import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Package,
  Leaf,
  Printer,
  Bell,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useBoxStore } from '@/store/useBoxStore';
import { useReminder } from '@/hooks/useReminder';
import { toast } from '@/components/Toast';
import { cn } from '@/lib/utils';
import ExportDialog from '@/components/ExportDialog';

const APP_NAME = '纸箱创意日志';
const APP_VERSION = '0.0.0';
const ECO_SLOGAN = '🌿 每一个纸箱的重生，都是对地球的一份温柔守护';

export default function Settings() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { clearAllData, records, favorites, reminderSettings } = useBoxStore();
  const { getNextReminderText } = useReminder();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const totalItems = records.length + favorites.length;

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      clearAllData();
      window.location.href = '/';
    } catch {
      toast.error('清除数据失败，请重试');
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col transition-colors duration-300">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-corrugate opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/80 via-paper-cream/60 to-paper-cream" />
        
        <div className="relative container py-8 md:py-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper-white/80 backdrop-blur-sm border border-kraft-200 text-kraft-600 hover:text-kraft-800 hover:bg-paper-white hover:border-kraft-300 hover:shadow-paper transition-all duration-200 dark:bg-white/5 dark:border-kraft-700 dark:text-kraft-400 dark:hover:bg-white/10 dark:hover:text-kraft-200"
              title="返回"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-kraft-800 dark:text-kraft-100 flex items-center gap-3">
                <SettingsIcon className="w-7 h-7 text-kraft-500" />
                设置
              </h1>
              <p className="text-sm text-kraft-500 mt-1">个性化你的使用体验</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-16 flex-1">
        <div className="max-w-2xl mx-auto space-y-6">
          <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-semibold text-kraft-800 dark:text-kraft-100 mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-forest-50 dark:bg-forest-900/30 flex items-center justify-center">
                {isDark ? <Moon className="w-4 h-4 text-forest-600 dark:text-forest-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </span>
              外观设置
            </h2>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-kraft-700 dark:text-kraft-200">深色模式</p>
                <p className="text-sm text-kraft-500 mt-0.5">
                  {isDark ? '当前为深色主题，护眼节能' : '当前为浅色主题，清晰明亮'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={cn(
                  'relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-kraft-400 focus:ring-offset-2',
                  isDark ? 'bg-kraft-600' : 'bg-kraft-200'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out',
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  )}
                />
                <span className={cn(
                  'absolute inset-0 flex items-center justify-between px-1.5 text-xs',
                  isDark ? 'text-kraft-300' : 'text-kraft-500'
                )}>
                  <Sun className={cn('w-3.5 h-3.5', !isDark ? 'opacity-0' : 'opacity-100')} />
                  <Moon className={cn('w-3.5 h-3.5', isDark ? 'opacity-0' : 'opacity-100')} />
                </span>
              </button>
            </div>
          </section>

          <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <button
              onClick={() => navigate('/reminder-settings')}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-kraft-50 dark:bg-kraft-900/30 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-kraft-500" />
                </span>
                <div>
                  <p className="font-medium text-kraft-700 dark:text-kraft-200">提醒设置</p>
                  <p className="text-sm text-kraft-500 mt-0.5">
                    {getNextReminderText()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  reminderSettings.enabled
                    ? "bg-forest-50 text-forest-600 dark:bg-forest-900/30 dark:text-forest-400"
                    : "bg-kraft-100 text-kraft-500 dark:bg-kraft-800 dark:text-kraft-400"
                )}>
                  {reminderSettings.enabled ? "已开启" : "未开启"}
                </span>
                <span className="text-kraft-400 dark:text-kraft-500">›</span>
              </div>
            </button>
          </section>

          <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold text-kraft-800 dark:text-kraft-100 mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-500" />
              </span>
              数据管理
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-kraft-50 dark:bg-kraft-900/20 border border-kraft-100 dark:border-kraft-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-kraft-600 dark:text-kraft-400">改造记录</span>
                  <span className="text-sm font-semibold text-kraft-800 dark:text-kraft-200">{records.length} 条</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-kraft-600 dark:text-kraft-400">收藏项目</span>
                  <span className="text-sm font-semibold text-kraft-800 dark:text-kraft-200">{favorites.length} 条</span>
                </div>
              </div>

              <button
                onClick={() => setShowExportDialog(true)}
                disabled={records.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-forest-50 dark:bg-forest-900/20 text-forest-600 dark:text-forest-400 rounded-xl font-medium border border-forest-200 dark:border-forest-800 hover:bg-forest-100 dark:hover:bg-forest-900/30 hover:border-forest-300 dark:hover:border-forest-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="w-5 h-5" />
                导出记录
              </button>

              <button
                onClick={() => setShowClearDialog(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
                清除全部本地数据
              </button>
              <p className="text-xs text-kraft-400 text-center">
                此操作将删除所有记录、收藏和用户信息，且不可恢复
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-10 px-4 border-t border-kraft-100 dark:border-kraft-800">
        <div className="container max-w-2xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-kraft-400 to-kraft-500 flex items-center justify-center shadow-paper">
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-kraft-700 dark:text-kraft-200">{APP_NAME}</span>
          </div>
          <p className="text-sm text-kraft-400">
            版本 <span className="font-medium">{APP_VERSION}</span>
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Leaf className="w-4 h-4 text-forest-500" />
            <p className="text-sm text-kraft-500 dark:text-kraft-400 max-w-md">
              {ECO_SLOGAN}
            </p>
          </div>
        </div>
      </footer>

      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isClearing && setShowClearDialog(false)} />
          <div className="relative bg-white dark:bg-kraft-800 rounded-2xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up border border-kraft-100 dark:border-kraft-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-kraft-800 dark:text-kraft-100">确认清除全部数据？</h3>
                <p className="text-xs text-kraft-500">共 {totalItems} 项内容将被删除</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 mb-6">
              <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span>所有 {records.length} 条改造记录将被永久删除</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span>所有 {favorites.length} 条收藏记录将被清除</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span>版本历史、点赞记录、用户信息将被清除</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span className="font-medium">此操作不可撤销，请谨慎操作</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearDialog(false)}
                disabled={isClearing}
                className="px-4 py-2.5 text-sm font-medium text-kraft-600 dark:text-kraft-300 bg-kraft-100 dark:bg-kraft-700 rounded-lg hover:bg-kraft-200 dark:hover:bg-kraft-600 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isClearing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
                    </svg>
                    清除中...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    确认清除
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        records={records}
      />
    </div>
  );
}
