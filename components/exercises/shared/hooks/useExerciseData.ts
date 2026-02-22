import { useCallback, useEffect, useState } from 'react';

import {
  type Exercise,
  type ExerciseCreate,
  type ExerciseFilters,
  type ExerciseUpdate,
  addExercise,
  deleteExercise,
  getExercises,
  updateExercise,
} from '@/lib/exercise-service';

export function useExerciseData(filters?: ExerciseFilters) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const muscleGroup = filters?.muscleGroup ?? null;
  const difficulty = filters?.difficulty ?? null;
  const type = filters?.type ?? null;

  const loadExercises = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }
        setError(null);
        const activeFilters: ExerciseFilters = { muscleGroup, difficulty, type };
        const data = await getExercises(activeFilters);
        setExercises(data);
      } catch (err) {
        const message = (err as Error).message;
        setError(message);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [muscleGroup, difficulty, type]
  );

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const addExerciseEntry = useCallback(
    async (data: ExerciseCreate): Promise<Exercise> => {
      const newExercise = await addExercise(data);
      await loadExercises(false);

      return newExercise;
    },
    [loadExercises]
  );

  const updateExerciseEntry = useCallback(
    async (id: string, data: ExerciseUpdate): Promise<Exercise> => {
      const updated = await updateExercise(id, data);
      await loadExercises(false);

      return updated;
    },
    [loadExercises]
  );

  const deleteExerciseEntry = useCallback(
    async (id: string): Promise<void> => {
      await deleteExercise(id);
      await loadExercises(false);
    },
    [loadExercises]
  );

  const refresh = useCallback(() => {
    loadExercises(false);
  }, [loadExercises]);

  return {
    exercises,
    loading,
    error,
    addExercise: addExerciseEntry,
    updateExercise: updateExerciseEntry,
    deleteExercise: deleteExerciseEntry,
    refresh,
  };
}
