import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type WeightStatsProps = {
  min: number;
  max: number;
  count: number;
};

export function WeightStats(props: WeightStatsProps) {
  const { min, max, count } = props;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{min.toFixed(1)}</Text>
        <Text style={styles.statLabel}>Мін</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{max.toFixed(1)}</Text>
        <Text style={styles.statLabel}>Макс</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{count}</Text>
        <Text style={styles.statLabel}>Записів</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
});
