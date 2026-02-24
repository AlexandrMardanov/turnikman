import { Exercise } from '@/lib/exercise-service';

export function getGoalUnit(type: Exercise['type']): string {
  if (type === 'time') return 'секунд';

  return 'повторень';
}
