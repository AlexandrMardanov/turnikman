import type { ExerciseType } from '@/lib/exercise-service';

export type ExerciseTypeOption = { value: ExerciseType; label: string };

export const EXERCISE_TYPE_OPTIONS: ExerciseTypeOption[] = [
  { value: 'weight', label: 'Силова' },
  { value: 'time', label: 'На час' },
  { value: 'emom', label: 'EMOM' },
];
