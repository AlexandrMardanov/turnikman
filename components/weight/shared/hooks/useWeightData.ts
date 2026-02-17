import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useWeightReminderContext } from '@/contexts/WeightReminderContext';
import {
  type WeightEntry,
  type WeightEntryCreate,
  type WeightEntryUpdate,
  addWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
  updateWeightEntry,
} from '@/lib/weight-service';

import { MAX_CHART_POINTS } from '../constants/maxChartPoints';
import { aggregateEntries } from '../utils/aggregateEntries';
import { calculateWeightChanges } from '../utils/calculateWeightChanges';
import { type PeriodFilter, filterEntriesByPeriod } from '../utils/filterEntriesByPeriod';

export type { PeriodFilter };

export function useWeightData() {
  const { user } = useAuth();
  const { refresh: refreshReminder } = useWeightReminderContext();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(
    async (showLoader = true) => {
      if (!user?.id) {
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }
        setError(null);
        const data = await getWeightEntries(user.id);
        setEntries(data);
      } catch (err) {
        Alert.alert('Помилка', (err as Error).message);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [user?.id]
  );

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  function filterByPeriod(period: PeriodFilter): WeightEntry[] {
    const filtered = filterEntriesByPeriod(entries, period);
    return aggregateEntries(filtered, MAX_CHART_POINTS);
  }

  function getEntriesWithChanges(filteredEntries: WeightEntry[]) {
    return calculateWeightChanges(filteredEntries);
  }

  const addEntry = useCallback(
    async (data: WeightEntryCreate) => {
      if (!user?.id) {
        throw new Error('Користувач не авторизований');
      }

      try {
        await addWeightEntry(data);
        await loadEntries();
        refreshReminder();
      } catch (err) {
        throw err;
      }
    },
    [user?.id, loadEntries, refreshReminder]
  );

  const updateEntry = useCallback(
    async (id: string, data: WeightEntryUpdate) => {
      try {
        await updateWeightEntry(id, data);
        await loadEntries();
        refreshReminder();
      } catch (err) {
        throw err;
      }
    },
    [loadEntries, refreshReminder]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        await deleteWeightEntry(id);
        await loadEntries();
        refreshReminder();
      } catch (err) {
        throw err;
      }
    },
    [loadEntries, refreshReminder]
  );

  const entriesWithChanges = getEntriesWithChanges(entries);

  const refresh = useCallback(() => {
    loadEntries(false); // Silent refresh without loader
  }, [loadEntries]);

  return {
    entries,
    entriesWithChanges,
    loading,
    error,
    filterByPeriod,
    addEntry,
    updateEntry,
    deleteEntry,
    refresh,
  };
}
