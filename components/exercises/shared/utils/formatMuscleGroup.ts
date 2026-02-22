import type { MuscleGroup } from '@/lib/exercise-service';

import { MUSCLE_GROUP_OPTIONS } from '../constants/muscleGroups';

export function formatMuscleGroup(muscleGroup: MuscleGroup): string {
  return MUSCLE_GROUP_OPTIONS.find((o) => o.value === muscleGroup)?.label ?? muscleGroup;
}
