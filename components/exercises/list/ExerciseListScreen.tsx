import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

import { useExerciseData } from '../shared/hooks/useExerciseData';
import { ExerciseItem } from './components/ExerciseItem';
import { FilterBottomSheet } from './components/FilterBottomSheet';
import { useExerciseFilters } from './hooks/useExerciseFilters';

type ExerciseListScreenProps = {
  isFilterOpen: boolean;
  onFilterClose: () => void;
  onActiveCountChange: (count: number) => void;
};

export function ExerciseListScreen(props: ExerciseListScreenProps) {
  const { isFilterOpen, onFilterClose, onActiveCountChange } = props;

  const { filters, muscleGroup, difficulty, type, toggleMuscleGroup, toggleDifficulty, toggleType, clearAll } =
    useExerciseFilters();
  const { exercises, loading, error, refresh } = useExerciseData(filters);

  const activeCount = [muscleGroup, difficulty, type].filter(Boolean).length;

  useEffect(() => {
    onActiveCountChange(activeCount);
  }, [activeCount, onActiveCountChange]);

  useRefreshOnFocus(refresh);

  function renderContent() {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    return (
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExerciseItem exercise={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Вправ не знайдено</Text>
            <Text style={styles.emptySubtext}>Спробуйте змінити фільтри або додайте нову вправу</Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderContent()}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        muscleGroup={muscleGroup}
        difficulty={difficulty}
        type={type}
        onToggleMuscleGroup={toggleMuscleGroup}
        onToggleDifficulty={toggleDifficulty}
        onToggleType={toggleType}
        onClose={onFilterClose}
        onClearAll={clearAll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
