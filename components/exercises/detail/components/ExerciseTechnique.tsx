import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type ExerciseTechniqueProps = {
  technique: string;
};

export function ExerciseTechnique(props: ExerciseTechniqueProps) {
  const { technique } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Техніка виконання</Text>
      <Text style={styles.text}>{technique}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});
