import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ModalShell } from '@/components/shared/ModalShell';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type ImageUrlModalProps = {
  visible: boolean;
  url: string;
  error?: string | null;
  onChangeUrl: (url: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ImageUrlModal(props: ImageUrlModalProps) {
  const { visible, url, error, onChangeUrl, onSave, onCancel } = props;

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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonRow}>
        <Button title='Зберегти' onPress={onSave} variant='primary' style={styles.button} />
        <Button title='Скасувати' onPress={onCancel} variant='danger' style={styles.button} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
  error: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
