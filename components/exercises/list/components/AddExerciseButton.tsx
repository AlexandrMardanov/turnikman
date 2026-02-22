import { useRouter } from 'expo-router';

import { HeaderIconButton } from '@/components/shared/HeaderIconButton';

export function AddExerciseButton() {
  const router = useRouter();

  function handlePress() {
    router.push('/(tabs)/(exercises)/add-edit');
  }

  return <HeaderIconButton iconName='add-outline' onPress={handlePress} />;
}
