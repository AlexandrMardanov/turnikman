import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { deleteExercise } from '@/lib/exercise-service';

type DeleteExerciseButtonProps = {
  id: string;
};

export function DeleteExerciseButton(props: DeleteExerciseButtonProps) {
  const { id } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handlePress() {
    Alert.alert('Видалити вправу?', 'Цю дію не можна скасувати.', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => {
          setLoading(true);
          deleteExercise(id)
            .then(() => {
              router.dismissTo('/(tabs)/(exercises)');
            })
            .catch((err) => {
              Alert.alert('Помилка', (err as Error).message);
            })
            .finally(() => {
              setLoading(false);
            });
        },
      },
    ]);
  }

  return (
    <TouchableOpacity onPress={handlePress} disabled={loading}>
      <Ionicons name='trash-outline' size={22} color={COLORS.accent.danger} />
    </TouchableOpacity>
  );
}
