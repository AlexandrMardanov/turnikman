import { Alert } from 'react-native';

import { useRouter } from 'expo-router';

type UseWeightEntryActionsParams = {
  entryId: string;
  onDelete: (id: string) => Promise<void>;
};

export function useWeightEntryActions(params: UseWeightEntryActionsParams) {
  const { entryId, onDelete } = params;
  const router = useRouter();

  function handleDelete() {
    Alert.alert('Видалити запис', 'Ви впевнені, що хочете видалити цей запис?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => {
          onDelete(entryId).catch((err) => {
            Alert.alert('Помилка', (err as Error).message);
          });
        },
      },
    ]);
  }

  function handleEdit() {
    router.push(`/(tabs)/(weight)/add-edit?id=${entryId}`);
  }

  return {
    handleDelete,
    handleEdit,
  };
}
