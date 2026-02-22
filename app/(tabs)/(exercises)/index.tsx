import { StyleSheet, View } from 'react-native';

import { ExerciseListScreen } from '@/components/exercises/list/ExerciseListScreen';
import { AddExerciseButton } from '@/components/exercises/list/components/AddExerciseButton';
import { FilterButton } from '@/components/exercises/list/components/FilterButton';
import { useFilterSheet } from '@/components/exercises/shared/hooks/useFilterSheet';
import { useScreenOptions } from '@/hooks/useScreenOptions';

export default function ExercisesIndex() {
  const { isFilterOpen, activeCount, setActiveCount, handleOpenFilter, handleCloseFilter } = useFilterSheet();

  useScreenOptions({
    title: 'Вправи',
    headerRight: () => (
      <View style={styles.headerRight}>
        <FilterButton onPress={handleOpenFilter} activeCount={activeCount} />
        <AddExerciseButton />
      </View>
    ),
  });

  return (
    <ExerciseListScreen
      isFilterOpen={isFilterOpen}
      onFilterClose={handleCloseFilter}
      onActiveCountChange={setActiveCount}
    />
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
