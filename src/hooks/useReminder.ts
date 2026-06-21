import { useEffect, useCallback, useRef } from 'react';
import { useBoxStore } from '@/store/useBoxStore';
import { CREATIVE_IDEAS, WEEKDAY_LABELS } from '@/constants';
import type { ReminderSettings, Weekday } from '@/types';

const NOTIFICATION_TITLE = '📦 纸箱改造创意提醒';

function getRandomIdea(): string {
  const randomIndex = Math.floor(Math.random() * CREATIVE_IDEAS.length);
  return CREATIVE_IDEAS[randomIndex];
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function shouldTriggerReminder(settings: ReminderSettings, now: Date): boolean {
  if (!settings.enabled) return false;
  if (settings.weekdays.length === 0) return false;

  const currentWeekday = now.getDay() as Weekday;
  if (!settings.weekdays.includes(currentWeekday)) return false;

  const { hours, minutes } = parseTime(settings.time);
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  if (currentHours > hours) return true;
  if (currentHours === hours && currentMinutes >= minutes) return true;

  return false;
}

export function useReminder() {
  const { reminderSettings, markReminderTriggered } = useBoxStore();
  const checkIntervalRef = useRef<number | null>(null);
  const hasTriggeredTodayRef = useRef(false);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }, []);

  const sendNotification = useCallback((body: string) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(NOTIFICATION_TITLE, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'box-creative-reminder',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => {
        notification.close();
      }, 10000);
    } catch (e) {
      console.error('发送通知失败:', e);
    }
  }, []);

  const checkAndTrigger = useCallback(() => {
    const now = new Date();
    
    if (hasTriggeredTodayRef.current) {
      const lastTriggered = reminderSettings.lastTriggeredAt;
      if (lastTriggered) {
        const lastDate = new Date(lastTriggered);
        if (isSameDay(now, lastDate)) {
          return;
        }
      }
    }

    if (shouldTriggerReminder(reminderSettings, now)) {
      const idea = getRandomIdea();
      sendNotification(idea);
      markReminderTriggered();
      hasTriggeredTodayRef.current = true;
    }
  }, [reminderSettings, sendNotification, markReminderTriggered]);

  const getNextReminderText = useCallback((): string => {
    if (!reminderSettings.enabled) {
      return '提醒已关闭';
    }
    if (reminderSettings.weekdays.length === 0) {
      return '未设置提醒日期';
    }
    const weekdayNames = reminderSettings.weekdays
      .sort((a, b) => {
        if (a === 0) return 1;
        if (b === 0) return -1;
        return a - b;
      })
      .map((d) => WEEKDAY_LABELS[d]);
    return `每周${weekdayNames.join('、')} ${reminderSettings.time} 提醒`;
  }, [reminderSettings]);

  const testNotification = useCallback(async () => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return false;
    }
    const idea = getRandomIdea();
    sendNotification(idea);
    return true;
  }, [requestNotificationPermission, sendNotification]);

  useEffect(() => {
    if (!reminderSettings.enabled) {
      hasTriggeredTodayRef.current = false;
    }
  }, [reminderSettings.enabled]);

  useEffect(() => {
    if (reminderSettings.enabled) {
      checkAndTrigger();
      
      checkIntervalRef.current = window.setInterval(() => {
        checkAndTrigger();
      }, 60 * 1000);

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [reminderSettings.enabled, checkAndTrigger]);

  return {
    requestNotificationPermission,
    getNextReminderText,
    testNotification,
  };
}
