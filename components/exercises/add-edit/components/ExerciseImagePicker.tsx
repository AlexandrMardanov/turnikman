import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

import { useExerciseImagePicker } from '../hooks/useExerciseImagePicker';
import { ImagePreview } from './ImagePreview';
import { ImageUrlModal } from './ImageUrlModal';

type ExerciseImagePickerProps = {
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
};

export function ExerciseImagePicker(props: ExerciseImagePickerProps) {
  const { imageUri, onImageChange } = props;

  const {
    urlModalVisible,
    urlInput,
    setUrlInput,
    handlePickImage,
    handleOpenUrlModal,
    handleSaveUrl,
    handleCancelUrl,
  } = useExerciseImagePicker({ onImageChange });

  if (imageUri) {
    return <ImagePreview uri={imageUri} onRemove={() => onImageChange(null)} />;
  }

  return (
    <>
      <View style={styles.imagePickerRow}>
        <TouchableOpacity style={styles.imagePickerBtn} onPress={handlePickImage}>
          <Ionicons name='image-outline' size={20} color={COLORS.text.secondary} />
          <Text style={styles.imagePickerText}>Галерея</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePickerBtn} onPress={handleOpenUrlModal}>
          <Ionicons name='link-outline' size={20} color={COLORS.text.secondary} />
          <Text style={styles.imagePickerText}>URL</Text>
        </TouchableOpacity>
      </View>
      <ImageUrlModal
        visible={urlModalVisible}
        url={urlInput}
        onChangeUrl={setUrlInput}
        onSave={handleSaveUrl}
        onCancel={handleCancelUrl}
      />
    </>
  );
}

const styles = StyleSheet.create({
  imagePickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  imagePickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    borderStyle: 'dashed',
    backgroundColor: COLORS.background.secondary,
  },
  imagePickerText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text.secondary,
  },
});
