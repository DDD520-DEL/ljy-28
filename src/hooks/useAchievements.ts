import { useMemo } from 'react';
import { useBoxStore } from '@/store/useBoxStore';
import { BADGE_DEFINITIONS } from '@/constants';
import type { BadgeStatus } from '@/types';

const EARNED_BADGES_KEY = 'box_creative_log_earned_badges';

interface EarnedBadgeRecord {
  [badgeId: string]: string;
}

function loadEarnedBadges(): EarnedBadgeRecord {
  try {
    const raw = localStorage.getItem(EARNED_BADGES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as EarnedBadgeRecord;
  } catch {
    return {};
  }
}

function saveEarnedBadges(record: EarnedBadgeRecord): void {
  try {
    localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(record));
  } catch {
    // ignore
  }
}

function getConditionValues(records: ReturnType<typeof useBoxStore.getState>['records'], favorites: string[]) {
  const categoriesCovered = new Set(records.map((r) => r.category)).size;
  const beginnerCount = records.filter((r) => r.difficulty === 'beginner').length;
  const intermediateCount = records.filter((r) => r.difficulty === 'intermediate').length;
  const expertCount = records.filter((r) => r.difficulty === 'expert').length;
  const allDifficulties = [beginnerCount > 0, intermediateCount > 0, expertCount > 0].filter(Boolean).length;
  const materialNames = new Set<string>();
  records.forEach((r) => {
    r.materials?.forEach((m) => {
      materialNames.add(m.name);
    });
  });
  const uniqueMaterials = materialNames.size;
  const favoriteCount = favorites.length;
  const publishedCount = records.filter((r) => r.isPublished).length;
  const totalRecords = records.length;

  return {
    totalRecords,
    categoriesCovered,
    beginnerCount,
    intermediateCount,
    expertCount,
    allDifficulties,
    uniqueMaterials,
    favoriteCount,
    publishedCount,
  };
}

function parseCondition(condition: string): { key: string; target: number } {
  const match = condition.match(/^(\w+)\s*>=\s*(\d+)$/);
  if (!match) return { key: condition, target: 0 };
  return { key: match[1], target: parseInt(match[2], 10) };
}

export function useAchievements() {
  const records = useBoxStore((s) => s.records);
  const favorites = useBoxStore((s) => s.favorites);

  const { badges, earnedCount, totalCount, earnedRecord } = useMemo(() => {
    const values = getConditionValues(records, favorites);
    const earnedRecord = loadEarnedBadges();
    let hasNew = false;

    const badges: BadgeStatus[] = BADGE_DEFINITIONS.map((def) => {
      const { key, target } = parseCondition(def.condition);
      const progress = (values as Record<string, number>)[key] ?? 0;
      const earned = progress >= target;

      if (earned && !earnedRecord[def.id]) {
        earnedRecord[def.id] = new Date().toISOString();
        hasNew = true;
      }

      return {
        badge: def,
        earned,
        earnedAt: earnedRecord[def.id] || null,
        progress: Math.min(progress, target),
        target,
      };
    });

    if (hasNew) {
      saveEarnedBadges(earnedRecord);
    }

    const earnedCount = badges.filter((b) => b.earned).length;
    return { badges, earnedCount, totalCount: badges.length, earnedRecord };
  }, [records, favorites]);

  return { badges, earnedCount, totalCount, earnedRecord };
}
