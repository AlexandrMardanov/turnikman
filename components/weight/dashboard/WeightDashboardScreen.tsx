import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useFocusEffect, useRouter } from 'expo-router';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { useWeightReminderContext } from '@/contexts/WeightReminderContext';

import { EmptyState } from '../shared/components/EmptyState';
import { type PeriodFilter as PeriodFilterType, useWeightData } from '../shared/hooks/useWeightData';
import { PeriodFilter } from './components/PeriodFilter';
import { PeriodStats } from './components/PeriodStats';
import { RecentEntriesSection } from './components/RecentEntriesSection';
import { WeightChart } from './components/WeightChart';
import { WeightReminder } from './components/WeightReminder';
import { RECENT_ENTRIES_LIMIT } from './constants/recentEntriesLimit';
import { calculatePeriodStats } from './utils/calculatePeriodStats';

export function WeightDashboardScreen() {
  const router = useRouter();
  const { entries, entriesWithChanges, loading, error, filterByPeriod, deleteEntry, refresh } = useWeightData();
  const { shouldShowBadge } = useWeightReminderContext();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilterType>('month');

  useFocusEffect(() => {
    refresh();
  });

  const filteredEntries = filterByPeriod(selectedPeriod);
  const recentEntries = entriesWithChanges.slice(0, RECENT_ENTRIES_LIMIT);
  const periodStats = calculatePeriodStats(filteredEntries);

  function handleShowHistory() {
    router.push('/(tabs)/(weight)/history');
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (entries.length === 0) {
    return <EmptyState title='Немає записів' message='Почніть відстежувати свою вагу, щоб бачити прогрес' />;
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {shouldShowBadge && (
        <View style={styles.reminderContainer}>
          <WeightReminder />
        </View>
      )}
      <View style={styles.periodFilterContainer}>
        <PeriodFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
      </View>
      <View style={styles.chartContainer}>
        <WeightChart entries={filteredEntries} />
      </View>
      <View style={styles.statsContainer}>
        <PeriodStats stats={periodStats} />
      </View>
      <RecentEntriesSection
        entries={recentEntries}
        totalCount={entries.length}
        onShowAll={handleShowHistory}
        onDelete={deleteEntry}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 24,
  },
  reminderContainer: {
    marginBottom: 16,
  },
  periodFilterContainer: {
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
});
