import type { Difficulty } from '@/lib/exercise-service';

import { DIFFICULTY_OPTIONS } from '../constants/difficulties';

export function formatDifficulty(difficulty: Difficulty): string {
  return DIFFICULTY_OPTIONS.find((o) => o.value === difficulty)?.label ?? difficulty;
}
