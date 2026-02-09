import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { WeightEntry } from '@/lib/weight-service';

import { useWeightEntryActions } from '../hooks/useWeightEntryActions';
import { formatFullDate } from '../utils/formatFullDate';

type WeightEntryItemProps = {
  entry: WeightEntry;
  change: number;
  onDelete: (id: string) => Promise<void>;
};

export function WeightEntryItem(props: WeightEntryItemProps) {
  const { entry, change, onDelete } = props;
  const { handleDelete, handleEdit } = useWeightEntryActions({
    entryId: entry.id,
    onDelete,
  });

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.date}>{formatFullDate(entry.date)}</Text>
        <View style={styles.weightRow}>
          <Text style={styles.weight}>{entry.weight} кг</Text>
          {change !== 0 && (
            <Text style={[styles.change, change < 0 ? styles.changePositive : styles.changeNegative]}>
              {change > 0 ? '+' : ''} {change.toFixed(1)} кг
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
          <Ionicons name='create-outline' size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <Ionicons name='trash-outline' size={20} color={COLORS.accent.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weight: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
  },
  change: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  changePositive: {
    color: COLORS.accent.success,
  },
  changeNegative: {
    color: COLORS.accent.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
});
