import type { Difficulty } from '@/lib/exercise-service';

const DIFFICULTY_DOTS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function getDifficultyDots(difficulty: Difficulty): number {
  return DIFFICULTY_DOTS[difficulty];
}
