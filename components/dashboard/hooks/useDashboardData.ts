import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { type WeightEntry, getWeightEntries } from '@/lib/weight-service';

export type DashboardWeightData = {
  currentWeight: number;
  currentDate: string;
  monthChange: number | null;
  monthChangePercent: number | null;
  lastMonthEntries: WeightEntry[];
  average: number;
  min: number;
  max: number;
  count: number;
  allEntries: WeightEntry[];
  periodStart: string;
  periodEnd: string;
};

export function useDashboardData() {
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<DashboardWeightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (showLoader = true) => {
      if (!user?.id) {
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError(null);
        const entries = await getWeightEntries(user.id);

        if (entries.length === 0) {
          setWeightData(null);
          return;
        }

        // Get current weight (latest entry)
        const currentEntry = entries[0];

        // Get entries from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const lastMonth = entries.filter((entry) => new Date(entry.date) >= thirtyDaysAgo);

        // Calculate month change
        let monthChange: number | null = null;
        let monthChangePercent: number | null = null;

        if (lastMonth.length > 1) {
          const oldestInMonth = lastMonth[lastMonth.length - 1];
          monthChange = currentEntry.weight - oldestInMonth.weight;
          monthChangePercent = (monthChange / oldestInMonth.weight) * 100;
        }

        // Calculate statistics
        const weights = lastMonth.map((e) => e.weight);
        const average = weights.reduce((sum, w) => sum + w, 0) / weights.length;
        const min = Math.min(...weights);
        const max = Math.max(...weights);

        setWeightData({
          currentWeight: currentEntry.weight,
          currentDate: currentEntry.date,
          monthChange,
          monthChangePercent,
          lastMonthEntries: lastMonth.slice().reverse(), // Reverse for chart (oldest to newest)
          average,
          min,
          max,
          count: lastMonth.length,
          allEntries: entries,
          periodStart: thirtyDaysAgo.toISOString().split('T')[0],
          periodEnd: new Date().toISOString().split('T')[0],
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [user?.id]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData(false); // Silent refresh without loader
  }, [loadData]);

  return {
    weightData,
    loading,
    error,
    refresh,
  };
}
