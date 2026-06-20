import { useState } from 'react';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils';
import { toast } from '@/components/Toast';

export default function SyncStatusBar() {
  const {
    user,
    syncStatus,
    lastSyncAt,
    uploadToCloud,
    downloadFromCloud,
    login,
    logout,
  } = useBoxStore();

  const [showLoginInput, setShowLoginInput] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isSyncing = syncStatus === 'syncing';

  const handleLogin = async () => {
    if (!loginName.trim()) {
      toast.warning('请输入用户名');
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(loginName.trim());
      setShowLoginInput(false);
      setLoginName('');
    } catch {
      // 错误已在 store 中处理
    } finally {
      setIsLoggingIn(false);
    }
  };

  const statusConfig = {
    idle: {
      icon: Cloud,
      text: lastSyncAt ? `上次同步：${formatDate(lastSyncAt)}` : '未同步',
      color: 'text-kraft-500',
      bgColor: 'bg-kraft-50',
    },
    syncing: {
      icon: Loader2,
      text: '同步中...',
      color: 'text-kraft-500',
      bgColor: 'bg-kraft-50',
    },
    success: {
      icon: CheckCircle,
      text: '同步成功',
      color: 'text-forest-600',
      bgColor: 'bg-forest-50',
    },
    error: {
      icon: AlertTriangle,
      text: '同步失败',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    conflict: {
      icon: AlertTriangle,
      text: '存在冲突',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  };

  const currentStatus = statusConfig[syncStatus];
  const StatusIcon = currentStatus.icon;

  if (!user) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border-t border-kraft-100">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-kraft-100 flex items-center justify-center">
                <User className="w-4 h-4 text-kraft-400" />
              </div>
              <span className="text-sm text-kraft-500">未登录，数据仅保存在本地</span>
            </div>
            {showLoginInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="输入用户名"
                  className="px-3 py-1.5 text-sm border border-kraft-200 rounded-lg focus:outline-none focus:border-kraft-400 focus:ring-2 focus:ring-kraft-100"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  autoFocus
                />
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-kraft-500 rounded-lg hover:bg-kraft-600 transition-colors disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  登录
                </button>
                <button
                  onClick={() => setShowLoginInput(false)}
                  className="text-sm text-kraft-500 hover:text-kraft-700 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginInput(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                登录以启用云同步
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-kraft-100">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                currentStatus.bgColor
              )}
            >
              <StatusIcon
                className={cn(
                  'w-4 h-4',
                  currentStatus.color,
                  isSyncing && 'animate-spin'
                )}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-kraft-700">
                  {user.name}
                </span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    currentStatus.bgColor,
                    currentStatus.color
                  )}
                >
                  {currentStatus.text}
                </span>
              </div>
              {lastSyncAt && syncStatus === 'idle' && (
                <p className="text-xs text-kraft-400 mt-0.5">
                  上次同步：{formatDate(lastSyncAt)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFromCloud()}
              disabled={isSyncing}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                isSyncing
                  ? 'text-kraft-400 bg-kraft-50 cursor-not-allowed'
                  : 'text-kraft-600 bg-kraft-100 hover:bg-kraft-200'
              )}
            >
              <CloudDownload
                className={cn('w-4 h-4', isSyncing && 'opacity-50')}
              />
              从云端拉取
            </button>
            <button
              onClick={() => uploadToCloud()}
              disabled={isSyncing}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                isSyncing
                  ? 'text-white bg-kraft-300 cursor-not-allowed'
                  : 'text-white bg-kraft-500 hover:bg-kraft-600 shadow-sm hover:shadow'
              )}
            >
              <CloudUpload
                className={cn('w-4 h-4', isSyncing && 'animate-pulse')}
              />
              上传到云端
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-kraft-500 hover:text-kraft-700 hover:bg-kraft-50 rounded-lg transition-colors"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
