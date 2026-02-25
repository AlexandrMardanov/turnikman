import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ModalShell } from '@/components/shared/ModalShell';

type ImageUrlModalProps = {
  visible: boolean;
  url: string;
  onChangeUrl: (url: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ImageUrlModal(props: ImageUrlModalProps) {
  const { visible, url, onChangeUrl, onSave, onCancel } = props;

  return (
    <ModalShell visible={visible} title='Посилання на зображення' onClose={onCancel}>
      <Input
        value={url}
        onChangeText={onChangeUrl}
        placeholder='https://...'
        autoCapitalize='none'
        keyboardType='url'
        autoFocus
        style={styles.input}
      />
      <View style={styles.buttonRow}>
        <Button title='Зберегти' onPress={onSave} variant='primary' style={styles.button} />
        <Button title='Скасувати' onPress={onCancel} variant='danger' style={styles.button} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
