import { ScrollView, StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

import { EmptyWeightState } from './components/EmptyWeightState';
import { WeightCard } from './components/WeightCard';
import { useDashboardData } from './hooks/useDashboardData';

export function DashboardScreen() {
  const { weightData, loading, error, refresh } = useDashboardData();

  useRefreshOnFocus(refresh);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>{weightData ? <WeightCard data={weightData} /> : <EmptyWeightState />}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
});
