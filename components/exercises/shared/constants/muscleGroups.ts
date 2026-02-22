import type { MuscleGroup } from '@/lib/exercise-service';

export type MuscleGroupOption = { value: MuscleGroup; label: string };

export const MUSCLE_GROUP_OPTIONS: MuscleGroupOption[] = [
  { value: 'back', label: 'Спина' },
  { value: 'chest', label: 'Груди' },
  { value: 'legs', label: 'Ноги' },
  { value: 'abs', label: 'Прес' },
  { value: 'shoulders', label: 'Плечі' },
  { value: 'arms', label: 'Руки' },
];
