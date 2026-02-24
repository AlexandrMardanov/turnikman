import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { type Exercise, type ExerciseLog, getExercise, getExerciseLogs } from '@/lib/exercise-service';

export function useExerciseDetail(exerciseId: string) {
  const { user } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [exercise, logs] = await Promise.all([getExercise(exerciseId), getExerciseLogs(user.id, exerciseId)]);
      setExercise(exercise);
      setLogs(logs);
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [exerciseId, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    exercise,
    logs,
    loading,
    error,
  };
}
