import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type PickerOption<T extends string> = { value: T; label: string };

type ChipSelectorProps<T extends string> = {
  options: PickerOption<T>[];
  value: T;
  onChange: (v: T) => void;
};

export function ChipSelector<T extends string>(props: ChipSelectorProps<T>) {
  const { options, value, onChange } = props;

  return (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.chip, value === opt.value && styles.chipActive]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={[styles.chipText, value === opt.value && styles.chipTextActive]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.background.primary,
  },
  chipActive: {
    backgroundColor: COLORS.accent.primary,
    borderColor: COLORS.accent.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.text.secondary,
  },
  chipTextActive: {
    color: COLORS.text.inverse,
  },
});
