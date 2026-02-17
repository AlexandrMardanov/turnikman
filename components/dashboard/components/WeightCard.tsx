import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useWeightReminderContext } from '@/contexts/WeightReminderContext';

import { type DashboardWeightData } from '../hooks/useDashboardData';
import { formatDate } from '../utils/formatDate';
import { formatShortDate } from '../utils/formatShortDate';
import { WeightStats } from './WeightStats';
import { WeightTrend } from './WeightTrend';

type WeightCardProps = {
  data: DashboardWeightData;
};

export function WeightCard(props: WeightCardProps) {
  const { data } = props;
  const router = useRouter();
  const { shouldShowBadge } = useWeightReminderContext();

  function handlePress() {
    router.push('/(tabs)/(weight)');
  }

  function handleAddWeight() {
    router.push('/(tabs)/(weight)/add-edit');
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name='body' size={20} color={COLORS.text.primary} />
          <Text style={styles.title}>Вага</Text>
          <View style={styles.periodBadge}>
            <Text style={styles.periodText}>
              {formatShortDate(data.periodStart)} – {formatShortDate(data.periodEnd)}
            </Text>
          </View>
        </View>
        <Ionicons name='chevron-forward' size={20} color={COLORS.text.secondary} />
      </View>

      <View style={styles.content}>
        <View style={styles.weightRow}>
          <View style={styles.currentWeight}>
            <Text style={styles.weightValue}>{data.currentWeight.toFixed(1)}</Text>
            <Text style={styles.weightUnit}>кг</Text>
          </View>
          <View style={styles.dateContainer}>
            <View style={[styles.dateBadge, shouldShowBadge && styles.dateBadgeWarning]}>
              <Text style={[styles.dateText, shouldShowBadge && styles.dateTextWarning]}>
                {formatDate(data.currentDate)}
              </Text>
            </View>
            {shouldShowBadge && (
              <TouchableOpacity style={styles.addButton} onPress={handleAddWeight} activeOpacity={0.7}>
                <Ionicons name='add' size={18} color={COLORS.text.inverse} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.variantContainer}>
          <WeightStats min={data.min} max={data.max} count={data.count} />
        </View>

        {data.monthChange !== null && data.monthChangePercent !== null && (
          <View style={styles.variantContainer}>
            <WeightTrend change={data.monthChange} changePercent={data.monthChangePercent} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
  },
  content: {
    gap: 8,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  currentWeight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weightValue: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
  },
  weightUnit: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.text.secondary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateBadge: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateBadgeWarning: {
    backgroundColor: `${COLORS.accent.danger}20`,
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.text.primary,
  },
  dateTextWarning: {
    color: COLORS.accent.danger,
  },
  addButton: {
    backgroundColor: COLORS.accent.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  changePeriod: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
  variantContainer: {
    marginTop: 12,
  },
  periodBadge: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
});
