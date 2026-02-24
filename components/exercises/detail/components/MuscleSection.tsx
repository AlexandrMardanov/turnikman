import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type MuscleSectionProps = {
  label: string;
  muscles: string[];
  secondary?: boolean;
};

export function MuscleSection(props: MuscleSectionProps) {
  const { label, muscles, secondary = false } = props;

  return (
    <View style={styles.muscleSection}>
      <Text style={styles.muscleLabel}>{label}</Text>
      <View style={styles.muscleChips}>
        {muscles.map((m) => (
          <View key={m} style={[styles.muscleChip, secondary && styles.muscleChipSecondary]}>
            <Text style={[styles.muscleChipText, secondary && styles.muscleChipTextSecondary]}>{m}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  muscleSection: {
    marginBottom: 8,
  },
  muscleLabel: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  muscleChip: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  muscleChipSecondary: {
    backgroundColor: COLORS.background.primary,
  },
  muscleChipText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.text.primary,
  },
  muscleChipTextSecondary: {
    color: COLORS.text.secondary,
  },
});
