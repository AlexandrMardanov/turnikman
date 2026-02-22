import type { Difficulty } from '@/lib/exercise-service';

export type DifficultyOption = { value: Difficulty; label: string };

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: 'easy', label: 'Легка' },
  { value: 'medium', label: 'Середня' },
  { value: 'hard', label: 'Важка' },
];
