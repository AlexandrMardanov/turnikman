import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { Exercise } from '@/lib/exercise-service';

import { getGoalUnit } from '../utils/getGoalUnit';

type ExerciseGoalBadgeProps = {
  exercise: Exercise;
};

export function ExerciseGoalBadge(props: ExerciseGoalBadgeProps) {
  const { exercise } = props;

  if (!exercise.goal_value) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Ionicons name='flag-outline' size={11} color={COLORS.text.secondary} />
      <Text style={styles.text}>
        {exercise.goal_value} {getGoalUnit(exercise.type)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
});
