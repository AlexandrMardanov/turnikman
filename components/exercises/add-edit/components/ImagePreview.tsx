import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';

type ImagePreviewProps = {
  uri: string;
  onRemove: () => void;
};

export function ImagePreview(props: ImagePreviewProps) {
  const { uri, onRemove } = props;

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode='cover' />
      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name='close-circle' size={24} color={COLORS.accent.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
