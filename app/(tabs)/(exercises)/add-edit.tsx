import { useLocalSearchParams } from 'expo-router';

import { AddEditExerciseForm } from '@/components/exercises/add-edit/AddEditExerciseForm';
import { DeleteExerciseButton } from '@/components/exercises/add-edit/components/DeleteExerciseButton';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

export default function AddEditExercise() {
  const params = useLocalSearchParams<{ id?: string }>();

  useScreenOptions({
    title: params.id ? 'Редагувати вправу' : 'Нова вправа',
    headerRight: params.id ? () => <DeleteExerciseButton id={params.id!} /> : undefined,
  });
  useTabBarVisibility(false);

  return <AddEditExerciseForm id={params.id} />;
}
