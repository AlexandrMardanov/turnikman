import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export function ExerciseLogSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Історія</Text>
      <Text style={styles.emptyText}>Немає записів</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 17,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
