import { useState } from 'react';

import type { Difficulty, ExerciseFilters, ExerciseType, MuscleGroup } from '@/lib/exercise-service';

export function useExerciseFilters() {
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [type, setType] = useState<ExerciseType | null>(null);

  function toggleMuscleGroup(value: MuscleGroup) {
    setMuscleGroup((prev) => (prev === value ? null : value));
  }

  function toggleDifficulty(value: Difficulty) {
    setDifficulty((prev) => (prev === value ? null : value));
  }

  function toggleType(value: ExerciseType) {
    setType((prev) => (prev === value ? null : value));
  }

  function clearAll() {
    setMuscleGroup(null);
    setDifficulty(null);
    setType(null);
  }

  const filters: ExerciseFilters = { muscleGroup, difficulty, type };

  return {
    filters,
    muscleGroup,
    difficulty,
    type,
    toggleMuscleGroup,
    toggleDifficulty,
    toggleType,
    clearAll,
  };
}
