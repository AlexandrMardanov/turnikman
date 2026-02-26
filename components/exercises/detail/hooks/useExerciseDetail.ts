import { useCallback, useEffect, useState } from 'react';

import { type Exercise, type ExerciseLog, getExercise, getExerciseLogs } from '@/lib/exercise-service';

export function useExerciseDetail(exerciseId: string) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [exercise, logs] = await Promise.all([getExercise(exerciseId), getExerciseLogs(exerciseId)]);
      setExercise(exercise);
      setLogs(logs);
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    exercise,
    logs,
    loading,
    error,
    refresh: loadData,
  };
}
