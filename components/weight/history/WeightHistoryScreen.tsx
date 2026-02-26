import { FlatList, RefreshControl } from 'react-native';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { COLORS } from '@/constants/colors';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

import { EmptyState } from '../shared/components/EmptyState';
import { WeightEntryItem } from '../shared/components/WeightEntryItem';
import { useWeightData } from '../shared/hooks/useWeightData';

export function WeightHistoryScreen() {
  const { entriesWithChanges, loading, error, deleteEntry, refresh } = useWeightData();

  useRefreshOnFocus(refresh);

  if (loading && entriesWithChanges.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (entriesWithChanges.length === 0) {
    return <EmptyState title='Немає записів' message='Почніть відстежувати свою вагу, щоб бачити прогрес' />;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={entriesWithChanges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WeightEntryItem entry={item} change={item.change} onDelete={deleteEntry} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.accent.primary} />}
      />
    </ScreenContainer>
  );
}
