import { Image, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';

type ExerciseImageProps = {
  imageUrl: string | null;
};

export function ExerciseImage(props: ExerciseImageProps) {
  const { imageUrl } = props;

  if (!imageUrl) {
    return (
      <View style={[styles.image, styles.placeholder]}>
        <Ionicons name='image-outline' size={96} color={COLORS.text.tertiary} />
      </View>
    );
  }

  return <Image source={{ uri: imageUrl }} style={styles.image} resizeMode='cover' />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholder: {
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
