import type { Difficulty, ExerciseType, MuscleGroup } from '@/lib/exercise-service';

export type ExerciseValidationResult = { isValid: true } | { isValid: false; error: string };

export function validateExerciseInput(
  name: string,
  type: ExerciseType,
  muscleGroup: MuscleGroup,
  difficulty: Difficulty
): ExerciseValidationResult {
  if (!name.trim()) {
    return { isValid: false, error: 'Введіть назву вправи' };
  }

  if (!type) {
    return { isValid: false, error: 'Оберіть тип вправи' };
  }

  if (!muscleGroup) {
    return { isValid: false, error: "Оберіть групу м'язів" };
  }

  if (!difficulty) {
    return { isValid: false, error: 'Оберіть складність' };
  }

  return { isValid: true };
}
