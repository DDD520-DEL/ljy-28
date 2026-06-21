import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellOff,
  ArrowLeft,
  Clock,
  Calendar,
  Check,
  Play,
  AlertCircle,
} from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { useReminder } from '@/hooks/useReminder';
import { WEEKDAY_OPTIONS, WEEKDAY_LABELS } from '@/constants';
import { toast } from '@/components/Toast';
import { cn } from '@/lib/utils';
import type { Weekday } from '@/types';

export default function ReminderSettings() {
  const navigate = useNavigate();
  const { reminderSettings, updateReminderSettings } = useBoxStore();
  const { requestNotificationPermission, testNotification } = useReminder();

  const [enabled, setEnabled] = useState(reminderSettings.enabled);
  const [weekdays, setWeekdays] = useState<Weekday[]>(reminderSettings.weekdays);
  const [time, setTime] = useState(reminderSettings.time);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission('unsupported');
    }
  }, []);

  const toggleWeekday = (day: Weekday) => {
    if (weekdays.includes(day)) {
      setWeekdays(weekdays.filter((d) => d !== day));
    } else {
      setWeekdays([...weekdays, day]);
    }
  };

  const handleSave = () => {
    if (enabled && weekdays.length === 0) {
      toast.error('请至少选择一天');
      return;
    }
    updateReminderSettings({
      enabled,
      weekdays: weekdays.sort((a, b) => a - b),
      time,
    });
  };

  const handleToggleEnabled = async (newValue: boolean) => {
    if (newValue) {
      if (notificationPermission === 'denied') {
        toast.error('通知权限已被拒绝，请在浏览器设置中开启通知权限');
        return;
      }
      if (notificationPermission === 'default') {
        const granted = await requestNotificationPermission();
        if (!granted) {
          toast.error('需要通知权限才能使用提醒功能');
          setNotificationPermission('denied');
          return;
        }
        setNotificationPermission('granted');
      }
    }
    setEnabled(newValue);
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    try {
      const success = await testNotification();
      if (success) {
        toast.success('测试通知已发送');
      } else if (notificationPermission === 'denied') {
        toast.error('通知权限已被拒绝，请在浏览器设置中开启');
      } else {
        toast.error('发送测试通知失败，请检查通知权限');
      }
    } catch {
      toast.error('发送测试通知失败');
    } finally {
      setIsTesting(false);
    }
  };

  const hasChanges =
    enabled !== reminderSettings.enabled ||
    weekdays.sort().join(',') !== [...reminderSettings.weekdays].sort().join(',') ||
    time !== reminderSettings.time;

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col transition-colors duration-300">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-corrugate opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper-cream/80 via-paper-cream/60 to-paper-cream" />
        
        <div className="relative container py-8 md:py-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper-white/80 backdrop-blur-sm border border-kraft-200 text-kraft-600 hover:text-kraft-800 hover:bg-paper-white hover:border-kraft-300 hover:shadow-paper transition-all duration-200"
              title="返回"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-kraft-800 flex items-center gap-3">
                <Bell className="w-7 h-7 text-kraft-500" />
                提醒设置
              </h1>
              <p className="text-sm text-kraft-500 mt-1">设置每周创意提醒时间</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-16 flex-1">
        <div className="max-w-2xl mx-auto space-y-6">
          {notificationPermission === 'denied' && (
            <div className="card-paper p-4 animate-fade-in-up border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">通知权限已被拒绝</p>
                  <p className="text-xs text-amber-600 mt-1">
                    请在浏览器设置中允许本网站发送通知，才能使用提醒功能
                  </p>
                </div>
              </div>
            </div>
          )}

          {notificationPermission === 'unsupported' && (
            <div className="card-paper p-4 animate-fade-in-up border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">浏览器不支持通知</p>
                  <p className="text-xs text-amber-600 mt-1">
                    您的浏览器不支持桌面通知功能，无法使用提醒
                  </p>
                </div>
              </div>
            </div>
          )}

          <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-kraft-50 flex items-center justify-center">
                  {enabled ? (
                    <Bell className="w-5 h-5 text-kraft-600" />
                  ) : (
                    <BellOff className="w-5 h-5 text-kraft-400" />
                  )}
                </span>
                <div>
                  <p className="font-medium text-kraft-700">每周提醒</p>
                  <p className="text-sm text-kraft-500 mt-0.5">
                    {enabled ? '已开启每周创意提醒' : '开启后将定期推送改造创意'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggleEnabled(!enabled)}
                className={cn(
                  'relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-kraft-400 focus:ring-offset-2',
                  enabled ? 'bg-kraft-600' : 'bg-kraft-200'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out',
                    enabled ? 'translate-x-6' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </section>

          {enabled && (
            <>
              <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold text-kraft-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-kraft-500" />
                  选择星期
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {WEEKDAY_OPTIONS.map((day) => {
                    const isSelected = weekdays.includes(day.key as Weekday);
                    return (
                      <button
                        key={day.key}
                        onClick={() => toggleWeekday(day.key as Weekday)}
                        className={cn(
                          'aspect-square rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center',
                          isSelected
                            ? 'bg-kraft-500 text-white shadow-paper hover:bg-kraft-600'
                            : 'bg-kraft-50 text-kraft-600 hover:bg-kraft-100 border border-kraft-200'
                        )}
                      >
                        {isSelected && <Check className="w-4 h-4" />}
                        {!isSelected && day.label.slice(1)}
                      </button>
                    );
                  })}
                </div>
                {weekdays.length > 0 && (
                  <p className="text-sm text-kraft-500 mt-4">
                    已选择：{weekdays.sort((a, b) => {
                      if (a === 0) return 1;
                      if (b === 0) return -1;
                      return a - b;
                    }).map((d) => WEEKDAY_LABELS[d]).join('、')}
                  </p>
                )}
              </section>

              <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-lg font-semibold text-kraft-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-kraft-500" />
                  提醒时间
                </h2>
                <div className="flex items-center gap-4">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-4 py-3 bg-kraft-50 border-2 border-kraft-200 rounded-xl text-kraft-800 font-medium text-lg focus:outline-none focus:border-kraft-400 focus:ring-4 focus:ring-kraft-100 transition-all duration-200"
                  />
                  <p className="text-sm text-kraft-500">
                    将在选定日期的这个时间推送提醒
                  </p>
                </div>
              </section>

              <section className="card-paper p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-lg font-semibold text-kraft-800 mb-4">测试通知</h2>
                <p className="text-sm text-kraft-500 mb-4">
                  点击下方按钮发送一条测试通知，确认提醒功能正常工作
                </p>
                <button
                  onClick={handleTestNotification}
                  disabled={isTesting || notificationPermission !== 'granted'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-50 text-forest-600 rounded-xl font-medium border border-forest-200 hover:bg-forest-100 hover:border-forest-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
                      </svg>
                      发送中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      发送测试通知
                    </>
                  )}
                </button>
              </section>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-5 py-3.5 bg-kraft-100 text-kraft-600 rounded-xl font-medium hover:bg-kraft-200 transition-all duration-200"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || (enabled && weekdays.length === 0)}
              className="flex-1 px-5 py-3.5 bg-kraft-500 text-white rounded-xl font-medium hover:bg-kraft-600 transition-all duration-200 shadow-paper hover:shadow-paper-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              保存设置
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
