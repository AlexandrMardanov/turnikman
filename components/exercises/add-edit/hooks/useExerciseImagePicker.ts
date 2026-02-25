import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';

type UseExerciseImagePickerProps = {
  onImageChange: (uri: string | null) => void;
};

export function useExerciseImagePicker(props: UseExerciseImagePickerProps) {
  const { onImageChange } = props;

  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled && result.assets[0]) {
      onImageChange(result.assets[0].uri);
    }
  }

  function handleOpenUrlModal() {
    setUrlModalVisible(true);
  }

  function handleSaveUrl() {
    const trimmed = urlInput.trim();
    onImageChange(trimmed.length > 0 ? trimmed : null);
    setUrlModalVisible(false);
  }

  function handleCancelUrl() {
    setUrlModalVisible(false);
  }

  return {
    urlModalVisible,
    urlInput,
    setUrlInput,
    handlePickImage,
    handleOpenUrlModal,
    handleSaveUrl,
    handleCancelUrl,
  };
}
