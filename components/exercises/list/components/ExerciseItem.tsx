import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { Exercise } from '@/lib/exercise-service';

import { DifficultyBars } from '../../shared/components/DifficultyBars';
import { formatExerciseType } from '../../shared/utils/formatExerciseType';
import { formatMuscleGroup } from '../../shared/utils/formatMuscleGroup';

type ExerciseItemProps = {
  exercise: Exercise;
};

export function ExerciseItem(props: ExerciseItemProps) {
  const { exercise } = props;
  const router = useRouter();

  function handlePress() {
    router.push(`/(tabs)/(exercises)/${exercise.id}`);
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
      </View>
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatMuscleGroup(exercise.muscle_group)}</Text>
        </View>
        <View style={styles.badge}>
          <DifficultyBars difficulty={exercise.difficulty} />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatExerciseType(exercise.type)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
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
});
