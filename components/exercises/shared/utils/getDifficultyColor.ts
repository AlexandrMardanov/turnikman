import { COLORS } from '@/constants/colors';
import type { Difficulty } from '@/lib/exercise-service';

export function getDifficultyColor(difficulty: Difficulty): string {
  if (difficulty === 'easy') {
    return COLORS.accent.success;
  }

  if (difficulty === 'hard') {
    return COLORS.accent.danger;
  }

  return COLORS.accent.primary;
}
