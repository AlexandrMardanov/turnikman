import { useLocalSearchParams } from 'expo-router';

import { ExerciseDetailScreen } from '@/components/exercises/detail/ExerciseDetailScreen';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

export default function ExerciseDetail() {
  const params = useLocalSearchParams<{ id: string }>();

  useTabBarVisibility(false);

  return <ExerciseDetailScreen id={params.id} />;
}
