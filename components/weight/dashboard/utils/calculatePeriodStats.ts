import type { WeightEntry } from '@/lib/weight-service';

export type PeriodStats = {
  startWeight: number | null;
  endWeight: number | null;
  change: number | null;
  changePercent: number | null;
};

export function calculatePeriodStats(entries: WeightEntry[]): PeriodStats {
  if (entries.length === 0) {
    return {
      startWeight: null,
      endWeight: null,
      change: null,
      changePercent: null,
    };
  }

  // Entries are sorted by date descending (newest first)
  const endWeight = entries[0].weight;
  const startWeight = entries[entries.length - 1].weight;
  const change = endWeight - startWeight;
  const changePercent = (change / startWeight) * 100;

  return {
    startWeight,
    endWeight,
    change,
    changePercent,
  };
}
