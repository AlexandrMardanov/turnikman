import type { ExerciseType } from '@/lib/exercise-service';

import { EXERCISE_TYPE_OPTIONS } from '../constants/exerciseTypes';

export function formatExerciseType(type: ExerciseType): string {
  return EXERCISE_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}
