import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { Exercise } from '@/lib/exercise-service';

import { DifficultyBars } from '../../shared/components/DifficultyBars';
import { formatExerciseType } from '../../shared/utils/formatExerciseType';
import { formatMuscleGroup } from '../../shared/utils/formatMuscleGroup';
import { ExerciseGoalBadge } from './ExerciseGoalBadge';
import { MuscleSection } from './MuscleSection';

type ExerciseInfoProps = {
  exercise: Exercise;
};

export function ExerciseInfo(props: ExerciseInfoProps) {
  const { exercise } = props;

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatMuscleGroup(exercise.muscle_group)}</Text>
        </View>
        <View style={styles.badge}>
          <DifficultyBars difficulty={exercise.difficulty} />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatExerciseType(exercise.type)}</Text>
        </View>
        <ExerciseGoalBadge exercise={exercise} />
      </View>
      {exercise.description && <Text style={styles.description}>{exercise.description}</Text>}
      {exercise.primary_muscles.length > 0 && (
        <MuscleSection label={"Основні м'язи"} muscles={exercise.primary_muscles} />
      )}
      {exercise.secondary_muscles.length > 0 && (
        <MuscleSection label={"Допоміжні м'язи"} muscles={exercise.secondary_muscles} secondary />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
  description: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
});
