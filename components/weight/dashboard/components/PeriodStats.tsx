import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { type PeriodStats as PeriodStatsType } from '../utils/calculatePeriodStats';

type PeriodStatsProps = {
  stats: PeriodStatsType;
};

export function PeriodStats(props: PeriodStatsProps) {
  const { stats } = props;

  if (stats.change === null) {
    return null;
  }

  const isPositive = stats.change > 0;
  const isNeutral = stats.change === 0;
  const changeColor = isNeutral ? COLORS.text.secondary : isPositive ? COLORS.accent.danger : COLORS.accent.success;
  const changeSign = isPositive ? '+' : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Статистика за період</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Початкова вага</Text>
          <Text style={styles.statValue}>{stats.startWeight?.toFixed(1)} кг</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Поточна вага</Text>
          <Text style={styles.statValue}>{stats.endWeight?.toFixed(1)} кг</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Зміна</Text>
          <Text style={[styles.statValue, { color: changeColor }]}>
            {changeSign}
            {stats.change.toFixed(1)} кг
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Відсоток</Text>
          <Text style={[styles.statValue, { color: changeColor }]}>
            {changeSign}
            {stats.changePercent?.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});
